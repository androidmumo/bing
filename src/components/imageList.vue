<script setup lang="ts">
const imageStore = useImageStore()
</script>

<template>
	<div class="image-list">
		<div v-if="imageStore.refreshing" class="is-refreshing">正在刷新</div>
		<div v-for="item in imageStore.dataList" :key="item?.id" class="image-item">
			<div
				v-preview="item?.base64"
				v-origin="item?.url.hd"
				@click="imageStore.loadMore"
			></div>
			{{ item?.title }}
		</div>
		<div v-if="imageStore.loadingMore" class="is-loading-more">
			正在加载更多
		</div>
		<div v-if="imageStore.noMore" class="is-no-more">没有更多了</div>
	</div>
</template>
