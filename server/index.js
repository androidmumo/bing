// 导入配置文件
const {
  installConfig,
  apiBaseConfig,
  apiConfig,
} = require("./config/config");
const { baseConfig } = require("./data/config");

// 初始化配置项
const { port, DelayTime, key } = baseConfig;
const { dir } = installConfig;
const { static } = apiBaseConfig;
const { UPDATE, DELETE, GET_IMAGE, GET_LIST, GET_INFO } = apiConfig;

// 导入模块
const { logger } = require("./model/log4js"); // 日志模块
const { eventBus } = require("./model/eventBus"); // 事件总线
const { startUpdateJob } = require("./model/cron"); // 定时任务
const { install } = require("./model/install"); // 初始化数据库

// 原生模块
const childProcess = require("child_process");
const path = require("path");

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
// 初始化数据库
install();

// 用子进程更新图片
const updateBingByChildProcess = function () {
  childProcess.fork("./model/update.js");
};

// 用子进程清理图片
const deleteBingByChildProcess = function () {
  childProcess.fork("./model/delete.js");
};

// 定时任务
startUpdateJob();
eventBus.on("to-update", () => {
  updateBingByChildProcess();
  deleteBingByChildProcess();
});

// 首次运行时更新图片
updateBingByChildProcess();
// ------ 逻辑代码 end------

// ------ 接口 start------
// 静态托管
app.use(`/${static}`, express.static(dir));
const distPath = path.resolve(__dirname, './dist');
app.use(express.static(distPath));

// 跨域
app.use(cors());

app.use((req, res, next) => {
  const needAuthUrl = [
    `/${UPDATE}`,
    `/${DELETE}`,
  ]
  if (!needAuthUrl.includes(req.url)) return next();
  if (key && req.query?.key && req.query?.key === key) return next();
  return res.send({
    message: 'key不正确或没有配置',
  })
})

// 需要鉴权的API
const authApi = () => {
  // 更新图片
  app.get(`/${UPDATE}`, updateBingByChildProcess);

  // 清理图片
  app.get(`/${DELETE}`, deleteBingByChildProcess);
}

// const args = process.argv.splice(2);
// if (args.includes('dev')) {
//   authApi();
// }
authApi();

const getImage = (req, res) => {
  const afterDelayTime = dayjs().subtract(DelayTime, 'minute');
  const saveDir = `${dir}/${afterDelayTime.format("YYYY")}/${afterDelayTime.format(
    "MM"
  )}/${afterDelayTime.format("DD")}`;
  const fileDir = `${saveDir}/${afterDelayTime.format("YYYY-MM-DD")}_hd.jpg`;
  res.sendFile(process.cwd() + "/" + fileDir);
}

// 网页
app.get('/', (req, res) => {
  res.sendfile(`${distPath}/index.html`);
})

app.get(`/${GET_IMAGE}`, getImage); // 获取当天图片
app.get(`/${GET_LIST}`, getList); // 获取图片列表
app.get(`/${GET_INFO}`, getInfo); // 获取图片详情
// ------ 接口 end------

// 开始监听
app.listen(port, () => {
  logger.info(`app listening at http://localhost:${port}`);
});
