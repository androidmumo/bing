// 定时任务

// 引入配置文件
const { baseConfig } = require("../config/config");

// 初始化配置项
let { updateTime } = baseConfig;

// 引入模块
const { eventBus } = require("./eventBus"); // 事件总线

// 第三方模块
const CronJob = require("cron").CronJob;

// 处理 updateTime
const updateTimeArr = updateTime.split(":");
const updateTimeCron = `${updateTimeArr[2]} ${updateTimeArr[1]} ${updateTimeArr[0]} * * *`;

// 创建定时任务函数
const updateJob = new CronJob(updateTimeCron, function () {
  eventBus.emit("to-update");
});

// 实例化定时任务
const startUpdateJob = function () {
  updateJob.start();
};

module.exports = {
  startUpdateJob,
};
