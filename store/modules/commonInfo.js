import {
	getAllCustomer,
	getAllMaterials,
	getRoleList,
	getUserList
} from '../../common/api/getData.js'
export default {
	namespaced: true,
	state: {
		customerInfo: [],
		materialInfo: [],
		chinaMap: [],
		roleList: [],
		auditorList: []
	},
	mutations: {
		getCustomerInfo(state, data) {
			getAllCustomer(data).then(res => {
				if (res && res.success) {
					state.customerInfo = res.result
				}
			})
		},
		getMaterialInfo(state, data) {
			getAllMaterials(data).then(res => {
				if (res && res.success) {
					state.materialInfo = res.result
				}
			})
		},
		getChinaMap(state, data) {
			if (state.chinaMap.length) return;
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
						state.chinaMap = data.districts[0].districts
					} else {
						console.log('获取省份信息失败！')
					}
				}
			})
		},
		getRoleList(state, data) {
			getRoleList(data).then(res => {
				if (res.success) {
					state.roleList = res.result
				} else {
					console.log('获取角色信息失败！')
				}
			})
		},
		getAuditorList(state, data) {
			getUserList(data).then(res => {
				if (res.success) {
					state.auditorList = res.result.records
				} else {
					console.log('获取管理员失败！')
				}
			})
		}
	},
	actions: {
		queryCustomerInfo(context, data) {
			context.commit('getCustomerInfo', data)
		},
		queryMaterialInfo(context, data) {
			context.commit('getMaterialInfo', data)
		},
		queryChinaMap(context, data) {
			context.commit('getChinaMap', data)
		},
		queryRoleList(context, data) {
			context.commit('getRoleList', data)
		},
		queryAuditorList(context, data) {
			context.commit('getAuditorList', data)
		}
	}
}
