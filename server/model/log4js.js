// 日志模块

// 导入第三方模块
const log4js = require("log4js");

log4js.configure({
  appenders: {
    fileout: {
      type: "file",
      filename: "./log/fileout.log",
      maxLogSize: 10240,
    },
    consoleout: { type: "console" },
  },
  categories: {
    default: { appenders: ["consoleout"], level: "debug" },
    anything: { appenders: ["fileout", "consoleout"], level: "debug" },
  },
});

let logger = log4js.getLogger("anything");

module.exports = {
  logger,
};
