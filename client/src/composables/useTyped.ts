import { init } from 'ityped'

export default (
	strings: string[],
	showCursor?: boolean,
	disableBackTyping?: boolean
) => {
	const typedRef = ref<Element>()

	onMounted(() => {
		init(typedRef.value!, {
			strings,
			showCursor,
			disableBackTyping,
		})
	})
	return typedRef
}
