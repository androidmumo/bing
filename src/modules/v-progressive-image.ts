import type { App } from 'vue'
import vProgressiveImage from 'v-progressive-image'

export default (app: App) => {
	app.use(vProgressiveImage, {
		removePreview: false,
		animation: true,
		scale: 1,
		time: 0.5,
		blur: 20,
	})
}
