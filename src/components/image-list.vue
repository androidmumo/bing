<script setup lang="ts">
import { UnwrapNestedRefs } from 'vue'
const imageStore = useImageStore()
const emit = defineEmits(['click-image'])

interface Props {
	showInfoText?: boolean
}
const props = withDefaults(defineProps<Props>(), {
	showInfoText: true,
})

const state = reactive({
	loadStatus: {}, // 图片加载状态
}) as UnwrapNestedRefs<any>

const beforeLoad = (next: Function, index: number) => {
	state.loadStatus[index] = {
		status: false,
		next,
	}
	if (index === 0) next()
	if (
		state.loadStatus[index - 1] &&
		state.loadStatus[index - 1].status === true
	)
		next()
}

const onload = (index: number) => {
	state.loadStatus[index].status = true
	state.loadStatus[index + 1] && state.loadStatus[index + 1].next()
}

const clickImage = (item: any) => {
	emit('click-image', item)
}
</script>

<template>
	<div class="image-list">
		<div
			v-if="props.showInfoText && imageStore.refreshing"
			class="info-text is-refreshing"
		>
			正在刷新
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
			/>
			<slot name="content" :data="item"></slot>
		</div>
		<div
			v-if="props.showInfoText && imageStore.loadingMore"
			class="info-text is-loading-more"
		>
			正在加载更多
		</div>
		<div
			v-if="props.showInfoText && imageStore.noMore"
			class="info-text is-no-more"
		>
			没有更多了
		</div>
	</div>
</template>
