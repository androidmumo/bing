export default () => {
	const { t, locale } = useI18n()
	const toggleLocale = () => {
		locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
	}

	const language = computed(() => (locale.value === 'zh-CN' ? '中文' : 'En'))

	return { t, language, toggleLocale }
}
