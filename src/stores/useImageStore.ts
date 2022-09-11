import { defineStore } from 'pinia'
import { getList } from '../api'
import { useLoadMore } from 'vue-request'
import Data from '../types/imageStore'

export default defineStore('useImageStore', () => {
	console.log(201)
	// 根据路由决定每页加载几个
	const route = useRoute()
	const agent = <string>route.meta.agent || ''
	let pageSize: number = 3
	switch (agent) {
		case 'pc':
			pageSize = 5
			break
		case 'h5':
			pageSize = 3
			break
		default:
			break
	}

	// service
	const getListService = (args: { data?: Data; dataList?: Data['list'] }) => {
		const { dataList } = args || {}
		const params = {
			pageSize,
			currentPage: 1,
		}
		if (dataList?.length !== undefined) {
			params.currentPage = dataList.length / params.pageSize + 1
		} else {
			params.currentPage = 1
		}
		return getList(params)
	}

	const { data, dataList, loadingMore, refreshing, loadMore, refresh } =
		useLoadMore<Data, Parameters<typeof getListService>, Data['list']>(
			getListService
		)

	const noMore = computed(() => dataList.value.length === data.value?.totle)

	return {
		data,
		dataList,
		loadingMore,
		refreshing,
		noMore,
		loadMore,
		refresh,
	}
})
