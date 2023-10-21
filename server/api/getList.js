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
const getList = (req, res) => {
	// sql注入过滤
	let pageSize = isNaN(parseInt(req.query?.pageSize))
		? 1
		: parseInt(req.query?.pageSize);
	let currentPage = isNaN(parseInt(req.query?.currentPage))
		? 0
		: parseInt(req.query?.currentPage) - 1;
	// 限制查询范围
	if (pageSize <= 0) {
		pageSize = 1;
	}
	if (currentPage < 0) {
		currentPage = 0;
	}
	const SQL_GET_LIST = `
  SELECT *
  FROM ${databaseTable}
  ORDER BY id DESC
  LIMIT ${pageSize} OFFSET ${currentPage * pageSize};`;
	const SQL_GET_TOTLE = `SELECT COUNT(*) totle FROM ${databaseTable};`;
	const list = operateDb(SQL_GET_LIST, null);
	const totle = operateDb(SQL_GET_TOTLE, null);
	Promise.all([totle, list])
		.then((values) => {
			res.send({
				totle: values[0].data[0].totle,
				list: reduceRes(values[1].data),
			});
		})
		.catch((err) => {
			logger.error("发生了错误 " + err.data);
			res.send("发生了错误 " + err.data);
		});
}

module.exports = {
	getList,
};
