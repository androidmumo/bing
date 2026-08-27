export default () => {
	const { t, locale } = useI18n()
	const toggleLocale = () => {
		locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
	}

	// 徽章用短字形(中/En);title 提示用全称
	const language = computed(() => (locale.value === 'zh-CN' ? '中' : 'En'))
	const languageName = computed(() => (locale.value === 'zh-CN' ? '中文' : 'English'))

	return { t, language, languageName, toggleLocale }
}
