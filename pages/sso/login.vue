<template>
	<view class="login-content">
		<u-image class="logo" height="100rpx" src="../../static/epiroc-logo.jpg" mode="aspectFit"></u-image>
		<u-form class="login-form" :model="form" ref="uForm" :label-width="120">
			<u-form-item>
				<u-input v-model="form.username" prop="username" placeholder="请输入登录用户名" />
			</u-form-item>
			<u-form-item>
				<u-input v-model="form.password" prop="password" type="password" placeholder="请输入密码" />
			</u-form-item>
		</u-form>
		<button class="login-btn" form-type="submit" @tap="loginIn">登录</button>
		<view class="bottom-tip">
			<text class="tip-text" @tap="showAdminEmail">找回密码</text>
			<view class="tip-line">|</view><text class="tip-text" @tap="toRegister">立即注册</text>
		</view>
	</view>
</template>

<script>
	import {
		userLoginIn
	} from '../../common/api/getData.js';
	import {
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				tapFlag: false,
				form: {
					username: '',
					password: ''
				}
			}
		},
		methods: {
			...mapActions('tabBar', ['getTabbar']),
			async loginIn() {
				if (this.tapFlag) return;
				this.tapFlag = true;
				if (!this.form.username || !this.form.password) {
					uni.showToast({
						icon: "none",
						title: "请输入用户名和密码！"
					})
					this.tapFlag = false;
					return
				}
				const loginRes = await userLoginIn(this.form)
				if(!loginRes) {
					this.tapFlag = false;
					uni.showToast({
						title: '网络开小差了！',
						icon: "none",
						duration: 2000
					})
					return
				}
				if (!loginRes.success) {
					this.tapFlag = false;
					uni.showToast({
						title: loginRes.message,
						icon: "none",
						duration: 2000
					})
					return
				}
				uni.setStorageSync('access_token', loginRes.result.token);
				uni.setStorageSync('userInfo', loginRes.result.userInfo);
				this.getTabbar();
				uni.switchTab({
				    url: '/pages/userCenter/user-center',
					success:()=> {
						console.log('success');
					},
					fail:()=>{
						console.log('fail');
					}
				});
			},
			showAdminEmail() {
				uni.showToast({
					icon: "none",
					title: "请联系yu.juan.zheng@epiroc.com"
				})
			},
			toRegister() {
				uni.navigateTo({
					url: '/pages/sso/register'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.login-content {
		position: absolute;
		height: 100%;
		width: 100%;

		.logo {
			margin-top: 200rpx;
		}

		.login-form {
			margin: 40rpx 60rpx;
		}

		.login-btn {
			width: 70%;
			background-color: #ffc72c;
			border: none;
			margin-top: 120rpx;
			color: white;
		}

		.login-btn:hover {
			background-color: rgba($color: #ffc72c, $alpha: 0.6);
		}

		.bottom-tip {
			position: fixed;
			bottom: 60rpx;
			width: 100%;
			text-align: center;

			.tip-text,
			.tip-line {
				color: #ffc72c;
				display: inline-block;
			}

			.tip-line {
				margin: 0 30rpx;
			}
		}
	}

	@media only screen and (min-width: 428px) {
		.login-content {
			font-size: 14px;

			.u-form-item,
			.uni-input-input,
			.uni-input-placeholder {
				font-size: 20px;
			}
		}
	}
</style>
