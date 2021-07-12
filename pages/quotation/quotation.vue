<template>
	<view>
		<view class="top-buttons" v-if="roleCode==='0'||roleCode==='2'">
			<view class="btn-box">
				<button class="create-btn" @tap="toCreate('0')">新建报价单（南京）</button>
			</view>
			<view class="btn-box">
				<button class="create-btn" @tap="toCreate('1')">新建报价单（沈阳）</button>
			</view>
		</view>
		<u-card v-for="quota in quotations" :title="quotaTitle(quota)" :sub-title="quotaStatus(quota)"
			sub-title-color="#ffc72c" padding="16" title-size="22" sub-title-size="20" :key="quota.id"
			class="quota-card" @head-click="showPDF(quota)">
			<view slot="body">
				<view class="customer-info flex-row">
					<view class="flex-item customer-name">{{ quota.customer.customer }}</view>
					<view class="flex-item customer-code">编号：{{ quota.customer.customerCode }}</view>
				</view>
				<view class="create-info flex-row">
					<view class="flex-item create-by">销售人员：{{ quota.createBy }}</view>
					<view class="flex-item create-time">{{ quota.createdAt }}</view>
				</view>
				<view class="flex-row">
					<view class="flex-item update-btn" v-if="quota.fileStatus==='0'" @tap="editQuotaStatus(quota)">
						修改报价单状态</view>
					<view class="flex-item update-btn" v-else>异常原因：{{quota.reason}}</view>
					<view class="flex-item edit-btn" v-if="quota.status!=='1'" @tap="editQuota(quota)">修改报价</view>
					<view class="flex-item edit-btn" v-if="roleCode==='3'" @tap="auditQuota(quota)">报价审核</view>
				</view>
			</view>
		</u-card>
		<view class="bottom-tip" v-if="currentPage===maxPage">————&nbsp;&nbsp;我是有底线的&nbsp;&nbsp;————</view>
		<u-modal v-model="reasonInputShow" @confirm="statusConfirm" title="原因" :confirm-style="confirmStyle">
			<view class="slot-content">
				<u-input v-model="reason" placeholder="请输入原因" type="textarea" :border="true" />
			</view>
		</u-modal>
		<u-select v-model="statusShow" title="注意!状态只可更改一次" :list="statusList" @confirm="reasonConfirm"></u-select>
		<u-modal v-model="commentInputShow" :show-cancel-button="true" @confirm="auditConfirm('0')" confirm-text="通过" @cancel="auditConfirm('2')" cancel-text="驳回" title="审核" :confirm-style="confirmStyle">
			<view class="slot-content">
				<u-input v-model="comment" placeholder="请输入审核意见" type="textarea" :border="true" />
			</view>
		</u-modal>
		<u-tabbar active-color='#ffc72c' :list="list"></u-tabbar>
	</view>
</template>

