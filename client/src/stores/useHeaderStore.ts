import { defineStore } from 'pinia'

export default defineStore('useHeaderStore', {
	state() {
		return {
			needBack: false, // 需要返回按钮
		}
	},
	getters: {},
	actions: {
		setBackBtnStatus(value: boolean) {
			this.$state.needBack = value
		},
	},
})
