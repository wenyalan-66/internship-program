<template>
	<view class="quota-content">
		<view class="quota-item">
			<view class="sectionTitle">客户信息</view>
			<view class="quota-flex">
				<view class="flex-left">
					<view class="custom-input">
						<u-input v-model="customerSearch" placeholder="输入客户信息查找" />
					</view>
				</view>
				<view class="flex-ghost"></view>
				<view class="flex-right">
					<u-icon name="search" @tap="searchCustomer"></u-icon>
				</view>
			</view>
			<view class="select-item">
				<view class="text">
					{{contractInfo.customer.customerCode?(contractInfo.customer.customerCode +'/'+contractInfo.customer.customer):''}}
				</view>
			</view>
		</view>
		<view class="quota-item">
			<view class="sectionTitle">商品（物料）信息</view>
			<view v-for='(i,index) in contractInfo.materials' :key="index" class="material-item">
				<view class="quota-flex">
					<view class="flex-left">
						<view class="input-item">
							<u-input v-model="materialSearch" placeholder="请输入商品编号" />
						</view>
					</view>
					<view class="flex-ghost">
						<u-icon name="search" @tap="searchMaterial(index)"></u-icon>
					</view>
					<view class="flex-right">
						<view class="input-item">
							<u-input v-model="i.quantity" placeholder="请输入数量" @blur="recalcMaterialInfo(index)"
								type="number" />
						</view>
					</view>
				</view>
				<view class="quota-flex">
					<view class="select-item">
						<view class="text">{{i.nameCn || i.materialName}}</view>
					</view>
					<view class="flex-minus">
						<u-icon name="minus-circle" class="epiroc-icon" @tap="delMaterial(index)"></u-icon>
					</view>
				</view>
				<view class="quota-flex">
					<view class="flex-left">
						<view class="text">特价折扣：{{parseInt(i.discount*100)}}</view>
					</view>
					<view class="flex-ghost">%</view>
					<view class="flex-right">
						<u-radio-group v-model="i.needFee" @change="value => recalcMaterialInfo(index)"
							style="margin-left: 20rpx;" active-color="#ffc72c">
							<u-radio v-for="(item, feeIndex) in needFeeList" :key="feeIndex" :name="item.value"
								:disabled="item.disabled" label-size="24">
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="quota-flex">
					<view class="flex-left">
						单价：<view class="input-item" style="width: 50%;">
							<u-input :value="(i.agentIncludingTax * i.discount).toFixed(2)" placeholder="请输入单价"
								@blur="value=>unitPriceChange(i, index, value)" type="number" />
						</view>
					</view>
					<view class="flex-ghost"></view>
					<view class="flex-right">
						运费：<view class="input-item" style="width: 50%;">
							<u-input :disabled="contractInfo.modelType==='0'||i.needFee==='1'" v-model="i.fee"
								@blur="value=>feeChange(i, index, value)" type="number" />
						</view>
					</view>
				</view>
			</view>
			<button class="material-btn" @tap="addMaterial">新增商品</button>
		</view>
		<view class="quota-item" style="margin-top: 120rpx;">
			<view class="sectionTitle">发货信息</view>
			<view class="quota-flex">
				<view style="display: flex;flex: 1; padding-right: 20rpx;">
					<view class="select-item" v-if="contractInfo.deliveryInfo.province" @tap="showProvince()">
						<view class="text">{{contractInfo.deliveryInfo.provinceName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showProvince()">请选择省份<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
				<view style="display: flex;flex: 1;">
					<view class="select-item" v-if="contractInfo.deliveryInfo.urban" @tap="showCity()">
						<view class="text">{{contractInfo.deliveryInfo.urbanName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showCity()">请选择城市<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
			</view>
			<view class="quota-flex">
				<view style="display: flex;flex: 1; padding-right: 20rpx;">
					<view class="select-item" v-if="contractInfo.deliveryInfo.region" @tap="showDistriction()">
						<view class="text">{{contractInfo.deliveryInfo.regionName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showDistriction()">请选择地区<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
				<view style="display: flex;flex: 1;">
					<view class="select-item" v-if="contractInfo.deliveryInfo.street" @tap="showStreet()">
						<view class="text">{{contractInfo.deliveryInfo.streetName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showStreet()">请选择街道<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
			</view>
			<view class="input-item" style="margin-top: 20rpx;">
				<u-input v-model="contractInfo.deliveryInfo.address" :disabled="disabledEdit" placeholder="请输入详细发货地址" />
			</view>
			<view class="quota-flex">
				<view class="flex-left">
					合同生效后交货截止天数：<view style="width: 20%;">
						<u-input border :disabled="disabledEdit" v-model="contractInfo.deliveryInfo.deadLines"
							placeholder="请输入" type="number" />
					</view>
				</view>
			</view>

		</view>
		<view class="quota-item">
			<view class="sectionTitle">发货方式</view>
			<u-radio-group :disabled="disabledEdit" v-model="contractInfo.deliveryInfo.deliveryType"
				style="margin-left: 20rpx;" active-color="#ffc72c">
				<u-radio v-for="(item, index) in deliveryTypeList" :key="index" :name="item.value"
					:disabled="item.disabled" label-size="24">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>
		<view class="quota-item" v-if="creditType==='non-credit'">
			<view class="sectionTitle">预付款比例</view>
			<view class="expired-input">
				<u-input class="input-item" :disabled="disabledEdit" :value="prePercent" @blur="checkSpecialPrepercent">
				</u-input>
				<view class="suffix">%</view>
			</view>
		</view>
		<view class="quota-item" v-if="contractInfo.specialInfo.specialApply==='1'">
			<view class="sectionTitle">审核人</view>
			<u-input class="input-item" :disabled="true" placeholder="请选择审核人" :value="auditByName"
				@tap="auditShow=true"></u-input>
		</view>
		<view class="bottom-block">
			<button class="preview-btn" @tap="toPreview">生成合同</button>
		</view>
		<u-select v-model="customerShow" :list="customerSearchList" @confirm="customConfirm"></u-select>
		<u-select v-model="materialShow" :list="materialSearchList" @confirm="materialConfirm"></u-select>
		<u-select v-model="provinceShow" :list="provinceList" @confirm="provinceConfirm"></u-select>
		<u-select v-model="cityShow" :list="cityList" @confirm="cityConfirm"></u-select>
		<u-select v-model="districtionShow" :list="districtionList" @confirm="districtionConfirm"></u-select>
		<u-select v-model="streetShow" :list="streetList" @confirm="streetConfirm"></u-select>
		<u-select v-model="auditShow" :list="auditList" @confirm="auditConfirm"></u-select>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	import STATIC from '../../common/js/static.js';
	import {
		addContract
	} from '../../common/api/getData.js'

	export default {
		data() {
			return {
				operateType: 'add',
				creditType: '',
				originPrepercent: 0, //默认预付款比例 用于校验是否需要审核
				discountFlag: false, //特价标志
				prePercentFlag: false, //预付款比例变化标志
				auditByName: '', //审核人名字
				customerSearch: '',
				customerSearchList: [],
				materialSearch: '',
				materialSearchList: [],
				customerShow: false,
				materialShow: false,
				provinceShow: false,
				cityShow: false,
				districtionShow: false,
				streetShow: false,
				auditShow: false,
				materialIndex: null,
				contractInfo: {
					modelType: '', //合同模板 0：南京     1：沈阳
					quotaCode: '',
					status: '0', //合同状态（0:completed; 1: pending, 2: refused） GIA合同 特价申请->pending  正常合同 ->completed
					auditBy: '',
					gmFlag: '0', //是否需要GM审批 0不需要 1需要
					customer: {},
					specialInfo: {
						specialApply: '0',
						prePercent: 0
					},
					materials: [{
						materialName: "",
						salesPriceIncludingTax: "",
						agentIncludingTax: 0,
						quantity: null,
						totalValue: "",
						unit: 'PC',
						discount: 1,
						fee: 0,
						needFee: '1'
					}],
					deliveryInfo: {
						deliveryType: '0',
						address: '',
						province: '',
						provinceName: '',
						urban: '',
						urbanName: '',
						region: '',
						regionName: '',
						street: '',
						streetName: '',
						deadLines: 0
					}
				},
				disabledEdit: false, //修改合同时 不能修改标志
				provinceList: [],
				cityList: [],
				districtionList: [],
				streetList: [],
				auditList: [],
				deliveryTypeList: [{
					name: '分批发货',
					value: '0',
					disabled: false
				}, {
					name: '整单发货',
					value: '1',
					disabled: false
				}],
				needFeeList: [{
					name: '收取运费',
					value: '0',
					disabled: false
				}, {
					name: '不收取运费',
					value: '1',
					disabled: false
				}],
			}
		},
		computed: {
			...mapState('commonInfo', ['customerInfo', 'materialInfo', 'chinaMap', 'auditorList']),
			prePercent() {
				return parseInt(this.contractInfo.specialInfo.prePercent * 100)
			}
		},
		methods: {
			searchCustomer() {
				if (this.disabledEdit) return;
				this.customerSearchList = [];
				let searchVal = this.customerSearch;
				this.customerInfo.forEach((custom) => {
					let key = custom.customerCode + '/' + custom.customer
					if (key.indexOf(searchVal) >= 0) {
						this.customerSearchList.push({
							value: custom.id,
							label: custom.customerCode + '/' + custom.customer,
							extra: custom
						})
					}
				})
				this.customerShow = true;
			},
			customConfirm(e) {
				let selection = e[0].extra;
				this.contractInfo.customer = selection;
				this.contractInfo.materials = [{
					materialName: "",
					salesPriceIncludingTax: "",
					agentIncludingTax: 0,
					quantity: null,
					totalValue: "",
					unit: 'PC',
					discount: 1,
					fee: 0,
					needFee: '1'
				}]
				let paymentTerm = selection.paymentTerm;
				this.checkCredit(paymentTerm);
				this.contractInfo.specialInfo.prePercent = 0;
				this.originPrepercent = 0;
				switch (paymentTerm) {
					case 'Y012':
						this.contractInfo.specialInfo.prePercent = 0.3;
						this.originPrepercent = 0.3
						break;
					case 'Y000':
						this.contractInfo.specialInfo.prePercent = 1;
						this.originPrepercent = 1
						break;
					case 'YD21':
					case 'YD30':
					case 'YD45':
					case 'YD60':
					case 'YD90':
						break;
					default:
						this.contractInfo.specialInfo.prePercent = 0;
						this.originPrepercent = 0;
						break;
				}
			},
			searchMaterial(i) {
				if (!this.contractInfo.customer.customerCode) {
					uni.showToast({
						title: "请先选择客户",
						icon: "none"
					})
					return
				}
				this.materialIndex = i;
				this.materialSearchList = [];
				let searchVal = this.materialSearch;
				this.materialInfo.forEach((material) => {
					let key = material.partNumber + '/' + material.nameCn
					if (key.indexOf(searchVal) >= 0) {
						this.materialSearchList.push({
							value: material.partNumber,
							label: material.partNumber + '/' + material.nameCn,
							extra: material
						})
					}
				})
				this.materialShow = true;
			},
			materialConfirm(e) {
				this.contractInfo.materials[this.materialIndex] = Object.assign({}, e[0].extra);
				this.contractInfo.materials[this.materialIndex].materialId = this.contractInfo.materials[this
					.materialIndex].id;
				this.contractInfo.materials[this.materialIndex].materialName = this.contractInfo.materials[this
					.materialIndex].nameCn;
				this.contractInfo.materials[this.materialIndex].fee = 0;
				this.contractInfo.materials[this.materialIndex].discount = 1;
				this.contractInfo.materials[this.materialIndex].needFee = '1';
				let customerType = this.contractInfo.customer.customerType,
					agentIncludingTax = 0
				switch (customerType + '') {
					case '1':
						agentIncludingTax = e[0].extra.alevelAgentIncludingTax;
						break;
					case '3':
						agentIncludingTax = e[0].extra.blevelAgentIncludingTax;
						break;
					case '4':
						agentIncludingTax = e[0].extra.clevelAgentIncludingTax;
						break;
					case '2':
						agentIncludingTax = e[0].extra.taxInclusiveEndUserPrice;
						break;
					default:
						agentIncludingTax = '客户信息有误';
						break;
				}
				this.contractInfo.materials[this.materialIndex].agentIncludingTax = agentIncludingTax;
				this.recalcMaterialInfo(this.materialIndex);
			},
			addMaterial() {
				this.contractInfo.materials.push({
					materialName: "",
					salesPriceIncludingTax: "",
					agentIncludingTax: 0,
					quantity: 0,
					totalValue: "",
					unit: 'PC',
					discount: 1,
					fee: 0,
					needFee: '1',
				})
			},
			showProvince() {
				if (this.disabledEdit) return;
				this.provinceShow = true;
			},
			showCity() {
				if (this.disabledEdit) return;
				this.cityShow = true;
			},
			showDistriction() {
				if (this.disabledEdit) return;
				this.districtionShow = true;
			},
			showStreet() {
				if (this.disabledEdit) return;
				this.streetShow = true;
			},

			async provinceConfirm(e) {
				this.cityList = [];
				let provinceInfo = e[0];
				this.contractInfo.deliveryInfo.province = provinceInfo.value;
				this.contractInfo.deliveryInfo.provinceName = provinceInfo.label;
				this.contractInfo.deliveryInfo.urban = '';
				this.contractInfo.deliveryInfo.region = '';
				this.contractInfo.deliveryInfo.street = '';
				let data = {
					keyword: provinceInfo.value,
					sub_admin: 3,
					ak: STATIC.BAIDUMAP_AK,
					extensions_code: 1
				};
				let cityInfo = [];
				let url = 'http://api.map.baidu.com/api_region_search/v1/'
				uni.request({
					url: url,
					method: 'GET',
					data: data,
					header: {
						contentType: 'application/json; charset=utf-8'
					},
					success: (res) => {
						const data = res.data;
						if (data.status === 0) {
							cityInfo = data.districts[0].districts;
							cityInfo.forEach((item) => {
								this.cityList.push({
									label: item.name,
									value: item.code,
									extra: item.districts
								})
							})
						} else {
							uni.showToast({
								title: '获取行政区信息失败！',
								icon: "none",
								duration: 2000
							})
							return
						}
					}
				})
			},

			cityConfirm(e) {
				this.districtionList = [];
				this.contractInfo.deliveryInfo.region = '';
				this.contractInfo.deliveryInfo.street = '';
				if (!e) return;
				let cityInfo = e[0];
				this.contractInfo.deliveryInfo.urbanName = cityInfo.label;
				this.contractInfo.deliveryInfo.urban = cityInfo.value;
				let districtionInfo = cityInfo.extra;
				districtionInfo.forEach((item) => {
					this.districtionList.push({
						label: item.name,
						value: item.code,
						extra: item.districts
					})
				})
			},

			districtionConfirm(e) {
				this.streetList = [];
				this.contractInfo.deliveryInfo.street = '';
				if (!e) return;
				let districtionInfo = e[0];
				this.contractInfo.deliveryInfo.region = districtionInfo.value;
				this.contractInfo.deliveryInfo.regionName = districtionInfo.label;
				let streetInfo = districtionInfo.extra;
				streetInfo.forEach((item) => {
					this.streetList.push({
						label: item.name,
						value: item.code,
						extra: item.districts
					})
				})
			},
			streetConfirm(e) {
				if (!e) return;
				let streetInfo = e[0];
				this.contractInfo.deliveryInfo.streetName = streetInfo.label;
				this.contractInfo.deliveryInfo.street = streetInfo.value;
			},

			recalcMaterialInfo(index) {
				//当商品id 数量 进行此物料信息的计算
				let calcMaterial = this.contractInfo.materials[index];
				if (!calcMaterial.materialId || !calcMaterial.quantity) return;
				calcMaterial.totalValue = (parseFloat(calcMaterial.agentIncludingTax) * parseFloat(calcMaterial.discount) *
					parseInt(calcMaterial.quantity)).toFixed(2);
				if (calcMaterial.needFee === '0') {
					//需要运费 算出参考运费
					let calcFee = parseFloat(calcMaterial.totalValue) * 0.03;
					let realFee = Math.max(calcFee, 500);
					calcMaterial.fee = realFee.toFixed(2);
				} else {
					calcMaterial.fee = 0;
				}
				this.$nextTick(() => {
					this.contractInfo.materials = Object.assign([], this.contractInfo.materials)
				})
			},

			checkCredit(paymentTerm) {
				switch (paymentTerm) {
					case 'Y012':
					case 'Y000':
						this.creditType = 'non-credit';
						break;
					case 'YD21':
					case 'YD30':
					case 'YD45':
					case 'YD60':
					case 'YD90':
						this.creditType = 'credit';
						break;
					default:
						this.creditType = '';
						break;
				}
			},
			unitPriceChange(i, index, value) {
				this.contractInfo.materials[index].discount = parseFloat(value / this.contractInfo.materials[index]
					.agentIncludingTax);
				this.checkSpecialDiscount();
				this.recalcMaterialInfo(index)
			},
			feeChange(i, index, value) {
				this.contractInfo.materials[index].fee = parseFloat(value);
			},

			checkSpecialDiscount() {
				this.discountFlag = false;
				this.contractInfo.gmFlag = '0';
				this.contractInfo.materials.forEach((m) => {
					if (m.agentIncludingTax * m.discount < m.floorPrice) {
						this.discountFlag = true
					}
					if (m.agentIncludingTax * m.discount < m.floorPrice * 0.98) {
						this.contractInfo.gmFlag = '1'
					}
				})
				this.checkSpecialAll();
			},
			checkSpecialPrepercent(e) {
				this.prePercentFlag = false;
				this.contractInfo.specialInfo.prePercent = e / 100;
				if (this.originPrepercent !== parseFloat(e / 100)) {
					this.prePercentFlag = true;
				}
				if (e < 20) this.contractInfo.gmFlag = '1'
				this.checkSpecialAll()
			},

			checkSpecialAll() {
				this.contractInfo.specialInfo.specialApply = (this.discountFlag || this.prePercentFlag) ? '1' : '0'
			},

			auditConfirm(e) {
				this.contractInfo.auditBy = e[0].value;
				this.auditByName = e[0].label
			},
			validCustomer() {
				if (!this.contractInfo.customer.customerCode) {
					uni.showToast({
						title: '请完善客户信息！',
						icon: "none",
						duration: 2000
					});
					return false
				}
				return true
			},
			validDelivery() {
				if (!this.contractInfo.deliveryInfo.province || !this.contractInfo.deliveryInfo.urban || !this.contractInfo
					.deliveryInfo.region ||
					!this.contractInfo.deliveryInfo.street || (!this.contractInfo.deliveryInfo.deadLines && this
						.contractInfo.deliveryInfo.deadLines !== 0)) {
					uni.showToast({
						title: '请完善发货信息！',
						icon: "none",
						duration: 2000
					});
					return false
				}
				return true
			},

			validAudit() {
				if (this.contractInfo.specialInfo.specialApply === '1' && !this.contractInfo.auditBy) {
					uni.showToast({
						title: '请选择审核人！',
						icon: "none",
						duration: 2000
					});
					return false
				}
				return true
			},
			async toPreview() {
				const that = this
				let materials = that.contractInfo.materials,
					materialValid = true;
				let tempMaterials = [];
				materials.forEach((o) => {
					o.id = '';
					if (o.partNumber && o.quantity) {
						tempMaterials.push(o)
					} else {
						uni.showToast({
							title: '请完善物料信息！',
							icon: "none",
							duration: 2000
						});
						materialValid = false;
					}
				})
				let customValid = that.validCustomer();
				let deliveryValid = that.validDelivery();
				let auditValid = that.validAudit();
				if (!customValid || !deliveryValid || !auditValid || !materialValid) return;
				let params = Object.assign({}, {
					customerCode: that.contractInfo.customer.customerCode,
					modelType: that.contractInfo.modelType,
					createdBy: uni.getStorageSync('userInfo').realname,
					deliveryInfo: that.contractInfo.deliveryInfo,
					materials: tempMaterials,
					specialInfo: that.contractInfo.specialInfo,
					quotaCode: that.contractInfo.quotaCode,
					status: that.contractInfo.specialInfo.specialApply,
					auditBy: that.contractInfo.auditBy,
					fileStatus: that.contractInfo.fileStatus || '0',
					gmFlag: that.contractInfo.gmFlag,
					reason: that.contractInfo.reason
				})
				if (that.operateType === 'edit') {
					params.contractCode = that.contractInfo.contractCode;
					params.id = that.contractInfo.id;
				}
				const addRes = await addContract(params);
				if (!addRes.success) {
					uni.showToast({
						title: '新增合同失败！',
						icon: "none",
						duration: 2000
					});
					return
				}
				if (that.contractInfo.specialInfo.specialApply === "1") {
					uni.showToast({
						title: '已提交审核，请耐心等待！',
						icon: "none",
						duration: 2000,
						complete: function() {
							uni.navigateTo({
								url: '/pages/contract/contract',
							})
						}
					});
					return
				}
				that.contractInfo.contractCode = addRes.result.contractCode;
				//web-view的问题 变量计算先放在这里
				//报价总计行
				let totalInTax = 0,
					freightInTax = 0,
					discountInTax = 0,
					totalPriceInTax = 0;
				that.contractInfo.materials.forEach(element => {
					totalInTax += parseInt(element.quantity) * element.salesPriceIncludingTax;
					freightInTax += parseFloat(element.fee) || 0;
					totalPriceInTax += (parseFloat(element.totalValue) + parseFloat(element.fee))
				});
				discountInTax = parseFloat(totalInTax) - totalPriceInTax;

				that.contractInfo.totalInTax = totalInTax;
				that.contractInfo.freightInTax = freightInTax;
				that.contractInfo.discountInTax = discountInTax;
				that.contractInfo.totalPriceInTax = totalPriceInTax.toFixed(2);
				//付款条件
				const paymentTerm = that.contractInfo.customer.paymentTerm;
				let paymentTermText = "",
					creditType = "",
					creditDays = 0,
					prePercent = 0,
					surplusPercent = 0;
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
				that.contractInfo.paymentTermText = paymentTermText;
				that.contractInfo.creditType = creditType;
				that.contractInfo.creditDays = creditDays;
				that.contractInfo.prePercent = prePercent;
				that.contractInfo.surplusPercent = surplusPercent;
				that.contractInfo.userInfo = uni.getStorageSync('userInfo')

				uni.navigateTo({
					url: '/pages/contract/preview',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('contractData', {
							data: that.contractInfo
						})
					}
				})
			}
		},
		onLoad: function(option) {
			let that = this
			const eventChannel = this.getOpenerEventChannel();
			//有modelType是新增，没有就是修改
			if (option.modelType) {
				this.contractInfo.modelType = option.modelType
			} else {
				this.operateType = option.type;
				eventChannel.on('contractInfo', function(data) {
					uni.setNavigationBarTitle({
						title: '修改合同-' + data.data.contractCode
					});
					that.contractInfo = data.data;
					that.disabledEdit = true;
				})
				that.contractInfo.materials.forEach((m)=>{
				        m.materialId = m.id
				})
			}
		},
		async onReady() {
			this.chinaMap.forEach((item) => {
				this.provinceList.push({
					label: item.name,
					value: item.code
				})
			})
			this.auditorList.forEach((item) => {
				this.auditList.push({
					label: item.realname,
					value: item.id
				})
			})
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/common/css/quotation-add.scss';
</style>
