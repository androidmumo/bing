// 配置文件 config.js

// 基础配置
const baseConfig = {
  port: 3000, // 服务启动端口号
  dir: "resources", // 图片在服务端的真实保存路径 (相对于根目录、首尾不能为’/‘)
  updateTime: "00:01:00", // 每天更新时间
  DelayTime: 5, // 延迟时间（分钟） 即每天00:05：00的时候才显示当天的图片。性能较差的实例应适当调大此值
  surviveDays: 90, // 图片存活天数（即图片保存多少天，到期即清理） 0为不清理
  retryTimeout: 10000, // 错误重试间隔 (单位:ms)
};

// 安装配置
const installConfig = {
  databaseTable: "bing", // 数据库表名 (可在安装前更改)
}

// API基础配置 (此处信息要写入数据库，真实、外部可访问的)
const apiBaseConfig = {
  dbHost: "https://api.mcloc.cn/bing", // 域名 (首尾不能为’/‘)
  dbPort: 80, // 外部访问端口号
  static: "img", // 图片静态托管路径 (url访问图片时的路径、首尾不能为’/‘)
}

// API接口后缀配置(接口url后缀、首尾不能为’/‘)
const apiConfig = {
  UPDATE: "update", // 手动更新图片（仅开发模式可访问）
  DELETE: "delete", // 手动清理图片（仅开发模式可访问）
  GET_LIST: "getList", // 获取图片列表
  GET_INFO: "getInfo", // 获取图片详情
};

// 数据库配置 (注意：除数据库连接池大小外，以下配置项提及的内容需在安装前准备好并填入)
const databaseConfig = {
  host: "localhost", // 数据库链接地址
  port: "3306", // 数据库连接端口
  database: "testdb", // 数据库名
  user: "root", // 数据库用户名
  password: "11111111", // 数据库密码
  connectionLimit: 100, // 数据库连接池大小
};

module.exports = {
  baseConfig,
  installConfig,
  apiBaseConfig,
  apiConfig,
  databaseConfig,
};
