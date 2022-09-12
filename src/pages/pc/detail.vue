<script setup lang="ts">
import { getInfo } from '../../api/index'
import { UnwrapNestedRefs } from 'vue'

const route = useRoute()
const imageStore = useImageStore()

const state = reactive({
	data: {},
	loading: false,
	error: false,
}) as UnwrapNestedRefs<any>

const loadData = () => {
	const id = Number(route.query.id)
	state.data = imageStore.dataList.filter((item) => item.id === id)[0] || {}
	if (state.data.id !== id) {
		// store中不存在这张图片的数据，需要请求接口
		state.loading = true
		getInfo({ id }).then((res) => {
			state.data = res
			state.loading = false
		})
	}
}

loadData()

// 监听路由id变化
watch(
	() => route.query.id,
	(newValue) => {
		if (!newValue) return
		loadData()
	}
)
</script>

<template>
	<div class="pc-detail">
		<div v-if="!state.loading" :key="state.data.id" class="detail-image">
			<div
				v-preview="state.data?.base64"
				v-origin="state.data?.url?.hd"
				class="image"
			></div>
			<div class="title">
				{{ state.data?.title }}
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import url('../../styles/pc/detail.scss');
</style>

<route lang="yaml">
meta:
  keepAlive: false
</route>
