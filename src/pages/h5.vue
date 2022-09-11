<template>
	<div class="h5">
		<h5Header />
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component"></component>
			</keep-alive>
		</router-view>
		<h5Footer />
	</div>
</template>

<route lang="yaml">
meta:
  agent: h5
  keepAlive: true
</route>
