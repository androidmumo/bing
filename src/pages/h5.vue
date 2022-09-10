<script setup lang="ts">
// 解决iOS系统下active无效的问题
onMounted(() => {
	document.body.addEventListener('touchstart', function () {}, false)
})
</script>
<template>
	<div class="h5">
		<h5Header />
		<router-view />
		<h5Footer />
	</div>
</template>
