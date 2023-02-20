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
	router.push(`/pc/detail?id=${imageInfo.id}`)
}

// ------ 滚动条保留 start ------
const pcContent = ref()

// 保存滚动条位置
const saveScrollTop = () => {
	state.scrollTop = pcContent.value ? pcContent.value.scrollTop : 0
	console.log('保存滚动条高度', state.scrollTop)
}

// 设置滚动条位置
const setScrollTop = () => {
	pcContent.value.scrollTop = state.scrollTop
	console.log('设置滚动条高度', pcContent.value.scrollTop)
}
// ------ 滚动条保留 end ------
</script>

<template>
	<pcHeader />
	<div ref="pcContent" class="pc-index pc-content">
		<div class="index-content">
			<imageList
				:show-info-text="false"
				:auto-load="3"
				@click-image="clickImage"
			>
				<template #content="{ data }">
					<div class="image-list-content">
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
		</div>
		<pcFooter />
	</div>
</template>

<style lang="scss">
@import '../../styles/pc/index.scss';
</style>

<route lang="yaml">
meta:
  keepAlive: true
</route>
