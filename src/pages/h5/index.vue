<script setup lang="ts">
import { UnwrapNestedRefs } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import dayjs from 'dayjs'

const { isDark } = useDarks()
const imageStore = useImageStore()
const { t } = useLanguage()
const router = useRouter()
const headerStore = useHeaderStore()

const state = reactive({
	scrollTop: 0, // 当前页面页面滚动条高度
}) as UnwrapNestedRefs<any>

onActivated(() => {
	setScrollTop()
	headerStore.setBackBtnStatus(false)
})

onBeforeRouteLeave((to, from, next) => {
	saveScrollTop()
	next()
})

const isToday = (date: string) => {
	return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
}

const clickImage = (imageInfo: any) => {
	router.push(`/h5/detail?id=${imageInfo.id}`)
}

// ------ 滚动条保留 start ------
const h5Content = ref()

// 保存滚动条位置
const saveScrollTop = () => {
	state.scrollTop = h5Content.value ? h5Content.value.scrollTop : 0
	console.log('保存滚动条高度', state.scrollTop)
}

// 设置滚动条位置
const setScrollTop = () => {
	h5Content.value.scrollTop = state.scrollTop
	console.log('设置滚动条高度', h5Content.value.scrollTop)
}
// ------ 滚动条保留 end ------
</script>

<template>
	<h5Header />
	<div ref="h5Content" class="h5-index h5-content">
		<div v-if="imageStore.refreshing" class="is-refreshing-text">
			{{ t('notice.refreshing') }}
		</div>
		<imageList :show-info-text="false" @click-image="clickImage">
			<template #content="{ data }">
				<div class="image-list-content">
					<!-- <div class="color">
						<div
							v-for="colorKey in Object.keys(data.color)"
							:key="colorKey"
							:class="{ 'color-item': true, [colorKey]: true }"
							:style="{ 'background-color': data.color[colorKey] }"
						></div>
					</div> -->
					<div class="title">
						<span
							:style="{
								'background-color':
									data.color[isDark ? 'LightVibrant' : 'DarkVibrant'],
								color: isDark ? '#000' : '#fff',
							}"
							:class="{ date: true, today: isToday(data?.date) }"
						>
							{{ isToday(data?.date) ? t('index.today') : data?.date }}
						</span>
						<span>
							{{ data?.title }}
						</span>
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
		<h5Footer />
	</div>
</template>

<style lang="scss">
@import '../../styles/h5/index.scss';
</style>

<route lang="yaml">
meta:
  keepAlive: true
</route>
