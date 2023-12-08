<template>
	<router-view />
</template>

<script setup lang="ts">
const webInfoStore = useWebInfoStore()
webInfoStore.init()
</script>
