<script setup lang="ts">
const imageStore = useImageStore()
const { t } = useLanguage()
const router = useRouter()

const clickImage = (imageInfo: any) => {
	router.push(`/h5/detail?id=${imageInfo.id}`)
}
</script>

<template>
	<div class="h5-index">
		<div v-if="imageStore.refreshing" class="is-refreshing-text">
			{{ t('notice.refreshing') }}
		</div>
		<imageList :show-info-text="false" @click-image="clickImage" />
		<div
			v-if="!imageStore.loadingMore && !imageStore.noMore"
			class="load-more-btn"
			@click="imageStore.loadMore"
		>
			{{ t('notice.more') }}
		</div>
		<div v-if="imageStore.loadingMore" class="is-loading-more-text">
			{{ t('notice.loadingMore') }}
		</div>
		<div v-if="imageStore.noMore" class="is-no-more-text">
			{{ t('notice.noMore') }}
		</div>
	</div>
</template>

<style scoped lang="scss">
@import '../../styles/h5/index.scss';
</style>

<route lang="yaml">
meta:
  keepAlive: true
</route>
