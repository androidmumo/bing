// 安装

// 导入配置文件
const { installConfig } = require("../config/config");

// 初始化配置项
const { databaseTable, databaseTableInfo } = installConfig;

// 导入模块
const { operateDb } = require("./conn"); // 数据库模块
const { logger } = require("./log4js"); // 日志模块

const SQL_INIT_DATA = `
    CREATE TABLE IF NOT EXISTS ${databaseTable} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      copyright TEXT,
      date TEXT NOT NULL UNIQUE,
      base64 TEXT,
      url TEXT,
      color TEXT,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

const SQL_INIT_INFO = `
  CREATE TABLE IF NOT EXISTS ${databaseTableInfo} (
    id INTEGER PRIMARY KEY,
    version INTEGER NOT NULL,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

async function install() {
  logger.debug("开始安装");
  logger.debug("开始创建数据表");
  await operateDb(SQL_INIT_DATA, null).then((result) => {
    logger.info("数据表创建成功-数据");
  });
  await operateDb(SQL_INIT_INFO, null).then((result) => {
    logger.info("数据表创建成功-信息");
  });
  logger.info("安装完成");
}

module.exports = {
  install,
};
