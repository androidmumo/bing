<script setup lang="ts">
import { UnwrapNestedRefs } from 'vue'
import { ImagePreview } from '@arco-design/web-vue/es/image'
import '@arco-design/web-vue/es/image/style/css.js'

const emit = defineEmits(['update:visible'])

interface Props {
	visible: boolean
	src?: string
}
const props = withDefaults(defineProps<Props>(), {
	src: '',
})

const state = reactive({
	visible: false, // 显示图片预览
}) as UnwrapNestedRefs<any>

watch(
	() => props.visible,
	(newValue) => {
		state.visible = newValue
	}
)

const close = () => {
	emit('update:visible', false)
}
</script>

<template>
	<div class="pc-image-preview">
		<image-preview
			v-model:visible="state.visible"
			:src="props.src"
			@close="close"
		/>
	</div>
</template>

<style scoped lang="scss"></style>
