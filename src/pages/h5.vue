<template>
	<div class="h5">
		<h5Header />
		<div class="h5-content">
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component"></component>
				</keep-alive>
			</router-view>
		</div>
		<h5Footer />
	</div>
</template>

<style lang="scss">
@import url('../styles/h5/h5.scss');
</style>

<route lang="yaml">
meta:
  agent: h5
  keepAlive: true
</route>
