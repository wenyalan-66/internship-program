<template>
	<view>
		<web-view v-if="quotaInfo.modelType==='0'" src="../../hybrid/html/quota-preview.html" @message="message">
		</web-view>
		<web-view v-if="quotaInfo.modelType==='1'" src="../../hybrid/html/quota-preview-sy.html" @message="message">
		</web-view>
	</view>
</template>
<script>
	import {
		base64ToPath
	} from 'image-tools';
	import {
		getQuotaFile
	} from '../../common/api/getData.js';
	export default {
		data() {
			return {
				quotaInfo: {
					// modelType: '0'
				},
				wv: null,
			}
		},
		methods: {
			message(event) {
				let id = event.detail.data[0].id
				//调用获取文件的接口
				this.getPdfBase64(id)
			},
			sendQuota() {
				const that = this;
				plus.runtime.getProperty(plus.runtime.appid, function() {
					that.wv.evalJS("getQuota('" + JSON.stringify(that.quotaInfo) + "')");
				});
			},
			async getPdfBase64(id) {
				uni.showLoading({
					title: '正在从服务器下载文件！'
				});
				const res = await getQuotaFile({
					id: id
				})
				uni.hideLoading();
				if (res && res.success) {
					base64ToPath(res.result.byte, this.quotaInfo.quotaCode).then(path => {
							uni.showToast({
								icon: 'none',
								title: '文件已下载至epiroc.com.rdd/apps目录下' + path,
								duration: 4000
							})
						})
						.catch(error => {
							console.error(error)
						})
					return
				}
				uni.showToast({
					icon: 'none',
					title: res.message,
					duration: 2000
				})
			}
		},
		onLoad(option) {
			const that = this
			const eventChannel = that.getOpenerEventChannel();
			// 监听quotationData事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('quotationData', function(data) {
				that.quotaInfo = data.data
				console.log(data.data);
				that.quotaInfo.token = uni.getStorageSync('access_token');
				// #ifdef APP-PLUS
				let currentWebview = that.$scope.$getAppWebview();
				setTimeout(function() {
					let wv = currentWebview.children()[0];
					that.wv = wv;
					wv.setStyle({
						scalable: true
					})
					that.sendQuota();
				}, 1000);
				// #endif			
			})
			
		}
	}
</script>
