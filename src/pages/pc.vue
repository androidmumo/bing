<template>
	<div class="pc">
		<pcHeader />
		<div class="pc-content">
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component"></component>
				</keep-alive>
			</router-view>
		</div>
		<pcFooter />
	</div>
</template>

<style lang="scss">
@import url('../styles/pc/pc.scss');
</style>

<route lang="yaml">
meta:
  agent: pc
  keepAlive: true
</route>
