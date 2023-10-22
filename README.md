<div align="center">
    <h1>必应每日一图</h1>
    <p>每天更新一张图片（来源：必应）。诗曰：沉舟侧畔千帆过。一起来领略世界之美吧！</p>
    <p>DEMO（基于此仓库实时部署）: https://bing.mcloc.cn</p>
</div>

## Docker部署

1.参照以下模板在本地目录中新建config.js文件

```
// 用户配置文件 config.js

// 基础配置
const baseConfig = {
  port: 3000, // 服务启动端口号(请勿更改)
  updateTime: "00:01:00", // 每天更新时间
  DelayTime: 5, // 延迟时间（分钟） 即每天00:05：00的时候才显示当天的图片。性能较差的实例应适当调大此值
  surviveDays: 90, // 图片存活天数（即图片保存多少天，到期即清理） 0为不清理
  retryTimeout: 10000, // 错误重试间隔 (单位:ms)
};

// 数据库配置 (注意：除数据库连接池大小外，以下配置项提及的内容需在安装前准备好并填入)
const databaseConfig = {
  host: "127.0.0.1", // 数据库链接地址
  port: "3306", // 数据库连接端口
  database: "bing", // 数据库名
  user: "bing", // 数据库用户名
  password: "bing", // 数据库密码
  connectionLimit: 100, // 数据库连接池大小
};

module.exports = {
  baseConfig,
  databaseConfig,
};

```

2.映射目录: 本地目录 > /usr/src/app/data

3.启动容器
