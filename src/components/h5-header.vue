<script setup lang="ts">
const { isDark, toggleDark } = useDarks()
const { t, toggleLocale, language } = useLanguage()
</script>

<template>
	<div class="h5-header">
		<div class="header-left">
			<i-bxl:bing class="icon" />
			<span class="title">{{ t('header.title') }}</span>
		</div>
		<div class="header-center"></div>
		<div class="header-right">
			<div class="lang-btn">
				<span class="text">{{ language }}</span>
				<i-ion:language-outline class="icon" @click="toggleLocale()" />
			</div>
			<i-carbon:asleep v-if="!isDark" @click="toggleDark()" />
			<i-carbon:awake v-if="isDark" @click="toggleDark()" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.h5-header {
	position: fixed;
	z-index: 1;
	top: 0;
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	-webkit-backdrop-filter: saturate(180%) blur(20px);
	backdrop-filter: saturate(180%) blur(20px);
	background-color: rgba(255, 255, 255, 0.52);
	font-size: 14px;
	.header-left {
		display: flex;
		align-items: center;
		margin-left: 16px;
		.icon {
			margin-right: 10px;
		}
	}
	.header-center {
		display: flex;
		align-items: center;
	}
	.header-right {
		display: flex;
		align-items: center;
		margin-right: 16px;
		.lang-btn {
			margin-right: 10px;
			display: flex;
			align-items: center;
			.text {
				font-size: 12px;
				zoom: 50%;
				margin-right: 6px;
			}
		}
	}
}
html.dark .h5-header {
	background-color: rgba(0, 0, 0, 0.72);
}
</style>
