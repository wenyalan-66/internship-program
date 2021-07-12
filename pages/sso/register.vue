<template>
	<view class="register-form">
		<u-form :model="form" ref="registerForm" :label-width="160">
			<u-form-item label="用户名" prop="username">
				<u-input v-model="form.username"></u-input>
			</u-form-item>
			<u-form-item label="邮箱" prop="email">
				<u-input v-model="form.email"></u-input>
			</u-form-item>
			<u-form-item label="手机号" prop="phone">
				<u-input v-model="form.phone"></u-input>
			</u-form-item>
			<u-form-item label="真实姓名" prop="realname">
				<u-input v-model="form.realname"></u-input>
			</u-form-item>
			<u-form-item label="所属公司" prop="company">
				<view class="select-item" v-if="form.company" @tap="showCompany">
					<view class="text">{{form.companyName}}</view>
					<u-icon name="arrow-down" class="selectArrow epiroc-icon"></u-icon>
				</view>
				<view class="select-item empty" v-else @tap="companyShow=true">请选择公司<u-icon name="arrow-down"
						class="selectArrow epiroc-icon"></u-icon>
				</view>
			</u-form-item>
			<u-form-item label="密码" prop="tempPasswd">
				<u-input v-model="tempPasswd" type="password" :password-icon="true" />
			</u-form-item>
			<u-form-item label="确认密码" prop="tempPasswdCheck">
				<u-input v-model="tempPasswdCheck" type="password" :password-icon="true" />
			</u-form-item>
		</u-form>
		<button class="register-btn" form-type="submit" @tap="register">注册</button>
		<u-select v-model="companyShow" :list="companyList" @confirm="selectCompany"></u-select>
	</view>
</template>

<script>
	import {
		userRegister
	} from '../../common/api/getData.js';
	export default {
		data() {
			const passwordCheck = (rule, value, callback) => {
				if (this.tempPasswd === "") {
					return callback(new Error("密码不能为空"));
				}
				return callback();
			};
			const passwordConfirm = (rule, value, callback) => {
				this.passwdValid = false;
				if (this.tempPasswdCheck === "") {
					return callback(new Error("密码不能为空"));
				} else if (this.tempPasswd !== this.tempPasswdCheck) {
					return callback(new Error("密码不一致"));
				}
				this.passwdValid = true;
				return callback();
			};
			return {
				tapFlag: false,
				tempPasswd: '',
				tempPasswdCheck: '',
				companyShow: false,
				companyList: [
					{
						label: '安百拓贸易有限公司',
						value: '0'
					},
					{
						label: '安百拓（沈阳）贸易有限公司',
						value: '1'
					}
				],
				form: {
					username: '',
					email: '',
					phone: '',
					realname: '',
					company: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur',
						type: 'number'
					}],
					realname: [{
						required: true,
						message: '请输入真实姓名',
						trigger: 'blur'
					}],
					company: [{
						required: true,
						message: '请选择公司',
						trigger: 'blur'
					}],
					tempPasswd: [{
						required: true,
						message: "密码不能为空",
						trigger: "blur",
						validator: passwordCheck,
					}, ],
					tempPasswdCheck: [{
						required: true,
						trigger: "blur",
						validator: passwordConfirm
					}, ]
				}
			}
		},
		methods: {
			showCompany() {
				this.companyShow = true;
			},
			selectCompany(e) {
				this.form.company = e[0].value;
				this.form.companyName = e[0].label;
			},
			register() {
				this.$refs.registerForm.validate(async (valid)=>{
					if(valid) {
						if (this.tapFlag) return;
						this.tapFlag = true;
						const regiRes = await userRegister(this.form)
						if (!regiRes.success) {
							this.tapFlag = false;
							uni.showToast({
								title: regiRes.message,
								icon: "none",
								duration: 2000
							})
						}
						uni.showToast({
							title: '注册信息已提交，审核时间预计1-2个工作日，请耐心等待！',
							icon: "none",
							duration: 2000,
							complete: () => {
								setTimeout(function() {
									uni.navigateBack()
								}, 2000);
							}
						})
					}
				})
			}
		},
		onReady() {
			this.$refs.registerForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss">
	.register-form {
		margin: 40rpx;

		.register-btn {
			width: 70%;
			background-color: #ffc72c;
			border: none;
			margin-top: 120rpx;
			color: white;
		}

		.register-btn:hover {
			background-color: rgba($color: #ffc72c, $alpha: 0.6);
		}
		
		.select-item {
			height: 70rpx;
			line-height: 70rpx;
			width: 100%;
			
			.text {
				overflow: hidden;
				white-space: nowrap;
				width: 80%;
				float: left;
			}
		
			.selectArrow {
				float: right;
				margin-top: 20rpx;
			}
			
			.epiroc-icon {
				color: #ffc72c;
			}
		}
		
		.empty {
			color: #c2c2c2;
		}
	}

	@media only screen and (min-width: 428px) {
		.register-form {
			font-size: 14px;

			.u-form-item,
			.uni-input-input,
			.uni-input-placeholder {
				font-size: 20px;
			}
		}
	}
</style>
