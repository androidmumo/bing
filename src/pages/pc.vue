<template>
	<div class="pc">
		<pcHeader />
		<router-view />
		<pcFooter />
	</div>
</template>

<style scoped lang="scss">
/*
* 全局滚动条
*/
::-webkit-scrollbar {
	width: 11px;
	height: 11px;
	background-color: rgb(246, 247, 248);
}

::-webkit-scrollbar-thumb {
	background-color: rgb(205, 206, 209);
	border-radius: 10px;
}

::-webkit-scrollbar-track {
	background-color: rgb(246, 247, 248);
	border-radius: 10px;
}

html.dark ::-webkit-scrollbar,
html.dark ::-webkit-scrollbar-track {
	background-color: #212529;
}

html.dark ::-webkit-scrollbar-thumb {
	background-color: #343a40;
}
</style>

<route lang="yaml">
meta:
  agent: pc
</route>
