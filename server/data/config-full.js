// 用户配置文件 config.js

// 基础配置
const baseConfig = {
  port: 3000, // 服务启动端口号
  updateTime: "00:01:00", // 每天更新时间 (开始从必应官方服务器下载图片的时间)
  DelayTime: 5, // 延迟时间（分钟） 即每天00:05：00的时候才显示当天的图片。性能较差的实例应适当调大此值 (仅针对'/api/getImage'接口)
  surviveDays: 90, // 图片存活天数（即图片保存多少天，到期即清理） 0为不清理
  retryTimeout: 10000, // 错误重试间隔。共重试10次，每次间隔时间递增，这里指的是首次间隔时间 (单位:ms)
  key: 'abcdefgh', // 鉴权密钥。用于需要鉴权才能访问的接口
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

// 网站信息配置
const infoConfig = {
  link: [
    {
      label: "白馬空谷的主页", // 链接名称
      url: "https://www.mcloc.cn/" // 链接地址
    },
    {
      label: "白馬空谷的博客",
      url: "https://blog.mcloc.cn/"
    }
  ],
  htmlSlot: {
    beforeFooter: ``, // 页脚上方HTML插槽
    afterFooter: `<a style="margin-right: 10px;" target="_blank" href="https://beian.miit.gov.cn/">晋ICP备20001086号-1</a>
  <a style="margin-right: 10px; display: flex; align-items: center;" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41080202000141">
    <img style="width: 14px; margin-right: 6px;" src="https://www.mcloc.cn/wp-content/uploads/2020/04/beiantubiao-19.png"/>
    <span>豫公网安备 41080202000141号</span>
  </a>` // 页脚下方HTML插槽
  }
}

module.exports = {
  baseConfig,
  databaseConfig,
  infoConfig,
};
