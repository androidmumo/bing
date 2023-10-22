<template>
	<div class="pc">
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component"></component>
			</keep-alive>
		</router-view>
	</div>
</template>

<style lang="scss">
@import url('../styles/pc/pc.scss');
</style>

<route lang="yaml">
meta:
  agent: pc
  keepAlive: false
</route>
