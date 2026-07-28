import http from '../utils/http'

const getList = (params: {
	pageSize: number // 每页数据条数
	currentPage: number // 第几页
	date?: string // 精确日期 YYYY-MM-DD
	keyword?: string // 标题或版权关键词
}) => {
	return http({
		method: 'get',
		url: '/api/getList',
		params: {
			pageSize: params.pageSize,
			currentPage: params.currentPage,
			date: params.date || undefined,
			keyword: params.keyword || undefined,
		},
	}).then((response) => response.data)
}

const getInfo = (params: { id: number }) => {
	return http({
		method: 'get',
		url: '/api/getInfo',
		params: {
			id: params.id,
		},
	}).then((response) => response.data.info)
}

// 获取网站信息
const getWebInfo = () => {
	return http({
		method: 'get',
		url: '/api/getWebInfo',
	}).then((response) => response.data)
}

export { getList, getInfo, getWebInfo }
