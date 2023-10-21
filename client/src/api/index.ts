import http from '../utils/http'

const getList = (params: {
	pageSize: number // 每页数据条数
	currentPage: number // 第几页
}) => {
	return http({
		method: 'get',
		url: '/bing/getList',
		params: {
			pageSize: params.pageSize,
			currentPage: params.currentPage,
		},
	}).then((response) => response.data)
}

const getInfo = (params: { id: number }) => {
	return http({
		method: 'get',
		url: '/bing/getInfo',
		params: {
			id: params.id,
		},
	}).then((response) => response.data.info)
}

export { getList, getInfo }
