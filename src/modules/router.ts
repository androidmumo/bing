import type { App } from 'vue'
import { setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes as fileRoutes } from 'vue-router/auto/routes'
const { toggleDark } = useDarks()

export const router = createRouter({
	history: createWebHashHistory(),
	routes: setupLayouts(fileRoutes),
})

// 根据设备开关暗黑模式
const checkMediaForDark = () => {
	const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
	toggleDark(isDark)
}

// 根据设备屏幕宽度决定路由
const checkDeviceForRoute = (next: any) => {
	const isMobileDevice = window.screen.availWidth < 1200
	if (isMobileDevice) {
		next('/h5')
	} else {
		next('/pc')
	}
}

router.beforeEach((to, from, next) => {
	if (to.path === '/') {
		checkMediaForDark()
		checkDeviceForRoute(next)
	} else {
		next()
	}
})

export default (app: App) => app.use(router)
