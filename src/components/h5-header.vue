<script setup lang="ts">
const { isDark, toggleDark } = useDarks()
const { t, toggleLocale, language } = useLanguage()
const headerStore = useHeaderStore()
const router = useRouter()

const state = reactive({
	showSleep: false,
	showWake: false,
	darkAnimation: false, // 允许dark按钮动画
	disableClickDark: false, // 禁止切换dark
	langAnimation: false, // 允许语言切换按钮动画
})

// 初始化显示状态
state.showSleep = !isDark.value
state.showWake = !!isDark.value

// back
const back = () => {
	router.back()
}

// go home
const goHome = () => {
	router.replace('/')
}

// 点击返回按钮
const clickBackBtn = () => {
	headerStore.setBackBtnStatus(false)
	back()
}

// 点击sleep
const clickSleep = () => {
	if (state.disableClickDark) return
	state.disableClickDark = true
	state.darkAnimation = true
	toggleDark(true)
	setTimeout(() => {
		state.showWake = true
	}, 100)
	setTimeout(() => {
		state.showSleep = false
	}, 500)
	setTimeout(() => {
		state.darkAnimation = false
		state.disableClickDark = false
	}, 600)
}

// 点击wake
const clickWake = () => {
	if (state.disableClickDark) return
	state.disableClickDark = true
	state.darkAnimation = true
	toggleDark(false)
	setTimeout(() => {
		state.showSleep = true
	}, 100)
	setTimeout(() => {
		state.showWake = false
	}, 500)
	setTimeout(() => {
		state.darkAnimation = false
		state.disableClickDark = false
	}, 600)
}

// 点击语言切换按钮
const clickLang = () => {
	state.langAnimation = true
	toggleLocale()
	setTimeout(() => {
		state.langAnimation = false
	}, 100)
}
</script>

<template>
	<div class="h5-header">
		<div class="header-left">
			<i-bxl:bing v-if="!headerStore.needBack" class="icon" @click="goHome" />
			<span v-if="!headerStore.needBack" class="title" @click="goHome">{{
				t('header.title')
			}}</span>
			<i-ion:ios-arrow-back
				v-if="headerStore.needBack"
				class="icon back-btn"
				@click="clickBackBtn"
			/>
		</div>
		<div class="header-center"></div>
		<div class="header-right">
			<div
				:class="{
					'lang-btn': true,
					'lang-click': state.langAnimation,
				}"
				@click="clickLang"
			>
				<span class="text">{{ language }}</span>
				<i-ion:language-outline class="icon" />
			</div>
			<div class="dark-btn">
				<i-carbon:asleep
					v-if="state.showSleep"
					:class="{
						icon: true,
						'dark-leave': state.darkAnimation && isDark,
						'dark-enter': state.darkAnimation && !isDark,
					}"
					@click="clickSleep"
				/>
				<i-carbon:awake
					v-if="state.showWake"
					:class="{
						icon: true,
						'dark-leave': state.darkAnimation && !isDark,
						'dark-enter': state.darkAnimation && isDark,
					}"
					@click="clickWake"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
$left-right-margin: 16px; // 左右边距

@keyframes darkLeave {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	100% {
		transform: scale(3);
		opacity: 0;
	}
}

@keyframes darkEnter {
	0% {
		transform: scale(0.1);
	}
	100% {
		transform: scale(1);
	}
}

.dark-leave {
	animation-name: darkLeave;
	animation-duration: 0.52s;
}

.dark-enter {
	animation-name: darkEnter;
	animation-duration: 0.52s;
}

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
		margin-left: $left-right-margin;
		.icon {
			margin-right: 10px;
		}
		.back-btn {
			font-size: 16px;
		}
	}
	.header-center {
		display: flex;
		align-items: center;
	}
	.header-right {
		display: flex;
		align-items: center;
		margin-right: $left-right-margin;
		.lang-btn {
			margin-right: calc(20px + 1.2em);
			display: flex;
			align-items: center;
			cursor: pointer;
			transition: transform 0.2s cubic-bezier(0.08, 0.63, 0.48, 0.95);
			transform: scale(1);
			.text {
				font-size: 12px;
				zoom: 50%;
				margin-right: 6px;
			}
		}
		.lang-click {
			transform: scale(0.6);
		}
		.dark-btn {
			.icon {
				position: absolute;
				top: calc(50% - 8px);
				right: $left-right-margin;
				cursor: pointer;
			}
		}
	}
}

html.dark .h5-header {
	background-color: rgba(0, 0, 0, 0.72);
}
</style>
