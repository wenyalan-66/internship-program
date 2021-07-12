import {getBusinessList} from '../../common/api/getData.js';

export default {
	namespaced: true,
	state: {
		isLogin: false
	},
	mutations: {
		setLoginState(state, data) {
			state.isLogin = data
		}
	},
	actions: {
		setLoginState(context, Boolean) {
			context.commit('setLoginState', Boolean)
		},
	}
}
