<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import versionJSON from '../../version.json'
import dayjs from 'dayjs'
const { t } = useLanguage()
const webInfoStore = useWebInfoStore()

const state = reactive({
	compileTime: '',
})

state.compileTime = dayjs(versionJSON.compileTime).format('YYYY-MM-DD HH:mm:ss')
</script>

<template>
	<div class="pc-footer">
		<div
			v-if="webInfoStore.webInfo.htmlSlot?.beforeFooter"
			class="before-footer"
			v-html="webInfoStore.webInfo.htmlSlot.beforeFooter"
		></div>
		<div class="link">
			<a
				v-for="(item, index) in webInfoStore.webInfo.link"
				:key="index"
				class="link-item"
				target="_blank"
				:href="item.url"
			>
				{{ item.label }}
			</a>
			<a
				class="link-item"
				target="_blank"
				href="https://github.com/androidmumo/bing"
			>
				<i-mdi:github class="link-item-icon" />GitHub
			</a>
		</div>
		<div
			v-if="webInfoStore.webInfo.copyright"
			class="copyright"
			v-html="webInfoStore.webInfo.copyright"
		></div>
		<div class="build-time">
			{{ `${t('footer.buildTime')}: ${state.compileTime}` }}
		</div>
		<div
			v-if="webInfoStore.webInfo.htmlSlot?.afterFooter"
			class="after-footer"
			v-html="webInfoStore.webInfo.htmlSlot.afterFooter"
		></div>
	</div>
</template>

<style scoped lang="scss">
.pc-footer {
	width: 100%;
	padding: 20px 16px;
	margin-top: 30px;
	background-color: #f5f5f5;
	font-size: 12px;
	.link {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		.link-item {
			margin-right: 10px;
			display: flex;
			align-items: center;
		}
		.link-item-icon {
			margin-right: 3px;
		}
	}
	.copyright {
		margin-bottom: 20px;
	}
	.build-time {
		margin-bottom: 20px;
	}
	.before-footer {
		display: flex;
		align-items: center;
	}
	.after-footer {
		display: flex;
		align-items: center;
	}
}

html.dark {
	.pc-footer {
		background-color: #f5f5f511;
	}
}
</style>
