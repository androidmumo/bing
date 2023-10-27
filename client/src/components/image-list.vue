<script setup lang="ts">
import { UnwrapNestedRefs } from 'vue'
const imageStore = useImageStore()
const { t } = useLanguage()
const emit = defineEmits(['click-image'])

interface Props {
	showInfoText?: boolean // 是否显示提示信息
	autoLoad?: boolean | number // 是否自动加载(数字表示自动加载几次，true表示始终自动加载)
}
const props = withDefaults(defineProps<Props>(), {
	showInfoText: true,
	autoLoad: true,
})

const state = reactive({
	loadMap: {}, // 图片加载状态
	loadCount: 0, // 加载次数
}) as UnwrapNestedRefs<any>

const imageList = ref()

// 节流
// const reduceFn = (fn: Function, delay = 100) => {
// 	let allowFlag = true
// 	return () => {
// 		if (allowFlag) {
// 			allowFlag = false
// 			fn.apply(this)
// 			setTimeout(() => {
// 				allowFlag = true
// 			}, delay)
// 		}
// 	}
// }

// 防抖
const debounce = (fn: Function, delay = 100) => {
	let timer: any = null
	return () => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			fn.apply(this)
		}, delay)
	}
}

// 检查滚动状态，决定是否加载
const checkScrollForAutoLoad = () => {
	if (imageStore.noMore) return
	const safety = 100 // 提前加载距离
	const clientHeight =
		document.body.clientHeight || document.documentElement.clientHeight
	const rect = imageList.value.getBoundingClientRect()
	if (
		props.autoLoad === true ||
		(typeof props.autoLoad === 'number' && state.loadCount < props.autoLoad)
	) {
		// 说明可以自动加载
		if (rect.bottom - safety < clientHeight && !imageStore.loadingMore) {
			// 说明划到了需要加载的位置并且当前没有正在加载
			debounce(imageStore.loadMore)()
			state.loadCount++
		}
	}
}

const debounceCheckScrollForAutoLoad = debounce(checkScrollForAutoLoad)

// 第一次进入页面时检查一次是否需要加载
// debounceCheckScrollForAutoLoad()

const listenScroll = () => {
	window.addEventListener('scroll', debounceCheckScrollForAutoLoad, true)
}

onActivated(() => {
	if (props.autoLoad) listenScroll()
})

onDeactivated(() => {
	window.removeEventListener('scroll', debounceCheckScrollForAutoLoad, true)
})

const beforeLoad = (next: Function, index: number) => {
	state.loadMap[index] = {
		status: false,
		next,
	}
	if (index === 0) next()
	if (state.loadMap[index - 1] && state.loadMap[index - 1].status === true) {
		next()
	}
}

const onload = (index: number) => {
	state.loadMap[index].status = true
	nextTick(() => {
		state.loadMap[index + 1] && state.loadMap[index + 1].next()
	})
}

const onerror = (index: number) => {
	state.loadMap[index].status = false
	nextTick(() => {
		state.loadMap[index + 1] && state.loadMap[index + 1].next()
	})
}

const clickImage = (item: any) => {
	emit('click-image', item)
}
</script>

<template>
	<div ref="imageList" class="image-list">
		<div
			v-if="props.showInfoText && imageStore.refreshing"
			class="info-text is-refreshing"
		>
			{{ t('notice.refreshing') }}
		</div>
		<div
			v-for="(item, index) in imageStore.dataList"
			:key="item?.id"
			class="image-item"
			@click="clickImage(item)"
		>
			<pmage
				:placeholder="item?.base64"
				:src="item?.url.thumbnail"
				class="image"
				@before-load="(next: Function) => beforeLoad(next, index)"
				@onload="onload(index)"
				@onerror="onerror(index)"
			/>
			<slot name="content" :data="item"></slot>
		</div>
		<div
			v-if="props.showInfoText && imageStore.loadingMore"
			class="info-text is-loading-more"
		>
			{{ t('notice.loadingMore') }}
		</div>
		<div
			v-if="props.showInfoText && imageStore.noMore"
			class="info-text is-no-more"
		>
			{{ t('notice.noMore') }}
		</div>
	</div>
</template>
