import { resolve } from 'path'
import Tov from './presets/tov'
import { defineConfig } from 'vite'

// 写入编译时间与版本号(版本号由 CI 通过 APP_VERSION 环境变量注入=Release tag)
const fs = require('fs')
const versionJSON = {
	compileTime: new Date().getTime(),
	version: process.env.APP_VERSION || 'dev',
}
fs.writeFile('./version.json', JSON.stringify(versionJSON), (err: any) => {
	if (!err) return console.log('文件写入成功')
	console.error('文件写入失败', err)
})

export default defineConfig({
	base: './',
	server: {
		//使用IP能访问
		host: '0.0.0.0',
		proxy: {
			'/api': 'http://bingnext.mcloc.cn',
			'/img': 'http://bingnext.mcloc.cn',
		},
	},
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
		},
	},
	plugins: [Tov()],
})
