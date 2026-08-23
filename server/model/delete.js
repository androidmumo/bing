// 清理过期图片

// 导入配置文件
const { installConfig } = require("../config/config");
const { baseConfig } = require("../data/config");

// 初始化配置项
const { surviveDays, retryTimeout } = baseConfig;
const { dir, databaseTable } = installConfig;

// 导入模块
const { logger } = require("./log4js"); // 日志模块
const { operateDb } = require("./conn"); // 数据库模块
const { delDirectory, rmEmptyDir } = require("./fileOperations"); // 文件操作模块
const { eventBus } = require("./eventBus"); // 事件总线

// 原生模块
const fs = require("fs");

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

	// 兜底:清理所有超期日期的图片目录(此前仅删"恰好超期那天",历史遗留的更早目录会漏删)
	for (let offset = 0; ; offset++) {
		const d = expiredDate.subtract(offset, 'day');
		const expiredDir = `${dir}/${d.format("YYYY")}/${d.format("MM")}/${d.format("DD")}`;
		if (!fs.existsSync(expiredDir)) {
			// 连续 400 天都不存在才停止(避免历史空洞导致提前退出)
			if (offset > 400) break;
			continue;
		}
		delDirectory(expiredDir);
	}

	// 删除空目录
	rmEmptyDir(dir);

	// 清理数据库数据(一次性删除所有超期记录,防止进程中断导致僵尸记录累积)
	const SQL_DELETE = `DELETE FROM ${databaseTable} WHERE date < ?;`
	await operateDb(SQL_DELETE, [expiredDate.format("YYYY-MM-DD")]).then((result) => {
		logger.info("数据库-(清理)写入成功");
	});
	logger.info("清理成功 截止日期: " + expiredDate.format("YYYY-MM-DD"));

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
