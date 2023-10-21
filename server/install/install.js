// 安装

// 导入配置文件
const { installConfig } = require("../config/config");

// 初始化配置项
const { databaseTable } = installConfig;

// 导入模块
const { operateDb } = require("../model/conn"); // 数据库模块
const { logger } = require("../model/log4js"); // 日志模块

logger.debug("开始安装");
logger.debug("开始创建数据表");

const SQL_INIT = `
    CREATE TABLE IF NOT EXISTS ${databaseTable}(
      id INT UNSIGNED AUTO_INCREMENT,
      title VARCHAR(1000),
      date VARCHAR(100),
      base64 VARCHAR(10000),
      url JSON,
      color JSON,
      timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `;

async function install() {
  await operateDb(SQL_INIT, null).then((result) => {
    logger.info("数据表创建成功");
  });
  logger.info("安装完成");
  process.exit();
}

install();
