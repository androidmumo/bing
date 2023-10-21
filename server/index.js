// 导入配置文件
const {
  baseConfig,
  apiBaseConfig,
  apiConfig,
} = require("./config/config");

// 初始化配置项
const { port, dir, DelayTime } = baseConfig;
const { static } = apiBaseConfig;
const { UPDATE, DELETE, GET_LIST, GET_INFO } = apiConfig;

// 导入模块
const { logger } = require("./model/log4js"); // 日志模块
const { eventBus } = require("./model/eventBus"); // 事件总线
const { startUpdateJob } = require("./model/cron"); // 定时任务

// 原生模块
const childProcess = require("child_process");

// 第三方模块
const dayjs = require("dayjs");
const cors = require("cors");

// 导入api
const { getList } = require("./api/getList");
const { getInfo } = require("./api/getInfo");

// 使用express框架
const express = require("express");
const app = new express();

// ------ 逻辑代码 start------
// 定时任务
startUpdateJob();
eventBus.on("to-update", () => {
  updateBingByChildProcess();
  deleteBingByChildProcess();
});

// 用子进程更新图片
const updateBingByChildProcess = function () {
  childProcess.fork("./model/update.js");
};

// 用子进程清理图片
const deleteBingByChildProcess = function () {
  childProcess.fork("./model/delete.js");
};
// ------ 逻辑代码 end------

// ------ 接口 start------
// 静态托管
app.use(`/${static}`, express.static(dir));

// 跨域
app.use(cors());

// 开发环境api
const allowApi = () => {
  // 更新图片
  app.get(`/${UPDATE}`, updateBingByChildProcess);

  // 清理图片
  app.get(`/${DELETE}`, deleteBingByChildProcess);
}

const args = process.argv.splice(2);
if (args.includes('dev')) {
  allowApi();
}

const getAvatar = (req, res) => {
  const afterDelayTime = dayjs().subtract(DelayTime, 'minute');
  const saveDir = `${dir}/${afterDelayTime.format("YYYY")}/${afterDelayTime.format(
    "MM"
  )}/${afterDelayTime.format("DD")}`;
  const fileDir = `${saveDir}/${afterDelayTime.format("YYYY-MM-DD")}_hd.jpg`;
  res.sendFile(process.cwd() + "/" + fileDir);
}

app.get('/', getAvatar);
app.get(`/${GET_LIST}`, getList); // 获取图片列表
app.get(`/${GET_INFO}`, getInfo); // 获取图片详情
// ------ 接口 end------

// 开始监听
app.listen(port, () => {
  logger.info(`app listening at http://localhost:${port}`);
});
