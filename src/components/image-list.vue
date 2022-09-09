<script setup lang="ts">
const imageStore = useImageStore()

interface Props {
	showInfoText?: boolean
}
const props = withDefaults(defineProps<Props>(), {
	showInfoText: true,
})

const previewImage = (item: any) => {
	console.log('previewImage', item)
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
		<div v-for="item in imageStore.dataList" :key="item?.id" class="image-item">
			<div
				v-preview="item?.base64"
				v-origin="item?.url.hd"
				class="image"
				@click="previewImage(item)"
			></div>
			<div class="title">
				{{ item?.title }}
			</div>
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
