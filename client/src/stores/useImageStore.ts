import { defineStore } from 'pinia'
import { getList, getRandom } from '../api'
import { useLoadMore } from 'vue-request'
import Data from '../types/imageStore'

export default defineStore('useImageStore', () => {
	const filters = reactive({
		date: '',
		keyword: '',
	})
	const filterVersion = ref(0)

	// 随机模式状态
	const isRandomMode = ref(false) // 是否处于随机模式
	const randomList = ref<Data['list']>([]) // 随机图片列表
	const randomLoading = ref(false) // 随机加载中
	const randomVersion = ref(0) // 随机刷新版本号(驱动列表组件重置加载状态)

	// 根据路由决定每页加载几个
	const route = useRoute()
	const agent = <string>route.meta.agent || ''
	let pageSize: number = 3
	switch (agent) {
		case 'pc':
			pageSize = 9
			break
		case 'h5':
			pageSize = 5
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
			date: filters.date,
			keyword: filters.keyword,
		}
		if (dataList?.length !== undefined) {
			params.currentPage = Math.floor(dataList.length / params.pageSize) + 1
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

	const search = (nextFilters: { date?: string; keyword?: string }) => {
		// 搜索意味着退出随机模式
		exitRandomMode()
		filters.date = nextFilters.date || ''
		filters.keyword = nextFilters.keyword?.trim() || ''
		filterVersion.value++
		refresh()
	}

	const clearSearch = () => {
		search({ date: '', keyword: '' })
	}

	// ------ 随机模式 start ------
	// 进入随机模式并拉一批随机图
	const enterRandomMode = async () => {
		if (isRandomMode.value) return
		isRandomMode.value = true
		randomList.value = []
		randomVersion.value++
		await loadRandom()
	}

	// 退出随机模式,恢复普通列表
	const exitRandomMode = () => {
		if (!isRandomMode.value) return
		isRandomMode.value = false
		randomList.value = []
		randomVersion.value++
	}

	// 拉取一批随机图(进入时/点"随缘再来"时调用)
	const loadRandom = async () => {
		randomLoading.value = true
		try {
			const res = await getRandom({ count: pageSize })
			randomList.value = res.list || []
		} finally {
			randomLoading.value = false
		}
	}

	// 随机模式下的"再来一批":直接换一批
	const refreshRandom = () => {
		loadRandom()
	}
	// ------ 随机模式 end ------

	return {
		data,
		dataList,
		loadingMore,
		refreshing,
		noMore,
		filters,
		filterVersion,
		loadMore,
		refresh,
		search,
		clearSearch,
		isRandomMode,
		randomList,
		randomLoading,
		randomVersion,
		enterRandomMode,
		exitRandomMode,
		refreshRandom,
	}
})
