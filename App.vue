<script>
	export default {
		onLaunch: function() {
			//#ifdef APP-PLUS		
			// this.goBack();
			//#endif
			this.goBack();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},

		methods: {
			goBack() {
				if (uni.getStorageSync('access_token')) { //有token
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/userCenter/user-center',
							animationType: 'pop-in',
							animationDuration: 300
						});
					}, 2500)
				} else {
					setTimeout(function() { //去登录
						uni.reLaunch({
							url: '/pages/sso/login',
							animationType: 'pop-in',
							animationDuration: 300
						});
					}, 2500)
				}
			}
		}
	}
</script>
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
