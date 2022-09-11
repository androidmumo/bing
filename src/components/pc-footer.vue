<script setup lang="ts"></script>

<template>
	<div class="pc-footer">
		<div class="link">
			<a class="link-item" href="https://www.mcloc.cn">小马奔腾的主页</a>
			<a class="link-item" href="https://blog.mcloc.cn">小马奔腾的博客</a>
			<a class="link-item" href="https://github.com/androidmumo/bing">
				<i-mdi:github />
			</a>
		</div>
		<div class="copyright">Copyright © 2022 mcloc.cn</div>
		<div class="beian">
			<a target="_blank" href="https://beian.miit.gov.cn/"
				>晋ICP备20001086号-1
			</a>
			<a
				target="_blank"
				href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41080202000141"
			>
				<img
					style="width: 14px; margin-right: 6px"
					src="https://www.mcloc.cn/wp-content/uploads/2020/04/beiantubiao-19.png"
				/>
				<span>豫公网安备 41080202000141号</span>
			</a>
		</div>
	</div>
</template>

<style scoped lang="scss">
.pc-footer {
	width: 100%;
	padding: 20px 16px;
	margin-top: 30px;
	background-color: #f5f5f5;
	font-size: 12px;
	.link {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		.link-item {
			margin-right: 10px;
			display: flex;
			align-items: center;
		}
	}
	.copyright {
		margin-bottom: 20px;
	}
	.beian {
		display: flex;
		align-items: center;
		a {
			margin-right: 10px;
			display: flex;
			align-items: center;
		}
	}
}

html.dark {
	.pc-footer {
		background-color: #f5f5f511;
	}
}
</style>
