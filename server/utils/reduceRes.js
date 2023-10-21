// 处理数据库返回值
const reduceRes = function (result) {
	result.forEach((item) => {
		item.url = JSON.parse(item.url);
		item.color = JSON.parse(item.color);
	});
	return result;
};

module.exports = {
	reduceRes,
};