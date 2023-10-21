// 清理过期图片

// 导入配置文件
const {
	baseConfig,
	installConfig,
} = require("../config/config");

// 初始化配置项
const { dir, surviveDays, retryTimeout } = baseConfig;
const { databaseTable } = installConfig;

// 导入模块
const { logger } = require("./log4js"); // 日志模块
const { operateDb } = require("./conn"); // 数据库模块
const { delDirectory } = require("./fileOperations"); // 文件操作模块
const { eventBus } = require("./eventBus"); // 事件总线

// 第三方模块
const dayjs = require("dayjs");

// 错误收集器
let errorList = []; // 错误列表
let retryTime = 0; // 重试次数
eventBus.on("on-error", (error) => {
	errorList.push(error);
});

const deleteExpired = async () => {
	if (surviveDays <= 0) return; // 小于等于0则不清理
	const expiredDate = dayjs().subtract(surviveDays, 'day');
	const expiredDir = `${dir}/${expiredDate.format("YYYY")}/${expiredDate.format(
		"MM"
	)}/${expiredDate.format("DD")}`;

	// 删除图片
	delDirectory(expiredDir);

	// 清理数据库数据
	const SQL_DELETE = `DELETE FROM ${databaseTable} WHERE date='${expiredDate.format("YYYY-MM-DD")}';`
	await operateDb(SQL_DELETE, null).then((result) => {
		logger.info("数据库-(清理)写入成功");
	});

	// 重试逻辑
	if (errorList.length === 0) {
		logger.info("成功");
		// res.send("成功");
	} else {
		if (retryTime >= 3) {
			retryTime = 0;
			logger.error("失败 " + errorList);
			return;
		}
		retryTime++;
		logger.error("发生了错误,正在重试中 次数: " + retryTime);
		errorList = [];
		setTimeout(function () {
			deleteExpired();
		}, retryTimeout);
	}
};

// run
deleteExpired();
