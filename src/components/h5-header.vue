<script setup lang="ts">
const { isDark, toggleDark } = useDarks()
const { t, toggleLocale, language } = useLanguage()

const state = reactive({
	showSleep: false,
	showWake: false,
	animation: false,
	disableClickDark: false,
})

// 初始化显示状态
state.showSleep = !isDark.value
state.showWake = !!isDark.value

// 点击sleep
const clickSleep = () => {
	if (state.disableClickDark) return
	state.disableClickDark = true
	state.animation = true
	toggleDark(true)
	setTimeout(() => {
		state.showWake = true
	}, 100)
	setTimeout(() => {
		state.showSleep = false
	}, 500)
	setTimeout(() => {
		state.animation = false
		state.disableClickDark = false
	}, 600)
}

// 点击wake
const clickWake = () => {
	if (state.disableClickDark) return
	state.disableClickDark = true
	state.animation = true
	toggleDark(false)
	setTimeout(() => {
		state.showSleep = true
	}, 100)
	setTimeout(() => {
		state.showWake = false
	}, 500)
	setTimeout(() => {
		state.animation = false
		state.disableClickDark = false
	}, 600)
}
</script>

<template>
	<div class="h5-header">
		<div class="header-left">
			<i-bxl:bing class="icon" />
			<span class="title">{{ t('header.title') }}</span>
		</div>
		<div class="header-center"></div>
		<div class="header-right">
			<div class="lang-btn" @click="toggleLocale()">
				<span class="text">{{ language }}</span>
				<i-ion:language-outline class="icon" />
			</div>
			<div class="dark-btn">
				<i-carbon:asleep
					v-if="state.showSleep"
					:class="{
						icon: true,
						'dark-leave': state.animation && isDark,
						'dark-enter': state.animation && !isDark,
					}"
					@click="clickSleep"
				/>
				<i-carbon:awake
					v-if="state.showWake"
					:class="{
						icon: true,
						'dark-leave': state.animation && !isDark,
						'dark-enter': state.animation && isDark,
					}"
					@click="clickWake"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
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
			margin-right: calc(20px + 1.2em);
			display: flex;
			align-items: center;
			transition: transform 0.2s cubic-bezier(0.08, 0.63, 0.48, 0.95);
			transform: scale(1);
			.text {
				font-size: 12px;
				zoom: 50%;
				margin-right: 6px;
			}
			&:active {
				transform: scale(0.6);
			}
		}
		.dark-btn {
			.icon {
				position: absolute;
				top: calc(50% - 8px);
				right: 16px;
			}
		}
	}
}

html.dark .h5-header {
	background-color: rgba(0, 0, 0, 0.72);
}
</style>
