# bing-serve

### 使用 node.js 构建的必应每日一图服务端



### 环境准备

- 本项目基于 `Node.js 14` 开发，建议运行环境的Node版本大于此版本
- MySql



### 配置

#### 用户配置

用户配置文件在 `data/config.js` 。

这个配置文件中的配置项可以由用户自定义。

请复制完整配置文件 `data/config-full.js` 中的内容并创建 `data/config.js` 。用户配置文件中包含了基础配置和数据库配置。

```javascript
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
```



#### 内部配置

用户配置文件在 `config/config.js` 。

这个配置文件中的配置项是默认的，无法在docker版本中由用户自定义。

内部配置文件中包含了安装配置、API基础配置、API接口路径配置。

```javascript
// 内部配置文件 config.js

// 安装配置
const installConfig = {
  dir: "data/resources", // 图片在服务端的真实保存路径 (相对于根目录、首尾不能为’/‘)
  databaseTable: "bing", // 数据库表名 (可在安装前更改)
}

// API基础配置
const apiBaseConfig = {
  static: "img", // 图片静态托管路径 (url访问图片时的路径、首尾不能为’/‘)
}

// API接口路径配置(接口url后缀、首尾不能为’/‘)
const apiConfig = {
  UPDATE: "api/update", // 手动更新图片（访问需要key鉴权）
  DELETE: "api/delete", // 手动清理图片（访问需要key鉴权）
  GET_IMAGE: "api/getImage", // 获取当天图片
  GET_LIST: "api/getList", // 获取图片列表
  GET_INFO: "api/getInfo", // 获取图片详情
};

module.exports = {
  installConfig,
  apiBaseConfig,
  apiConfig,
};

```



### 安装

##### 安装依赖

```
npm install
```



### 启动

#### 生产环境

```
npm run serve
```

#### 开发环境

```
npm run dev
```



### 接口文档

##### GET_IMAGE 获取当天图片

请求方法: `GET`

默认地址: `http://localhost:3000/api/getImage` 

参数(query): 无。

请求示例:

```
http://localhost:3000/api/getImage
```

返回示例: 直接返回当天图片，可直接用作图片URL。



##### GET_LIST 获取图片列表

请求方法: `GET`

默认地址: `http://localhost:3000/api/getList` 

参数(query):

| Key         | Value  | 说明         |
| ----------- | ------ | ------------ |
| pageSize    | Number | 每页数据条数 |
| currentPage | Number | 目标页数     |

请求示例:

```
http://localhost:3000/api/getList?pageSize=3&currentPage=2
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



##### GET_INFO 获取图片详情

请求方法: `GET`

默认地址: `http://localhost:3000/api/getInfo` 

参数(query):

| Key  | Value  | 说明   |
| ---- | ------ | ------ |
| id   | Number | 数据ID |

请求示例:

```
http://localhost:3000/api/getInfo?id=1
```

返回示例:

```javascript
{
    "info": {
        "id": 1,
        "title": "塞勒斯堡的玉米迷宫，宾夕法尼亚州，美国 (© Alex Potemkin/Getty Images)",
        "date": "2023-10-23",
        "base64": "data:image/jpeg;base64,/9j/4AAQSk...",
        "url": {
            "hd": "/img/2023/10/23/2023-10-23_hd.jpg",
            "uhd": "/img/2023/10/23/2023-10-23_uhd.jpg",
            "greyscale": "/img/2023/10/23/2023-10-23_hd_greyscale.jpg",
            "thumbnail": "/img/2023/10/23/2023-10-23_hd_thumbnail_480_270.jpg",
            "gaussian": "/img/2023/10/23/2023-10-23_hd_gaussian_20.jpg"
        },
        "color": {
            "Vibrant": "#dd9413",
            "DarkVibrant": "#70600e",
            "LightVibrant": "#e9c36b",
            "Muted": "#3c6c4c",
            "DarkMuted": "#4e4c32",
            "LightMuted": "#856314"
        },
        "timestamp": "2023-10-23T01:09:30.000Z"
    }
}
```

