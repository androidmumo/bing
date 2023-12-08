import { defineStore } from 'pinia'
import { getWebInfo } from '~/api'

export default defineStore('useWebInfoStore', {
	state() {
		return {
			webInfo: {
				link: <any>[],
				htmlSlot: {
					beforeFooter: '',
					afterFooter: '',
				},
			},
		}
	},
	getters: {},
	actions: {
		async init() {
			this.webInfo = await getWebInfo()
		},
	},
})
