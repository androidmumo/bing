// SQLite 数据库模块
const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

// 导入配置文件
const { installConfig } = require("../config/config");
const { eventBus } = require("./eventBus"); // 事件总线

// 导入模块
const { logger } = require("./log4js"); // 日志模块

const serverRoot = path.resolve(__dirname, "..");
const databasePath = path.resolve(serverRoot, installConfig.databaseFile);
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

// 每个 Node 进程维护一个连接；WAL 允许 API 查询和更新子进程并发访问。
const database = new DatabaseSync(databasePath, { timeout: 5000 });
database.exec("PRAGMA journal_mode = WAL;");
database.exec("PRAGMA foreign_keys = ON;");
database.exec("PRAGMA busy_timeout = 5000;");

const normalizeParams = (sqlParams) => {
  if (sqlParams == null) return [];
  return Array.isArray(sqlParams) ? sqlParams : [sqlParams];
};

// 保留原有异步返回结构，减少业务层改动。
const operateDb = async function (sql, sqlParams) {
  try {
    const statement = database.prepare(sql);
    const params = normalizeParams(sqlParams);
    const isQuery = /^\s*(SELECT|PRAGMA|WITH|EXPLAIN)\b/i.test(sql);
    const result = isQuery
      ? statement.all(...params)
      : statement.run(...params);
    return { code: 1, data: result };
  } catch (err) {
    eventBus.emit("on-error", "operateDb");
    logger.error("数据库错误 " + err.message);
    throw { code: 0, data: err };
  }
};

module.exports = {
  databasePath,
  operateDb,
};
