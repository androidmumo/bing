<script setup lang="ts">
import { getInfo } from '../../api/index'
import { UnwrapNestedRefs } from 'vue'

const route = useRoute()
const imageStore = useImageStore()
const headerStore = useHeaderStore()
const { t } = useLanguage()

const state = reactive({
	data: {},
	loading: false,
	uhdImageUrl: '',
}) as UnwrapNestedRefs<any>

const loadData = () => {
	const id = Number(route.query.id)
	state.data = imageStore.dataList.filter((item) => item.id === id)[0] || {}
	state.uhdImageUrl = ''
	headerStore.setBackBtnStatus(true)
	if (state.data.id !== id) {
		// store中不存在这张图片的数据，需要请求接口
		state.loading = true
		getInfo({ id }).then((res) => {
			state.data = res
			state.loading = false
		})
		headerStore.setBackBtnStatus(false)
	}
}

loadData()

const showUHDImage = () => {
	state.uhdImageUrl = state.data?.url?.uhd
}

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
	<div v-if="state.loading" class="loading">
		{{ t('notice.loading') }}
	</div>
	<div v-if="!state.loading" :key="state.data.id" class="h5-detail">
		<div class="detail-image">
			<div
				v-preview="state.data?.base64"
				v-origin="state.data?.url?.hd"
				class="image"
			></div>
			<div class="image-content">
				<div class="color">
					<div
						v-for="colorKey in Object.keys(state.data.color)"
						:key="colorKey"
						:class="{ 'color-item': true, [colorKey]: true }"
						:style="{ 'background-color': state.data.color[colorKey] }"
					></div>
				</div>
				<div class="container">
					<div class="date">
						{{ state.data?.date }}
					</div>
					<div class="title">
						{{ state.data?.title }}
					</div>
				</div>
			</div>
		</div>
		<div class="greyscale-image">
			<div class="title">{{ t('detail.greyscale') }}</div>
			<div
				v-preview="state.data?.base64"
				v-origin="state.data?.url?.greyscale"
				class="image"
			></div>
		</div>
		<div class="gaussian-image">
			<div class="title">{{ t('detail.gaussian') }}</div>
			<div
				v-preview="state.data?.base64"
				v-origin="state.data?.url?.gaussian"
				class="image"
			></div>
		</div>
		<div class="hd-image">
			<div class="title">{{ t('detail.hd') }}</div>
			<div
				v-preview="state.data?.base64"
				v-origin="state.data?.url?.hd"
				class="image"
			></div>
		</div>
		<div class="uhd-image">
			<div class="title">{{ t('detail.uhd') }}</div>
			<div class="image-wrap">
				<div
					:key="state.uhdImageUrl"
					v-preview="state.data?.base64"
					v-origin="state.uhdImageUrl"
					class="image"
				></div>
				<div
					v-show="!state.uhdImageUrl"
					class="overlayer"
					@click="showUHDImage"
				>
					{{ t('detail.overlayer') }}
				</div>
			</div>
		</div>
		<div class="remark">
			{{ t('detail.remark') }}
		</div>
	</div>
</template>

<style lang="scss">
@import url('../../styles/h5/detail.scss');
</style>

<route lang="yaml">
meta:
  keepAlive: false
</route>
