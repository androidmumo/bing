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

onActivated(() => {
	initDarkStatus()
})

// 初始化显示状态
const initDarkStatus = () => {
	state.showSleep = !isDark.value
	state.showWake = !!isDark.value
}

// back
const back = () => {
	// 有站内来路(含F5后,history.state.back保留)则原路返回;无来路(直接打开链接)回本端首页
	if (router.options.history.state?.back) {
		router.back()
	} else {
		router.replace('/h5')
	}
}

// go home
// const goHome = () => {
// 	router.replace('/')
// }

const refresh = () => {
	window.location.reload()
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

// 点击随缘按钮
const imageStore = useImageStore()
const clickRandom = () => {
	if (imageStore.isRandomMode) {
		// 再点一次退出随机模式,恢复普通列表
		imageStore.exitRandomMode()
	} else {
		imageStore.enterRandomMode()
	}
}
</script>

<template>
	<div class="h5-header">
		<div class="header-left">
			<i-bxl:bing v-if="!headerStore.needBack" class="icon" @click="refresh" />
			<span v-if="!headerStore.needBack" class="title" @click="refresh">{{
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
			<imageSearch v-if="!headerStore.needBack" />
			<div
				:class="{
					'random-btn': true,
					'random-active': imageStore.isRandomMode,
				}"
				:title="t('notice.random')"
				@click="clickRandom"
			>
				<span class="text">{{ t('notice.random') }}</span>
				<i-ion:dice-outline class="icon" />
			</div>
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
			cursor: pointer;
		}
		.title {
			cursor: pointer;
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
		.random-btn {
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
			.icon {
				font-size: 16px;
			}
		}
		.random-btn:hover {
			transform: scale(1.08);
		}
		.random-active {
			color: #858ae3;
		}
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
	background-color: rgba(18, 18, 19, 0.82);
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);

	.lang-btn:hover {
		background-color: rgba(133, 138, 227, 0.16);
	}

	.random-btn:hover {
		background-color: rgba(133, 138, 227, 0.16);
	}
}
</style>
