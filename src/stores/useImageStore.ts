import { defineStore } from 'pinia'
import { getList } from '../api'
import { useLoadMore } from 'vue-request'

export default defineStore('useImageStore', () => {
	type Data = {
		list: {
			id: number
			title: string
			timestamp: string
			date: string
			base64: string
			url: {
				hd: string
				uhd: string
				thumbnail: string
				greyscale: string
				gaussian: string
			}
			color: {
				Muted: string
				Vibrant: string
				LightMuted: string
				LightVibrant: string
				DarkMuted: string
				DarkVibrant: string
			}
		}[]
		totle: number
	}

	const getListService = (args: { data?: Data; dataList?: Data['list'] }) => {
		const { dataList } = args || {}
		const params = {
			pageSize: 1,
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

	return { data, dataList, loadingMore, refreshing, noMore, loadMore, refresh }
})
