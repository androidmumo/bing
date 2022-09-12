<script setup lang="ts">
import dayjs from 'dayjs'

const imageStore = useImageStore()
const { t } = useLanguage()
const router = useRouter()

const isToday = (date: string) => {
	return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
}

const clickImage = (imageInfo: any) => {
	router.push(`/h5/detail?id=${imageInfo.id}`)
}
</script>

<template>
	<div class="h5-index">
		<div v-if="imageStore.refreshing" class="is-refreshing-text">
			{{ t('notice.refreshing') }}
		</div>
		<imageList
			:show-info-text="false"
			:show-color="true"
			@click-image="clickImage"
		>
			<template #content="{ data }">
				<div class="image-list-content">
					<div class="color">
						<div
							v-for="colorKey in Object.keys(data.color)"
							:key="colorKey"
							:class="{ 'color-item': true, [colorKey]: true }"
							:style="{ 'background-color': data.color[colorKey] }"
						></div>
					</div>
					<div class="title">
						<span :class="{ date: true, today: isToday(data?.date) }">
							{{ isToday(data?.date) ? t('index.today') : data?.date }}
						</span>
						{{ data?.title }}
					</div>
				</div>
			</template>
		</imageList>
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

<style lang="scss">
@import '../../styles/h5/index.scss';
</style>

<route lang="yaml">
meta:
  keepAlive: true
</route>
