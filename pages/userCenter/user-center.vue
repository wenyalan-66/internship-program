<template>
	<view class="user-info">
		<u-image class="logo" height="100rpx" src="../../static/epiroc-logo.jpg" mode="aspectFit"></u-image>
		<view class="base-info">
			<view class="left-text">
				<view class="username">{{userInfo.username}}
					<view class="role">&nbsp;&nbsp;{{userInfo.roleDescription}}</view>
				</view>
				<view class="company">{{userInfo.company==='1'?'安百拓（沈阳）贸易有限公司':'安百拓贸易有限公司'}}</view>
				<view class="company" @click="changePwdShow=true" style="color: #fff;">修改密码</view>
			</view>
			<view class="right-icon">
				<u-avatar src="@/static/e-logo.png"></u-avatar>
			</view>
		</view>
		<view class="row-item">
			邮箱：{{userInfo.email}}
		</view>
		<view class="row-item">
			电话：{{userInfo.phone}}
		</view>
		<u-tabbar active-color='#ffc72c' :list="list"></u-tabbar>
		<u-modal v-model="changePwdShow" title="修改密码" :confirm-style="confirmStyle" @confirm="resetPwd" :mask-close-able="true">
			<view class="slot-content">
				<view class="form-item">
					<div class="sub-title">旧密码</div>
					<div class="content"><u-input v-model="pwdObj.originPassword" password type="password" border /></div>
				</view>
				<view class="form-item">
					<div class="sub-title">新密码</div>
					<div class="content"><u-input v-model="pwdObj.newPassword" password type="password" border /></div>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	import STATIC from '../../common/js/static.js';
	import {userLogOut, resetPassword} from '../../common/api/getData.js';
	export default {
		data() {
			return {
				userInfo: {},
				changePwdShow: false,
				pwdObj: {
					originPassword: '',
					newPassword: ''
				},
				confirmStyle: {
					color: '#ffc72c'
				},
			}
		},
		computed: {
			...mapState('commonInfo', ['customerInfo']),
			...mapState('tabBar', ['list'])
		},
		methods: {
			...mapActions('commonInfo', ['queryCustomerInfo', 'queryMaterialInfo', 'queryChinaMap', 'queryAuditorList']),
			...mapActions('tabBar', ['getTabbar']),
			async resetPwd() {
				if(!this.pwdObj.originPassword || !this.pwdObj.newPassword) {
					uni.showToast({
						title: '请填写完整！',
						icon: 'none'
					})
					this.changePwdShow = true
					return
				}
				const resetRes = await resetPassword(this.pwdObj)
				if(resetRes.success) {
					uni.showToast({
						title: '重置成功！'
					})
					const logoutRes = await userLogOut();
					if(logoutRes && logoutRes.success) {
						try {
						    uni.setStorageSync('userInfo', {})
						    console.log(uni.getStorageSync('userInfo'))
						    uni.setStorageSync('access_token', '');
						} catch (e) {
						    // error
						} finally {
							uni.redirectTo({
								url: '/pages/sso/login'
							})
						}
					}
				} else {
					uni.showToast({
						title: resetRes.message,
						icon: 'none'
					})
				}
			},
		},
		async onLoad() {
			this.userInfo = uni.getStorageSync('userInfo');
			//获取商户和零备件信息
			await this.queryCustomerInfo({company: this.userInfo.company});
			await this.queryMaterialInfo({company: this.userInfo.company});
			await this.queryAuditorList({roleCode: '3'});
			await this.getTabbar();
			//获取行政区信息
			await this.queryChinaMap({
				keyword: '全国',
				sub_admin: 1,
				ak: STATIC.BAIDUMAP_AK,
				extensions_code: 1
			})
		},
		onNavigationBarButtonTap() {
			uni.showModal({
				content: '退出登录！',
				confirmColor: '#ffc72c',
				success: async function(res) {
					if (res.confirm) {
						const logoutRes = await userLogOut();
						if(logoutRes && logoutRes.success) {
							uni.showToast({
								icon: 'success',
								title: '登出成功！'
							}),
							uni.setStorageSync('userInfo', {})
							uni.setStorageSync('access_token', '')
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/sso/login'
								})
							}, 600)
							
						}
					}
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.user-info {
		padding: 60rpx 40rpx;

		.base-info {
			display: flex;
			margin-top: 20rpx;
			color: #425563;
			background-color: #ffc72c;
			padding: 40rpx 20rpx;
			border-radius: 20rpx;

			.left-text,
			.right-icon {
				display: flex;
			}

			.left-text {
				flex: 2;
				flex-direction: column;

				.username {
					display: flex;
					font-size: 36rpx;

					.role {
						font-size: 20rpx;
						margin: auto;
						color: #001e32;
					}
				}

				.company {
					display: flex;
					font-size: 24rpx;
					margin-top: 20rpx;
				}
			}

			.right-icon {
				flex: 1;
				justify-content: center;
			}
		}
		.slot-content {
			padding: 20rpx;
		}
		
		.form-item {
			display: flex;
			margin-top: 20rpx;
			.sub-title {
				justify-content: center;
				align-items: center;
				display: flex;
				flex: 1;
			}
			.content {
				display: flex;
				flex: 3;
			}
		}

		.row-item {
			height: 60rpx;
			line-height: 60rpx;
			padding: 30rpx;
		}
	}
</style>
