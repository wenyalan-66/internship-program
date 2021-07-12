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
					{{quotationInfo.custom.customerCode?(quotationInfo.custom.customerCode +'/'+quotationInfo.custom.customer):''}}
				</view>
			</view>
			<view class="quota-flex">
				<view class="flex-left">
					<view class="input-item">
						<u-input v-model="quotationInfo.custom.contact" placeholder="请输入客户联系人" />
					</view>
				</view>
				<view class="flex-ghost"></view>
				<view class="flex-right">
					<view class="input-item">
						<u-input v-model="quotationInfo.custom.linkPhone" placeholder="请输入联系人电话" />
					</view>
				</view>
			</view>
		</view>
		<view class="quota-item">
			<view class="sectionTitle">商品（物料）信息</view>
			<view v-for='(i,index) in quotationInfo.materials' :key="index" class="material-item">
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
							<u-input :disabled="quotationInfo.modelType==='0'||i.needFee==='1'" v-model="i.fee"
								@blur="value=>feeChange(i, index, value)" type="number" />
						</view>
					</view>
				</view>
				<view class="quota-flex">
					<u-input type="textarea" border v-model="i.remarks" placeholder="请输入备注"></u-input>
				</view>
			</view>
			<button class="material-btn" @tap="addMaterial">新增商品</button>
		</view>
		<view class="quota-item" style="margin-top: 120rpx;">
			<view class="sectionTitle">发货信息</view>
			<u-radio-group v-model="quotationInfo.deliveryInfo.hasDelivery" @change="value => deliveryChange(value)"
				style="margin-left: 20rpx;" active-color="#ffc72c">
				<u-radio v-for="(item, index) in deliveryList" :key="index" :name="item.value" :disabled="item.disabled"
					label-size="24">
					{{item.name}}
				</u-radio>
			</u-radio-group>
			<view class="quota-flex" v-if="quotationInfo.deliveryInfo.hasDelivery==='0'">
				<view class="flex-left">
					<view class="input-item">
						<u-input v-model="quotationInfo.deliveryInfo.contact" placeholder="请输入发货联系人" />
					</view>
				</view>
				<view class="flex-ghost"></view>
				<view class="flex-right">
					<view class="input-item">
						<u-input v-model="quotationInfo.deliveryInfo.phone" placeholder="请输入联系人电话" type="number" />
					</view>
				</view>
			</view>
			<view class="quota-flex" v-if="quotationInfo.deliveryInfo.hasDelivery==='0'">
				<view style="display: flex;flex: 1; padding-right: 20rpx;">
					<view class="select-item" v-if="quotationInfo.deliveryInfo.province" @tap="showProvince()">
						<view class="text">{{quotationInfo.deliveryInfo.provinceName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showProvince()">请选择省份<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
				<view style="display: flex;flex: 1;">
					<view class="select-item" v-if="quotationInfo.deliveryInfo.urban" @tap="showCity()">
						<view class="text">{{quotationInfo.deliveryInfo.urbanName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showCity()">请选择城市<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
			</view>
			<view class="quota-flex" v-if="quotationInfo.deliveryInfo.hasDelivery==='0'">
				<view style="display: flex;flex: 1; padding-right: 20rpx;">
					<view class="select-item" v-if="quotationInfo.deliveryInfo.region" @tap="showDistriction()">
						<view class="text">{{quotationInfo.deliveryInfo.regionName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showDistriction()">请选择地区<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
				<view style="display: flex;flex: 1;">
					<view class="select-item" v-if="quotationInfo.deliveryInfo.street" @tap="showStreet()">
						<view class="text">{{quotationInfo.deliveryInfo.streetName}}</view>
						<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
					</view>
					<view class="select-item empty" v-else @tap="showStreet()">请选择街道<u-icon name="arrow-down"
							class="selectArrow epiroc-icon"></u-icon>
					</view>
				</view>
			</view>
			<view class="input-item" style="margin-top: 20rpx;" v-if="quotationInfo.deliveryInfo.hasDelivery==='0'">
				<u-input v-model="quotationInfo.deliveryInfo.address" placeholder="请输入详细发货地址" />
			</view>
		</view>
		<view class="quota-item">
			<view class="sectionTitle">发货方式</view>
			<u-radio-group v-model="quotationInfo.deliveryInfo.deliveryType" style="margin-left: 20rpx;"
				active-color="#ffc72c">
				<u-radio v-for="(item, index) in deliveryTypeList" :key="index" :name="item.value"
					:disabled="item.disabled" label-size="24">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>
		<view class="quota-item">
			<view class="sectionTitle">有效期</view>
			<u-radio-group v-model="quotationInfo.expireType" style="margin-left: 20rpx;" active-color="#ffc72c">
				<u-radio v-for="(item, index) in expireList" :key="index" :name="item.value" :disabled="item.disabled"
					label-size="24">
					{{item.name}}
				</u-radio>
			</u-radio-group>
			<view v-if="quotationInfo.expireType==='2'" class="expired-input">
				<u-input class="input-item" v-model="customDays" placeholder="请输入天数"></u-input>
				<view class="suffix">天</view>
			</view>
		</view>
		<view class="quota-item" v-if="creditType==='non-credit'">
			<view class="sectionTitle">预付款比例</view>
			<view class="expired-input">
				<u-input class="input-item" :value="prePercent" @blur="checkSpecialPrepercent"></u-input>
				<view class="suffix">%</view>
			</view>
		</view>
		<view class="quota-item" v-if="quotationInfo.specialInfo.specialApply==='1'">
			<view class="sectionTitle">审核人</view>
			<u-input class="input-item" :disabled="true" placeholder="请选择审核人" :value="auditByName"
				@tap="auditShow=true"></u-input>
		</view>
		<view class="quota-item">
			<view class="sectionTitle">询价单号</view>
			<u-input class="input-item" placeholder="请输入询价单号" v-model="quotationInfo.purchaseNumber"></u-input>
		</view>
		<view class="quota-item">
			<view class="sectionTitle">报价单备注</view>
			<u-input placeholder="请输入备注" border type="textarea" v-model="quotationInfo.remarks"></u-input>
		</view>
		<view class="bottom-block">
			<button class="preview-btn" @tap="toPreview">生成报价单</button>
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
	import {
		addQuotation
	} from '../../common/api/getData.js'
	import STATIC from '../../common/js/static.js'
	import Util from "../../common/js/util.js";
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
				provinceList: [],
				cityList: [],
				districtionList: [],
				streetList: [],
				auditList: [],
				customDays: null, //自定义有效期
				quotationInfo: {
					modelType: '', //报价单模板 0：南京     1：沈阳
					auditBy: '',
					purchaseNumber: '',
					remarks: '',
					gmFlag: '0', //是否需要GM审批 0不需要 1需要
					status: '0', //报价单状态（0:completed; 1: pending, 2: refused）特价申请->pending  正常报价 ->completed
					expireType: '0', //有效期 0:一个月内有效   1:当月有效 2:自定义
					//客户信息
					custom: {
						customer: '',
						contact: '',
						linkPhone: ''
					},
					//物料商品列表信息
					materials: [{
						materialName: "",
						salesPriceIncludingTax: "",
						agentIncludingTax: 0,
						quantity: null,
						unitPrice: "",
						totalValue: "",
						unit: 'PC',
						discount: 1,
						needFee: '1',
						fee: 0,
						remarks: ''
					}],
					deliveryInfo: {
						contact: '',
						phone: '',
						address: '',
						provinceName: '',
						province: '',
						urbanName: '',
						urban: '',
						region: '',
						regionName: '',
						streetName: '',
						street: '',
						hasDelivery: '0', //发货信息是否确认 0：已确认  1：待确认
						deliveryType: '0' //发货方式 0：分批发货 1：整单发货
					},
					specialInfo: {
						specialApply: '0',
						prePercent: 0
					}
				},
				deliveryList: [{
					name: '已有发货地址',
					value: '0',
					disabled: false
				}, {
					name: '待客户确认',
					value: '1',
					disabled: false
				}],
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
				expireList: [{
					name: '一个月内有效',
					value: '0',
					disabled: false
				}, {
					name: '当月有效',
					value: '1',
					disabled: false
				}, {
					name: '其他',
					value: '2',
					disabled: false
				}]
			}
		},
		computed: {
			...mapState('commonInfo', ['customerInfo', 'materialInfo', 'chinaMap', 'auditorList']),
			prePercent() {
				return parseInt(this.quotationInfo.specialInfo.prePercent * 100)
			}
		},
		methods: {
			searchCustomer() {
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
			searchMaterial(i) {
				if (!this.quotationInfo.custom.customerCode) {
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
			customConfirm(e) {
				let selection = e[0].extra;
				selection.linkPhone = e[0].extra.phone;
				this.quotationInfo.custom = selection;
				this.quotationInfo.materials = [{
					materialName: "",
					salesPriceIncludingTax: "",
					agentIncludingTax: 0,
					quantity: null,
					unitPrice: "",
					totalValue: "",
					unit: 'PC',
					discount: 1,
					fee: 0,
					needFee: '1',
					remarks: ''
				}]
				let paymentTerm = selection.paymentTerm;
				this.checkCredit(paymentTerm);
				this.quotationInfo.specialInfo.prePercent = 0;
				this.originPrepercent = 0;
				switch (paymentTerm) {
					case 'Y012':
						this.quotationInfo.specialInfo.prePercent = 0.3;
						this.originPrepercent = 0.3
						break;
					case 'Y000':
						this.quotationInfo.specialInfo.prePercent = 1;
						this.originPrepercent = 1
						break;
					case 'YD21':
					case 'YD30':
					case 'YD45':
					case 'YD60':
					case 'YD90':
						break;
					default:
						this.quotationInfo.specialInfo.prePercent = 0;
						this.originPrepercent = 0;
						break;
				}
			},
			recalcMaterialInfo(index) {
				//当商品id 数量 进行此物料信息的计算
				let calcMaterial = this.quotationInfo.materials[index];
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
					this.quotationInfo.materials = Object.assign([], this.quotationInfo.materials)
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
				this.quotationInfo.materials[index].discount = parseFloat(value / this.quotationInfo.materials[index]
					.agentIncludingTax);
				this.checkSpecialDiscount();
				this.recalcMaterialInfo(index)
			},
			feeChange(i, index, value) {
				this.quotationInfo.materials[index].fee = parseFloat(value);
			},
			deliveryChange(value) {
				if (value + '' === '1') {
					this.quotationInfo.deliveryInfo.address = '等待客户确认';
					this.quotationInfo.deliveryInfo.provinceName = "";
					this.quotationInfo.deliveryInfo.urbanName = "";
					this.quotationInfo.deliveryInfo.regionName = "";
					this.quotationInfo.deliveryInfo.streetName = "";
				}
			},
			showMaterial(index) {
				this.materialShow = true;
				this.materialIndex = index
			},
			materialConfirm(e) {
				this.quotationInfo.materials[this.materialIndex] = Object.assign({}, e[0].extra);
				this.quotationInfo.materials[this.materialIndex].materialId = this.quotationInfo.materials[this
					.materialIndex].id
				this.quotationInfo.materials[this.materialIndex].materialName = this.quotationInfo.materials[this
					.materialIndex].nameCn
				this.quotationInfo.materials[this.materialIndex].fee = 0;
				this.quotationInfo.materials[this.materialIndex].discount = 1;
				this.quotationInfo.materials[this.materialIndex].needFee = '1';
				this.quotationInfo.materials[this.materialIndex].unit = 'PC';
				this.quotationInfo.materials[this.materialIndex].remarks = '';
				let customerType = this.quotationInfo.custom.customerType,
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
				this.quotationInfo.materials[this.materialIndex].agentIncludingTax = agentIncludingTax;
				this.recalcMaterialInfo(this.materialIndex);
			},
			addMaterial() {
				this.quotationInfo.materials.push({
					materialName: "",
					salesPriceIncludingTax: "",
					agentIncludingTax: 0,
					quantity: 0,
					unitPrice: "",
					totalValue: "",
					unit: 'PC',
					discount: 1,
					fee: 0,
					needFee: '1',
					remarks: ''
				})
			},
			delMaterial(index) {
				if (this.quotationInfo.materials.length === 1) return;
				this.quotationInfo.materials.splice(index, 1)
			},
			showProvince() {
				this.provinceShow = true;
			},
			async provinceConfirm(e) {
				this.cityList = [];
				let provinceInfo = e[0];
				this.quotationInfo.deliveryInfo.province = provinceInfo.value;
				this.quotationInfo.deliveryInfo.provinceName = provinceInfo.label;
				this.quotationInfo.deliveryInfo.urban = '';
				this.quotationInfo.deliveryInfo.region = '';
				this.quotationInfo.deliveryInfo.street = '';
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
				this.quotationInfo.deliveryInfo.region = '';
				this.quotationInfo.deliveryInfo.street = '';
				if (!e) return;
				let cityInfo = e[0];
				this.quotationInfo.deliveryInfo.urbanName = cityInfo.label;
				this.quotationInfo.deliveryInfo.urban = cityInfo.value;
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
				this.quotationInfo.deliveryInfo.street = '';
				if (!e) return;
				let districtionInfo = e[0];
				this.quotationInfo.deliveryInfo.region = districtionInfo.value;
				this.quotationInfo.deliveryInfo.regionName = districtionInfo.label;
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
				this.quotationInfo.deliveryInfo.streetName = streetInfo.label;
				this.quotationInfo.deliveryInfo.street = streetInfo.value;
			},

			showCity() {
				this.cityShow = true;
			},
			showDistriction() {
				this.districtionShow = true;
			},
			showStreet() {
				this.streetShow = true;
			},
			checkSpecialDiscount() {
				this.discountFlag = false;
				this.quotationInfo.gmFlag = '0';
				this.quotationInfo.materials.forEach((m) => {
					if (m.agentIncludingTax * m.discount < m.floorPrice) {
						this.discountFlag = true
					}
					if (m.agentIncludingTax * m.discount < m.floorPrice * 0.98) {
						this.quotationInfo.gmFlag = '1'
					}
				})
				this.checkSpecialAll();
			},
			checkSpecialPrepercent(e) {
				this.prePercentFlag = false;
				this.quotationInfo.specialInfo.prePercent = e / 100;
				if (this.originPrepercent !== parseFloat(e / 100)) {
					this.prePercentFlag = true;
				}
				if (e < 20) this.quotationInfo.gmFlag = '1'
				this.checkSpecialAll()
			},

			checkSpecialAll() {
				this.quotationInfo.specialInfo.specialApply = (this.discountFlag || this.prePercentFlag) ? '1' : '0'
			},

			auditConfirm(e) {
				this.quotationInfo.auditBy = e[0].value;
				this.auditByName = e[0].label
			},
			validCustomer() {
				if (!this.quotationInfo.custom.customerCode) {
					uni.showToast({
						title: '请完善客户信息！',
						icon: "none",
						duration: 2000
					});
					return false
				}
				return true
			},

			validAudit() {
				if (this.quotationInfo.specialInfo.specialApply === '1' && !this.quotationInfo.auditBy) {
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
				let materials = that.quotationInfo.materials,
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
				let auditValid = that.validAudit();
				if (!customValid || !auditValid || !materialValid) return;
				let params = Object.assign({}, {
					customerCode: that.quotationInfo.custom.customerCode,
					modelType: that.quotationInfo.modelType,
					contact: that.quotationInfo.custom.contact,
					linkPhone: that.quotationInfo.custom.linkPhone,
					deliveryInfo: that.quotationInfo.deliveryInfo,
					expireType: that.quotationInfo.expireType === '2' ? that.customDays + '' : that
						.quotationInfo.expireType,
					materials: tempMaterials,
					specialInfo: that.quotationInfo.specialInfo,
					status: that.quotationInfo.specialInfo.specialApply,
					auditBy: that.quotationInfo.auditBy,
					purchaseNumber: that.quotationInfo.purchaseNumber,
					remarks: that.quotationInfo.remarks,
					fileStatus: that.quotationInfo.fileStatus || '0',
					gmFlag: that.quotationInfo.gmFlag,
					reason: that.quotationInfo.reason
				})
				if (that.operateType === 'edit') {
					params.quotaCode = that.quotationInfo.quotaCode;
					params.id = that.quotationInfo.id;
				}
				const addRes = await addQuotation(params);
				if (!addRes.success) {
					uni.showToast({
						title: '新增报价失败！',
						icon: "none",
						duration: 2000
					});
					return
				}
				if (that.quotationInfo.specialInfo.specialApply === "1") {
					uni.showToast({
						title: '已提交审核，请耐心等待！',
						icon: "none",
						duration: 2000,
						complete: function() {
							uni.navigateTo({
								url: '/pages/quotation/quotation',
							})
						}
					});
					return
				}
				that.quotationInfo.quotaCode = addRes.result.quotaCode;
				that.quotationInfo.id = addRes.result.id;
				that.quotationInfo.currentDate = Util.dateFormat(new Date(), 'yyyy-MM-dd');
				that.quotationInfo.customer = that.quotationInfo.custom;
				let expiredDay = null
				if (that.quotationInfo.expireType === "1") {
					//当月生效
					expiredDay = Util.lastDayOfMonth(that.quotationInfo.currentDate);
				} else if (that.quotationInfo.expireType === "0") {
					//一个月内有效
					expiredDay = Util.dayOfNextMonth(that.quotationInfo.currentDate);
				} else {
					expiredDay = Util.plusDays(new Date(that.quotationInfo.currentDate), parseInt(that.quotationInfo.expireType))
				};
				that.quotationInfo.expiredDay = expiredDay;
				//报价总计行
				let totalInTax = 0,
					freightInTax = 0,
					discountInTax = 0,
					totalPriceInTax = 0;
				that.quotationInfo.materials.forEach(element => {
					element.deliveryDate = ''
					if (element.delivery) {
						element.deliveryDate = Util.plusDays(new Date(), element.delivery) 
					}
					element.originNumber = element.originNumber || '————';
					totalInTax += parseInt(element.quantity) * element.salesPriceIncludingTax;
					freightInTax += parseFloat(element.fee) || 0;
					totalPriceInTax += (parseFloat(element.totalValue) + parseFloat(element.fee))
				});
				discountInTax = parseFloat(totalInTax) - totalPriceInTax;
				
				that.quotationInfo.totalInTax = totalInTax;
				that.quotationInfo.freightInTax = freightInTax;
				that.quotationInfo.discountInTax = discountInTax;
				that.quotationInfo.totalPriceInTax = totalPriceInTax;
				
				//付款条件
				const paymentTerm = that.quotationInfo.custom.paymentTerm;
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
				that.quotationInfo.paymentTermText = paymentTermText;
				that.quotationInfo.userInfo = uni.getStorageSync('userInfo');
				uni.navigateTo({
					url: '/pages/quotation/preview',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('quotationData', {
							data: that.quotationInfo
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
				this.quotationInfo.modelType = option.modelType
			} else {
				this.operateType = option.type;
				eventChannel.on('quotaInfo', function(data) {
					uni.setNavigationBarTitle({
						title: '修改报价-' + data.data.quotaCode
					});
					that.quotationInfo = data.data;
					that.quotationInfo.custom = data.data.customer;
					if (that.quotationInfo.expireType !== '0' && that.quotationInfo.expireType !== '1') {
						that.customDays = that.quotationInfo.expireType;
						that.quotationInfo.expireType = '2'
					}
					that.quotationInfo.materials.forEach((m)=>{
					        m.materialId = m.id
					})
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
