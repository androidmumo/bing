<script setup lang="ts">
import versionJSON from '../../version.json'
import dayjs from 'dayjs'
const { t } = useLanguage()

const state = reactive({
	compileTime: '',
})

state.compileTime = dayjs(versionJSON.compileTime).format('YYYY-MM-DD HH:mm:ss')
</script>

<template>
	<div class="h5-footer">
		<div class="link">
			<a class="link-item" href="https://www.mcloc.cn">小马奔腾的主页</a>
			<a class="link-item" href="https://blog.mcloc.cn">小马奔腾的博客</a>
			<a class="link-item" href="https://github.com/androidmumo/bing">
				<i-mdi:github class="link-item-icon" />GitHub
			</a>
		</div>
		<div class="copyright">Copyright © 2022 mcloc.cn</div>
		<div class="build-time">
			{{ `${t('footer.buildTime')}: ${state.compileTime}` }}
		</div>
		<div class="beian">
			<a target="_blank" href="https://beian.miit.gov.cn/"
				>晋ICP备20001086号-1
			</a>
			<a
				target="_blank"
				href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41080202000141"
			>
				<img
					style="width: 14px; margin-right: 6px"
					src="https://www.mcloc.cn/wp-content/uploads/2020/04/beiantubiao-19.png"
				/>
				<span>豫公网安备 41080202000141号</span>
			</a>
		</div>
	</div>
</template>

<style scoped lang="scss">
.h5-footer {
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
	.beian {
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		a {
			display: flex;
			align-items: center;
		}
	}
}

html.dark {
	.h5-footer {
		background-color: #f5f5f511;
	}
}
</style>
