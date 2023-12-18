// 内部配置文件 config.js

// 安装配置
const installConfig = {
  databaseVersion: 1,
  dir: "data/resources", // 图片在服务端的真实保存路径 (相对于根目录、首尾不能为’/‘)
  databaseTable: "bing", // 数据库表名-数据 (可在安装前更改)
  databaseTableInfo: "info", // 数据库表名-信息 (可在安装前更改)
}

// API基础配置
const apiBaseConfig = {
  static: "img", // 图片静态托管路径 (url访问图片时的路径、首尾不能为’/‘)
}

// API接口后缀配置(接口url后缀、首尾不能为’/‘)
const apiConfig = {
  UPDATE: "api/update", // 手动更新图片（需要key）
  DELETE: "api/delete", // 手动清理图片（需要key）
  GET_IMAGE: "api/getImage", // 获取当天图片
  GET_LIST: "api/getList", // 获取图片列表
  GET_INFO: "api/getInfo", // 获取图片详情
  GET_WEBINFO: "api/getWebInfo", // 获取网站信息
};

module.exports = {
  installConfig,
  apiBaseConfig,
  apiConfig,
};
