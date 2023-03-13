import { resolve } from 'path'
import Tov from './presets/tov'
import { defineConfig } from 'vite'

// 写入编译时间
const fs = require('fs')
const versionJSON = {
	compileTime: new Date().getTime(),
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
	},
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
		},
	},
	plugins: [Tov()],
})
