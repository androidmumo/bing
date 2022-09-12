<script setup lang="ts">
const imageStore = useImageStore()
const emit = defineEmits(['click-image'])

interface Props {
	showInfoText?: boolean
}
const props = withDefaults(defineProps<Props>(), {
	showInfoText: true,
})

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
			v-for="item in imageStore.dataList"
			:key="item?.id"
			class="image-item"
			@click="clickImage(item)"
		>
			<div
				v-preview="item?.base64"
				v-origin="item?.url.thumbnail"
				class="image"
			></div>
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
