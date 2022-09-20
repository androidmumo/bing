import { resolve } from 'path'
import Tov from './presets/tov'
import { defineConfig } from 'vite'

export default defineConfig({
	base: './',
	server: {
		//使用IP能访问
		host: '0.0.0.0',
	},
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
		},
	},
	plugins: [Tov()],
})
