// sqlite数据库模块
// 原生模块
const path = require('path');

// 第三方模块
const sqlite3 = require('sqlite3');

// 导入配置文件
const { databaseConfig } = require("../config/config");
const { eventBus } = require("./eventBus"); // 事件总线

// 导入模块
const { logger } = require("./log4js"); // 日志模块

// 定义数据库
let db = null;

// 初始化SQLite
const initSQLite = () => {
    let rootPath = path.join(__dirname, './db/sqlite3.db');
    db = new sqlite3.Database(rootPath, (err) => {
        if (err) {
			eventBus.emit("on-error", "operateDb1");
			logger.error("数据库初始化失败 " + err);
			throw err;
		}
		logger.info('数据库初始化完成');
    })
}

initSQLite();

// db.run
const dbRun = (sql, sqlParams = []) => {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.run(sql, sqlParams, res => {
				if (res === null) {
					resolve({ code: 1 });
					return;
				}
				eventBus.emit("on-error", "operateDb2");
				logger.error("数据库错误 " + res);
				reject({ code: 0, data: res });
			});
		});
	});
}

// db.each
const dbEach = (sql, sqlParams = []) => {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.each(sql, sqlParams, (err, row) => {
				if (err) {
					eventBus.emit("on-error", "operateDb2");
					logger.error("数据库错误 " + err.message);
					reject({ code: 0, data: err });
				}
				resolve({ code: 1, data: row });
			});
		});
	});
}

// db.all
const dbAll = (sql, sqlParams = []) => {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.all(sql, sqlParams, (err, row) => {
				if (err) {
					eventBus.emit("on-error", "operateDb2");
					logger.error("数据库错误 " + err.message);
					reject({ code: 0, data: err });
				}
				resolve({ code: 1, data: row });
			});
		});
	});
}

module.exports = {
	dbRun,
	dbEach,
	dbAll,
};