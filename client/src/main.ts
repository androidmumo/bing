import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import 'virtual:windi-devtools'
// 你自定义的 css
import './styles/main.scss'

import App from './App.vue'

const app = createApp(App)

app.mount('#app')
