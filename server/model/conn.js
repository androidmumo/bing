// 数据库模块

// 导入配置文件
const { databaseConfig } = require("../config/config");
const { eventBus } = require("./eventBus"); // 事件总线

// 导入模块
const { logger } = require("./log4js"); // 日志模块

// 导入第三方模块
const mysql = require("mysql");

// 创建一个数据库连接池
let pool = mysql.createPool(databaseConfig);

//定义创建数据库链接函数
const operateDb = function (sql, sqlParams) {
  return new Promise((resolve, reject) => {
    //使用
    pool.getConnection((err, connection) => {
      if (err) {
        eventBus.emit("on-error", "operateDb1");
        logger.error("数据库连接失败 " + err);
        reject({ code: 0, data: err });
      } else {
        connection.query(sql, sqlParams, function (err, result) {
          if (err) {
            eventBus.emit("on-error", "operateDb2");
            logger.error("数据库错误 " + err.message);
            reject({ code: 0, data: err });
          }
          resolve({ code: 1, data: result });
        });
        //释放
        connection.release();
      }
    });
  });
};

module.exports = {
  operateDb,
};
