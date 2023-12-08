// 导入配置文件
const { infoConfig } = require("../data/config");

// 获取网站信息
const getWebInfo = (req, res) => {
    res.send(infoConfig);
}

module.exports = {
	getWebInfo,
};
