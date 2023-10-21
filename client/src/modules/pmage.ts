import type { App } from 'vue'
import pmage from 'pmage'
import 'pmage/dist/style.css'

export default (app: App) => {
	app.use(pmage)
}
