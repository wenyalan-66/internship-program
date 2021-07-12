const commonMenu = [{
	iconPath: "rmb-circle",
	selectedIconPath: "rmb-circle-fill",
	text: '我的报价',
	pagePath:'/pages/quotation/quotation',
	customIcon: false,
}, {
	iconPath: "file-text",
	selectedIconPath: "file-text-fill",
	text: '我的合同',
	customIcon: false,
	pagePath: "/pages/contract/contract"
}, {
	iconPath: "account",
	selectedIconPath: "account-fill",
	text: '用户信息',
	customIcon: false,
	pagePath: "/pages/userCenter/user-center"
}]

const adminMenu = [{
	iconPath: "rmb-circle",
	selectedIconPath: "rmb-circle-fill",
	text: '待审核报价',
	pagePath:'/pages/quotation/quotation',
	customIcon: false,
}, {
	iconPath: "file-text",
	selectedIconPath: "file-text-fill",
	text: '待审核合同',
	customIcon: false,
	pagePath: "/pages/contract/contract"
}, {
	iconPath: "account",
	selectedIconPath: "account-fill",
	text: '用户信息',
	customIcon: false,
	pagePath: "/pages/userCenter/user-center"
}]

const superAdminMenu = [{
	iconPath: "rmb-circle",
	selectedIconPath: "rmb-circle-fill",
	text: '所有报价',
	pagePath:'/pages/quotation/quotation',
	customIcon: false,
}, {
	iconPath: "file-text",
	selectedIconPath: "file-text-fill",
	text: '所有合同',
	customIcon: false,
	pagePath: "/pages/contract/contract"
}, {
	iconPath: "man-add",
	selectedIconPath: "man-add-fill",
	text: '用户管理',
	customIcon: false,
	pagePath: "/pages/userManage/user-manage"
}, {
	iconPath: "account",
	selectedIconPath: "account-fill",
	text: '用户信息',
	customIcon: false,
	pagePath: "/pages/userCenter/user-center"
}]


export default {
	commonMenu, adminMenu, superAdminMenu
}