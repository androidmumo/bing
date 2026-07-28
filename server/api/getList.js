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

const escapeLike = (value) => value.replace(/[\\%_]/g, "\\$&");

const isValidDate = (value) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const parsed = new Date(`${value}T00:00:00Z`);
	return !Number.isNaN(parsed.getTime()) &&
		parsed.toISOString().slice(0, 10) === value;
};

// 获取图片列表
const getList = (req, res) => {
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
	if (pageSize > 100) {
		pageSize = 100;
	}
	if (currentPage < 0) {
		currentPage = 0;
	}
	const date = String(req.query?.date || "").trim();
	const keyword = String(req.query?.keyword || "").trim().slice(0, 100);
	if (date && !isValidDate(date)) {
		return res.status(400).send({
			message: "date 参数必须是有效的 YYYY-MM-DD 日期",
		});
	}

	const conditions = [];
	const filterParams = [];
	if (date) {
		conditions.push("date = ?");
		filterParams.push(date);
	}
	if (keyword) {
		const keywordPattern = `%${escapeLike(keyword)}%`;
		conditions.push(`(
			COALESCE(title, '') LIKE ? ESCAPE '\\'
			OR COALESCE(copyright, '') LIKE ? ESCAPE '\\'
		)`);
		filterParams.push(keywordPattern, keywordPattern);
	}
	const whereClause =
		conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

	const SQL_GET_LIST = `
  SELECT *
  FROM ${databaseTable}
  ${whereClause}
  ORDER BY id DESC
  LIMIT ? OFFSET ?;`;
	const SQL_GET_TOTLE = `
		SELECT COUNT(*) totle
		FROM ${databaseTable}
		${whereClause};
	`;
	const list = operateDb(SQL_GET_LIST, [
		...filterParams,
		pageSize,
		currentPage * pageSize,
	]);
	const totle = operateDb(SQL_GET_TOTLE, filterParams);
	Promise.all([totle, list])
		.then((values) => {
			const total = values[0].data[0].totle;
			res.send({
				totle: total,
				total,
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
