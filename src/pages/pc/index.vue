<script setup lang="ts">
const imageStore = useImageStore()
const { t } = useLanguage()
const router = useRouter()

const clickImage = (imageInfo: any) => {
	router.push(`/pc/detail?id=${imageInfo.id}`)
}
</script>

<template>
	<pcHeader />
	<div class="pc-index pc-content">
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
	<pcFooter />
</template>

<style lang="scss">
@import '../../styles/pc/index.scss';
</style>

<route lang="yaml">
meta:
  keepAlive: true
</route>
