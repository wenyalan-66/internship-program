<template>
	<view>
		<view class="top-buttons" v-if="roleCode==='0'||roleCode==='2'">
			<view class="btn-box">
				<button class="create-btn" @tap="toCreate('0')">新建合同（南京）</button>
			</view>
			<view class="btn-box">
				<button class="create-btn" @tap="toCreate('1')">新建合同（沈阳）</button>
			</view>
		</view>
		<u-card v-for="contract in contracts" :title="contractTitle(contract)" :sub-title="contractStatus(contract)" sub-title-color="#ffc72c" padding="16"
			title-size="22" sub-title-size="20" :key="contract.id" class="quota-card" @head-click="showPDF(contract)">
			<view slot="body">
				<view class="customer-info flex-row">
					<view class="flex-item customer-name">{{ contract.customer.customer }}</view>
					<view class="flex-item customer-code">编号：{{ contract.customer.customerCode }}</view>
				</view>
				<view class="create-info flex-row">
					<view class="flex-item create-by">销售人员：{{ contract.createBy }}</view>
					<view class="flex-item create-time">{{ contract.createdAt }}</view>
				</view>
				<view class="flex-row">
					<view class="flex-item update-btn" v-if="contract.fileStatus==='0'" @tap="editContractStatus(contract)">
						修改合同状态</view>
					<view class="flex-item update-btn" v-else>异常原因：{{contract.reason}}</view>
					<view class="flex-item edit-btn" v-if="contract.status!=='1'" @tap="editContract(contract)">修改合同</view>
					<view class="flex-item edit-btn" v-if="roleCode==='3'" @tap="auditContract(contract)">合同审核</view>
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
		getContractList, updateContractStatus, auditContract
	} from '../../common/api/getData.js';
	import { mapState } from 'vuex';
	import Util from "../../common/js/util.js";
	export default {
		data() {
			return {
				contracts: [],
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
				selectedContract: {}
			}
		},
		computed: {
			...mapState('tabBar', ['list'])
		},
		methods: {
			toCreate(type) {
				let url = '/pages/contract/add?modelType=' + type;
				uni.navigateTo({
					url: url,
				})
			},
			editContract(obj) {
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
				let url = '/pages/contract/add?type=edit';
				uni.navigateTo({
					url: url,
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('contractInfo', {
							data: obj
						})
					}
				})
			},
			editContractStatus(obj) {
				this.selectedContract = obj;
				this.statusShow = true
			},
			auditContract(obj) {
				this.selectedContract = obj;
				this.commentInputShow = true;
			},
			async auditConfirm(status) {
				let params = {
					comment: this.comment,
					id: this.selectedContract.id,
					status: status,
					flag: '1',  //表示是合同
					gmFlag: this.selectedContract.gmFlag
				}
				const auditRes = await auditContract(params);
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
			contractTitle(o) {
				return '合同-' + o.contractCode
			},
			contractStatus(o) {
				let status = o.status,
				statusText = '',
				contractStatus = o.fileStatus,
				contractStatusText = '';
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
				switch (contractStatus) {
					case '0':
						contractStatusText = '正常';
						break;
					case '1':
						contractStatusText = '丢单';
						break;
					case '2':
						contractStatusText = '不执行';
						break;
					case '3':
						contractStatusText = '部分执行';
						break;
					default:
						contractStatusText = '未知状态';
						break;
				};
				return '(' + contractStatusText + ')' + statusText
			},
			reasonConfirm(e) {
				if (e[0].value === '0') return
				this.reasonInputShow = true;
				this.fileStatus = e[0].value
			},
			async statusConfirm() {
				let params = {
					id: this.selectedContract.id,
					fileStatus: this.fileStatus,
					reason: this.reason
				}
				const res = await updateContractStatus(params);
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
				this.selectedContract = {};
				this.fileStatus = '';
				this.reason = ''
			},
			showPDF(contract) {
				if(contract.status !== '0' || (contract.fileStatus !== '0' && contract.fileStatus !== '3')) {
					uni.showToast({
						title: '无法查看此报价单！',
						icon: 'none'
					})
					return
				}
				//web-view的问题 变量计算先放在这里
				//报价总计行
				let totalInTax = 0,
					freightInTax = 0,
					discountInTax = 0,
					totalPriceInTax = 0;
				contract.materials.forEach(element => {
					totalInTax += parseInt(element.quantity) * element.salesPriceIncludingTax;
					freightInTax += parseFloat(element.fee) || 0;
					totalPriceInTax += (parseFloat(element.totalValue) + parseFloat(element.fee))
				});
				discountInTax = parseFloat(totalInTax) - totalPriceInTax;
				
				contract.totalInTax = totalInTax;
				contract.freightInTax = freightInTax;
				contract.discountInTax = discountInTax;
				contract.totalPriceInTax = totalPriceInTax.toFixed(2);
				console.log(contract);
				//付款条件
				const paymentTerm = contract.customer.paymentTerm;
				let paymentTermText = "", creditType = "", creditDays = 0, prePercent = 0, surplusPercent = 0;
				switch (paymentTerm) {
					case 'Y012':
						paymentTermText = '30%预付款,70%余款发货前付清。';
						creditType = 'non-credit';
						prePercent = 30;
						surplusPercent = 70;
						break;
					case 'Y000':
						paymentTermText = '100%预付款。';
						creditType = 'non-credit';
						prePercent = 100;
						surplusPercent = 0;
						break;
					case 'YD21':
						paymentTermText = '发票后21天付款。';
						creditType = 'credit';
						creditDays = 21;
						break;
					case 'YD30':
						paymentTermText = '发票后30天付款。';
						creditType = 'credit';
						creditDays = 30;
						break;
					case 'YD45':
						paymentTermText = '发票后45天付款。';
						creditType = 'credit';
						creditDays = 45;
						break;
					case 'YD60':
						paymentTermText = '发票后60天付款。';
						creditType = 'credit';
						creditDays = 60;
						break;
					case 'YD90':
						paymentTermText = '发票后90天付款。';
						creditType = 'credit';
						creditDays = 90;
						break;
					default:
						break;
				}
				contract.paymentTermText = paymentTermText;
				contract.creditType = creditType;
				contract.creditDays = creditDays;
				contract.prePercent = prePercent;
				contract.surplusPercent = surplusPercent;
				contract.userInfo = uni.getStorageSync('userInfo')
				
				uni.navigateTo({
					url: '/pages/contract/preview',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('contractData', {
							data: contract
						})
					}
				})
			},
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
			const res = await getContractList(Object.assign({}, this.queryParams, {
				pageSize: 10,
				pageNo: this.currentPage
			}));
			if (!res.success) {
				uni.showToast({
					title: '获取合同列表出错！',
					icon: "none"
				});
				return;
			}
			this.contracts = res.result.records;
			let total = res.result.total;
			this.maxPage = Math.ceil(total / 10);
		},
		async onPullDownRefresh() {
			const res = await getContractList(Object.assign({}, this.queryParams, {
				pageSize: 10,
				pageNo: this.currentPage
			}));
			if (!res.success) {
				uni.showToast({
					icon: 'none',
					title: '获取合同列表出错！'
				});
				uni.stopPullDownRefresh();
				return;
			}
			this.contracts = res.result.records;
			uni.stopPullDownRefresh();
		},
		async onReachBottom() {
			if (this.currentPage >= this.maxPage) return;
			this.currentPage++;
			const res = await getContractList(Object.assign({}, this.queryParams, {
				pageSize: 10,
				pageNo: this.currentPage
			}));
			if (!res.success) {
				uni.showToast({
					icon: 'none',
					title: '获取合同列表出错！'
				});
				return;
			}
			res.result.records.forEach(element => {
				this.contracts.push(element);
			})
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/css/quotation-list.scss';
</style>
