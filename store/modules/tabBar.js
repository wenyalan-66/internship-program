import tabBar from '../../common/js/tabBar.js';
let type = '';
	
export default {
	namespaced: true,

	state : {
		list: []
	},
	mutations: {
		getTabList(state, data) {
			let userRole = uni.getStorageSync('userInfo').roleCode
			switch (userRole + '') {
				case '0':
					type = 'superAdminMenu';
					break;
				case '1':
				case '3':
					type = 'adminMenu';
					break;
				case '2':
					type = 'commonMenu';
					break;
				default:
					break;
			}
			state.list = tabBar[type]
		},
	},
	actions: {
		getTabbar(context, data) {
			context.commit('getTabList', data)
		}
	}
}