# bing-serve

### 使用 node.js 构建的必应每日一图服务端

> 前端仓库: https://github.com/androidmumo/bing-vue



### 环境准备

- 本项目基于 `Node.js 14` 开发，建议运行环境的Node版本大于此版本
- MySql



### 配置

先在 `config/config.js` 下配置域名、端口号、数据库等信息:

```
// 基础配置
const baseConfig = {
  port: 3000, // 服务启动端口号
  dir: "resources", // 图片在服务端的真实保存路径 (相对于根目录、首尾不能为’/‘)
  updateTime: "00:01:00", // 每天更新时间
};

// 安装配置
const installConfig = {
  databaseTable: "bing", // 数据库表名 (可在安装前更改)
}

// API基础配置 (此处信息要写入数据库，真实、外部可访问的)
const apiBaseConfig = {
  dbHost: "https://bing.api.mcloc.cn", // 域名 (首尾不能为’/‘)
  dbPort: 80, // 外部访问端口号
  static: "img", // 图片静态托管路径 (url访问图片时的路径、首尾不能为’/‘)
}

// API接口后缀配置(接口url后缀、首尾不能为’/‘)
const apiConfig = {
  UPDATE: "update", // 手动更新图片
  GET_LIST: "getList", // 获取图片列表
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
```



### 安装

##### 安装依赖

```
npm install
```

##### 执行 `bing-serve` 的安装程序

```
npm run install
```



### 启动

```
npm run serve
```



### 接口文档

##### GET_LIST 获取列表（分页）

请求方法: `GET`

默认地址: `http://localhost:3000/getList` 

参数(query):

| Key         | Value  | 说明         |
| ----------- | ------ | ------------ |
| pageSize    | Number | 每页数据条数 |
| currentPage | Number | 目标页数     |

请求示例:

```
http://localhost:3000/getList?pageSize=3&currentPage=2
```

返回示例:

```javascript
{
    "totle": 10,
    "list": [
        {
            "id": 7,
            "title": "亚伯拉罕湖中的树，加拿大艾伯塔 (© Coolbiere/Getty Images)",
            "date": "2021-04-15",
            "base64": "data:image/jpeg;base64,/9j/4AAQSkZJ...",
            "url": {
                "hd": "http://localhost:3000/img/2021/04/15/2021-04-15_hd.jpg",
                "uhd": "http://localhost:3000/img/2021/04/15/2021-04-15_uhd.jpg",
                "gaussian": "http://localhost:3000/img/2021/04/15/2021-04-15_hd_gaussian_20.jpg",
                "greyscale": "http://localhost:3000/img/2021/04/15/2021-04-15_hd_greyscale.jpg",
                "thumbnail": "http://localhost:3000/img/2021/04/15/2021-04-15_hd_thumbnail_480_270.jpg"
            },
            "color": {
                "Muted": "#5182ac",
                "Vibrant": "#24a3c8",
                "DarkMuted": "#314257",
                "LightMuted": "#93aecb",
                "DarkVibrant": "#115d7b",
                "LightVibrant": "#7ec2de"
            },
            "timestamp": "2021-04-15T08:34:50.000Z"
        },
        // more...
    ]
}
```

> ###### 我如何配置接口？
>
> 如您在上述配置文件中做了如下设置:
>
> > `host` 的值为 `"http://localhost"` 
> >
> > `port` 的值为 `3000` 
> >
> > `static` 的值为 `"img"` 
> >
> > `GET_LIST` 的值为 `"getList"` 
>
> 则此接口的真实地址为 `http://localhost:3000/getList` ，下同，不再赘述。