<script>
	import {
		getQuotationList,
		updateQuotaStatus,
		auditQuotation
	} from "../../common/api/getData.js";
	import {
		mapState
	} from "vuex";
	import Util from "../../common/js/util.js";
	export default {
		data() {
			return {
				quotations: [],
				queryParams: {},
				currentPage: 1,
				maxPage: 0,
				roleCode: '',
				statusShow: false,
				reasonInputShow: false,
				commentInputShow: false,
				fileStatus: '',
				reason: '',
				comment: '',
				confirmStyle: {
					color: '#ffc72c'
				},
				statusList: [{
						label: '正常',
						value: '0'
					},
					{
						label: '丢单',
						value: '1'
					},
					{
						label: '不执行',
						value: '2'
					},
					{
						label: '部分执行',
						value: '3'
					}
				],
				selectedQuota: {}
			}
		},
		computed: {
			...mapState('tabBar', ['list'])
		},
		methods: {
			toCreate(type) {
				let url = '/pages/quotation/add?modelType=' + type;
				uni.navigateTo({
					url: url,
				})
			},
			showPDF(quota) {
				//web-view的问题 变量计算先放在这里
				if(quota.status !== '0' || (quota.fileStatus !== '0' && quota.fileStatus !== '3')) {
					uni.showToast({
						title: '无法查看此报价单！',
						icon: 'none'
					})
					return
				}
				quota.currentDate = Util.dateFormat(new Date(), 'yyyy-MM-dd');
				let expiredDay = null
				if (quota.expireType === "1") {
					//当月生效
					expiredDay = Util.lastDayOfMonth(quota.currentDate);
				} else if (quota.expireType === "0") {
					//一个月内有效
					expiredDay = Util.dayOfNextMonth(quota.currentDate);
				} else {
					expiredDay = Util.plusDays(new Date(quota.currentDate), parseInt(quota.expireType))
				};
				quota.expiredDay = expiredDay;
				//报价总计行
				let totalInTax = 0,
					freightInTax = 0,
					discountInTax = 0,
					totalPriceInTax = 0;
				quota.materials.forEach(element => {
					element.deliveryDate = Util.plusDays(new Date(), element.delivery);
					element.originNumber = element.originNumber || '————';
					totalInTax += parseInt(element.quantity) * element.salesPriceIncludingTax;
					freightInTax += parseFloat(element.fee) || 0;
					totalPriceInTax += (parseFloat(element.totalValue) + parseFloat(element.fee))
				});
				discountInTax = parseFloat(totalInTax) - totalPriceInTax;

				quota.totalInTax = totalInTax;
				quota.freightInTax = freightInTax;
				quota.discountInTax = discountInTax;
				quota.totalPriceInTax = totalPriceInTax;

				//付款条件
				const paymentTerm = quota.customer.paymentTerm;
				let paymentTermText = ""
				switch (paymentTerm) {
					case 'Y012':
						paymentTermText = '30%预付款,70%余款发货前付清。';
						break;
					case 'Y000':
						paymentTermText = '100%预付款。';
						break;
					case 'YD21':
						paymentTermText = '发票后21天付款。';
						break;
					case 'YD30':
						paymentTermText = '发票后30天付款。';
						break;
					case 'YD45':
						paymentTermText = '发票后45天付款。';
						break;
					case 'YD60':
						paymentTermText = '发票后60天付款。';
						break;
					case 'YD90':
						paymentTermText = '发票后90天付款。';
						break;
					default:
						break;
				}
				quota.paymentTermText = paymentTermText;
				quota.userInfo = uni.getStorageSync('userInfo')
				
				uni.navigateTo({
					url: '/pages/quotation/preview',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('quotationData', {
							data: quota
						})
					}
				})
			},
			editQuota(obj) {
				if(obj.status+'' === '1') {
					uni.showToast({
						icon: 'none',
						title: '无法修改待审核数据！'
					});
					return
				} else if (obj.fileStatus !== '0' && obj.fileStatus !== '3') {
					uni.showToast({
						icon: 'none',
						title: '无法修改丢单或者不执行数据！'
					});
					return
				}
				let url = '/pages/quotation/add?type=edit';
				uni.navigateTo({
					url: url,
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('quotaInfo', {
							data: obj
						})
					}
				})
			},
			editQuotaStatus(obj) {
				this.selectedQuota = obj;
				this.statusShow = true
			},
			auditQuota(obj) {
				this.selectedQuota = obj;
				this.commentInputShow = true;
			},
			async auditConfirm(status) {
				let params = {
					comment: this.comment,
					id: this.selectedQuota.id,
					status: status,
					flag: '0',  //表示是报价
					gmFlag: this.selectedQuota.gmFlag
				}
				const auditRes = await auditQuotation(params);
				if(!auditRes.success) {
					uni.showToast({
						icon: 'none',
						title: '提交失败，请稍后重试！'
					});
					return
				}
				uni.showToast({
					icon: 'success',
					title: '提交成功！'
				});
				this.onPullDownRefresh()
			},
			quotaTitle(o) {
				return '报价单-' + o.quotaCode
			},
			quotaStatus(o) {
				let status = o.status,
					statusText = '',
					quotaStatus = o.fileStatus,
					quotaStatusText = '';
				switch (status) {
					case '0':
						statusText = '已完成';
						break;
					case '1':
						statusText = '待审核';
						break;
					case '2':
						statusText = '驳回';
						break;
					default:
						statusText = '未知状态';
						break;
				};
				switch (quotaStatus) {
					case '0':
						quotaStatusText = '正常';
						break;
					case '1':
						quotaStatusText = '丢单';
						break;
					case '2':
						quotaStatusText = '不执行';
						break;
					case '3':
						quotaStatusText = '部分执行';
						break;
					default:
						quotaStatusText = '未知状态';
						break;
				};
				return '(' + quotaStatusText + ')' + statusText
			},
			reasonConfirm(e) {
				if (e[0].value === '0') return
				this.reasonInputShow = true;
				this.fileStatus = e[0].value
			},
			async statusConfirm() {
				let params = {
					id: this.selectedQuota.id,
					fileStatus: this.fileStatus,
					reason: this.reason
				}
				const res = await updateQuotaStatus(params);
				if (!res.success) {
					uni.showToast({
						icon: 'none',
						title: '修改失败，请稍后重试！'
					});
				} else {
					uni.showToast({
						icon: 'success',
						title: '修改成功！'
					});
					this.onPullDownRefresh()
				}
				this.selectedQuota = {};
				this.fileStatus = '';
				this.reason = ''
			}
		},
		async onReady() {
			this.roleCode = uni.getStorageSync('userInfo').roleCode;
			if(this.roleCode + '' === '1' || this.roleCode + '' === '3') {
				//角色为管理员或者特殊管理员 查找待审核合同
				this.queryParams = {
					status: "1", //pending
					auditBy: uni.getStorageSync('userInfo').realname
				}
			}
			const res = await getQuotationList(Object.assign({}, this.queryParams, {
				pageSize: 10,
				pageNo: this.currentPage
			}));
			if (!res.success) {
				uni.showToast({
					icon: 'none',
					title: '获取报价列表出错！'
				});
				return;
			}
			this.quotations = res.result.records;
			let total = res.result.total;
			this.maxPage = Math.ceil(total / 10);
		},
		async onPullDownRefresh() {
			const res = await getQuotationList(Object.assign({}, this.queryParams, {
				pageSize: 10,
				pageNo: this.currentPage
			}));
			if (!res.success) {
				uni.showToast({
					icon: 'none',
					title: '获取报价列表出错！'
				});
				uni.stopPullDownRefresh();
				return;
			}
			this.quotations = res.result.records;
			uni.stopPullDownRefresh();
		},
		async onReachBottom() {
			if (this.currentPage >= this.maxPage) return;
			this.currentPage++;
			const res = await getQuotationList(Object.assign({}, this.queryParams, {
				pageSize: 10,
				pageNo: this.currentPage
			}));
			if (!res.success) {
				uni.showToast({
					icon: 'none',
					title: '获取报价列表出错！'
				});
				return;
			}
			res.result.records.forEach(element => {
				this.quotations.push(element);
			})
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/css/quotation-list.scss';
</style>
