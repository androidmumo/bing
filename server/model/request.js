// 请求外部接口模块

// 导入模块
const { logger } = require("./log4js"); // 日志模块
const { eventBus } = require("./eventBus"); // 事件总线

// 导入第三方模块
const axios = require("axios");

// 请求接口 获取bing官方JSON数据
const getBingJson = function () {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url:
        "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN",
    })
      .then((response) => {
        logger.info("获取bingJson成功");
        resolve(response.data);
      })
      .catch((err) => {
        eventBus.emit("on-error", "getBingJson");
        logger.error("获取bingJson失败 " + err);
        reject(err);
      });
  });
};

module.exports = {
  getBingJson,
};
