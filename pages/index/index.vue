<template>
	<view class="content">
		<image class="logo" src="/static/epiroc-logo.jpg"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style scoped>
	.content {
		position: absolute;
		height: 100%;
		width: 100%;
	}

	.logo {
		position: relative;
		height: 49px;
		width: 180px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
