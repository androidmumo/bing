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

// 获取图片列表
const getInfo = (req, res) => {
	// sql注入过滤
	let id = isNaN(parseInt(req.query?.id))
		? 1
		: parseInt(req.query?.id);
	// 限制查询范围
	if (id <= 0) {
		id = 1;
	}
	const SQL_GET_INFO = `SELECT * FROM ${databaseTable} WHERE id=${id}`;
	const info = operateDb(SQL_GET_INFO, null);
	Promise.all([info])
		.then((values) => {
			res.send({
				info: reduceRes(values[0].data)[0],
			});
		})
		.catch((err) => {
			logger.error("发生了错误 " + err);
			res.send("发生了错误 " + err);
		});
}

module.exports = {
	getInfo,
};
