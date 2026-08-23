// 导入配置文件
const {
	installConfig,
} = require("../config/config");

// 初始化配置项
const { databaseTable } = installConfig;

// 导入模块
const { logger } = require("../model/log4js"); // 日志模块
const { operateDb } = require("../model/conn"); // 数据库模块

const { reduceRes } = require("../utils/reduceRes");

// 获取随机图片列表
const getRandom = (req, res) => {
	let count = isNaN(parseInt(req.query?.count))
		? 9
		: parseInt(req.query?.count);
	// 限制查询范围
	if (count <= 0) {
		count = 9;
	}
	if (count > 50) {
		count = 50;
	}

	const SQL_GET_RANDOM = `
		SELECT *
		FROM ${databaseTable}
		ORDER BY RANDOM()
		LIMIT ?;`;
	operateDb(SQL_GET_RANDOM, [count])
		.then((values) => {
			res.send({
				count: values.data.length,
				list: reduceRes(values.data),
			});
		})
		.catch((err) => {
			logger.error("发生了错误 " + err);
			res.send("发生了错误 " + err);
		});
}

module.exports = {
	getRandom,
};
