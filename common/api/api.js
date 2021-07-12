export default {
	'sso': {
		'loginIn': '/rdd/sys/login',
		'logOut': '/rdd/sys/logout',
		'register': '/rdd/user/register',
		'resetPassword': "/rdd/user/resetPassword"
	},
	'customer': {
		'getCustomerList': '/rdd/businessInfo/get',
		'getAllCustomer': '/rdd/businessInfo/businessInfos'
	},
	'material': {
		'getMaterialList': '/rdd/material/get',
		'getAllMaterials': '/rdd/material/materials'
	},
	'user': {
		'getUserList': '/rdd/user/list',
		'addUserRole': '/rdd/user/addUserRole',
		'editUserRole': '/rdd/user/editUserRole',
		'getRoleList': '/rdd/user/roles',
		'getRegisteringUsers': '/rdd/user/registeringUsers'
	},
	'quotation': {
		'getQuotationList': '/rdd/quotation/get',
		'addQuotation': '/rdd/quotation/add',
		'delQuotation': '/rdd/quotation/del',
		'editQuotation': '/rdd/quotation/edit',
		'auditQuotation': '/rdd/workflow/deal',
		'updateQuotaStatus': '/rdd/quotation/editFileStatus'
	},
	'contract': {
		'getContractList': '/rdd/contract/get',
		'addContract': '/rdd/contract/add',
		'editContract': '/rdd/contract/edit',
		'delContract': '/rdd/contract/del',
		'auditContract': '/rdd/workflow/deal',
		'updateContractStatus': '/rdd/contract/editFileStatus'
	},
	'getChinaMap': '/bapi/api_region_search/v1/',
	'getQuotaFile': '/rdd/quotation/getPdf',
	'getContractFile': '/rdd/contract/getPdf'
}
