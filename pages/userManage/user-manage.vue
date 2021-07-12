<template>
	<view>
		暂未开放功能
		<u-tabbar active-color='#ffc72c' :list="list"></u-tabbar>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapState('tabBar', ['list'])
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
