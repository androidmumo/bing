<template>
	<div class="h5">
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component"></component>
			</keep-alive>
		</router-view>
	</div>
</template>

<style lang="scss">
@import url('../styles/h5/h5.scss');
</style>

<route lang="yaml">
meta:
  agent: h5
  keepAlive: false
</route>
