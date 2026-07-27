// 程序升级

// 导入配置文件
const {
	installConfig,
} = require("../config/config");

// 初始化配置项
const { databaseVersion, databaseTable, databaseTableInfo } = installConfig;

// 导入模块
const { logger } = require("./log4js"); // 日志模块
const { operateDb } = require("./conn"); // 数据库模块

const upgrade0to1 = async () => {
	logger.info("SQLite 数据库结构已初始化");
};

// 步进更新程序
const stepUpgradeList = {
	'0>1': upgrade0to1,
}

let currentVersion = 0;
let latestVersion = databaseVersion;

const getCurrentVersion = () => {
	const SQL_GET_INFO = `SELECT * FROM ${databaseTableInfo}`;
	const list = operateDb(SQL_GET_INFO, null);
	return Promise.all([list])
		.then((values) => {
			if (Array.isArray(values[0].data) && values[0].data.length === 0) {
				currentVersion = 0;
				return;
			}
			currentVersion = +values[0].data[0].version;
		})
		.catch((err) => {
			logger.error("发生了错误 " + err.data);
		});
}

const doUpgrade = async () => {
	if (latestVersion <= currentVersion) {
		logger.info('数据库已是最新版本');
		return;
	};
	if (latestVersion > currentVersion) {
		logger.info('数据库开始升级', `${currentVersion}>${currentVersion +1}`);
		await stepUpgradeList[`${currentVersion}>${currentVersion +1}`]();
		currentVersion++;
		await doUpgrade();
	}
}

const setCurrentVersion = async () => {
	const SQL_GET_INFO = `SELECT * FROM ${databaseTableInfo}`;
	const list = await operateDb(SQL_GET_INFO, null);
	if (Array.isArray(list.data) && list.data.length === 0) {
		const createSQL = `INSERT INTO ${databaseTableInfo} (id, version) VALUES (?, ?)`;
		return await operateDb(createSQL, [1, latestVersion]);
	}
	const updateSQL = `UPDATE ${databaseTableInfo}
		SET version = ?, timestamp = CURRENT_TIMESTAMP
		WHERE id = ?`;
	return await operateDb(updateSQL, [latestVersion, 1]);
}

const upgrade = async () => {
	logger.info('最新数据库版本: ', latestVersion);
	await getCurrentVersion();
	logger.info('当前数据库版本: ', currentVersion);
	await doUpgrade();
	await setCurrentVersion();
}

module.exports = {
	upgrade,
};
