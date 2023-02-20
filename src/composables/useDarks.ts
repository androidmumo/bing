const isDark = useDark()
const toggleDark = (value: boolean) => {
	const storage = window.sessionStorage
	storage.setItem('dark', value ? '1' : '0')
	useToggle(isDark)(value)
}

export default () => ({ isDark, toggleDark })
