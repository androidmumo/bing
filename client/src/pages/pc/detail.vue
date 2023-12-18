<script setup lang="ts">
import { getInfo } from '../../api/index'
import { UnwrapNestedRefs } from 'vue'

const route = useRoute()
const imageStore = useImageStore()
const headerStore = useHeaderStore()
const { t } = useLanguage()

const state = reactive({
	id: Number(route.query.id), // 图片id
	data: {}, // 图片数据
	loading: false, // 正在请求接口
	loadUHDImage: () => {}, // 加载UHD图片
	loadingUHD: false, // 正在加载UHD图片
	showUHDOverlayer: true, // 显示UHD图片的浮层
	previewVisible: false, // 显示图片预览
	previewSrc: '', // 预览图片链接
	UHDLoadMap: {}, // 记录UHD图片是否加载过
}) as UnwrapNestedRefs<any>

const resetState = () => {
	state.id = Number(route.query.id)
	state.loadingUHD = false
	state.showUHDOverlayer = !state.UHDLoadMap[state.id]
}

const loadData = () => {
	const { id } = state
	state.data = imageStore.dataList.filter((item) => item.id === id)[0] || {}
	headerStore.setBackBtnStatus(true)
	if (state.data.id !== id) {
		// 直接打开详情页，store中不存在这张图片的数据，需要请求接口
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
	state.loadingUHD = true
	state.loadUHDImage()
	state.showUHDOverlayer = false
}

const beforeLoad = (next: Function) => {
	state.loadUHDImage = next
	state.UHDLoadMap[state.id] && showUHDImage()
}

const onload = () => {
	// 加载完成后加入UHDLoadMap
	state.UHDLoadMap[state.id] = true
	state.loadingUHD = false
}

// 监听路由id变化
watch(
	() => route.query.id,
	(newValue) => {
		if (!newValue) return
		resetState()
		loadData()
	}
)

const clickImage = (type: string) => {
	state.previewSrc = state.data?.url[type]
	state.previewVisible = true
}
</script>

<template>
	<pcHeader />
	<div v-if="state.loading" class="loading">
		{{ t('notice.loading') }}
	</div>
	<div v-if="!state.loading" :key="state.data.id" class="pc-detail pc-content">
		<div class="detail-content">
			<div class="detail-image">
				<pmage
					:placeholder="state.data?.base64"
					:src="state.data?.url?.hd"
					class="image"
				/>
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
						<div class="title">
							{{ state.data?.title }}
						</div>
						<div class="date">
							{{ state.data?.date }} {{ state.data?.copyright }}
						</div>
					</div>
				</div>
			</div>
			<div class="other-image">
				<div class="greyscale-image">
					<div class="title">{{ t('detail.greyscale') }}</div>
					<pmage
						:placeholder="state.data?.base64"
						:src="state.data?.url?.greyscale"
						class="image"
						@click="clickImage('greyscale')"
					/>
				</div>
				<div class="gaussian-image">
					<div class="title">{{ t('detail.gaussian') }}</div>
					<pmage
						:placeholder="state.data?.base64"
						:src="state.data?.url?.gaussian"
						class="image"
						@click="clickImage('gaussian')"
					/>
				</div>
				<div class="hd-image">
					<div class="title">{{ t('detail.hd') }}</div>
					<pmage
						:placeholder="state.data?.base64"
						:src="state.data?.url?.hd"
						class="image"
						@click="clickImage('hd')"
					/>
				</div>
				<div class="uhd-image">
					<div class="title">{{ t('detail.uhd') }}</div>
					<pmage
						class="image"
						:placeholder="state.data?.base64"
						:src="state.data?.url.uhd"
						@before-load="beforeLoad"
						@onload="onload"
						@click="clickImage('uhd')"
					>
						<template #default>
							<div v-if="state.loadingUHD" class="image-inner">
								<div class="square-spinner"></div>
							</div>
						</template>
						<template #top>
							<div
								v-if="state.showUHDOverlayer"
								class="overlayer"
								@click.self.stop="showUHDImage"
							>
								{{ t('detail.overlayer') }}
							</div>
						</template>
					</pmage>
				</div>
			</div>
			<div class="remark">
				{{ t('detail.remark.pc') }}
			</div>
			<PcImagePreview
				v-model:visible="state.previewVisible"
				:src="state.previewSrc"
			/>
		</div>
		<pcFooter />
	</div>
</template>

<style lang="scss">
@import url('../../styles/pc/detail.scss');
</style>

<route lang="yaml">
meta:
  keepAlive: false
</route>
