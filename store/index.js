import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login.js";
import commonInfo from "./modules/commonInfo.js"
import tabBar from "./modules/tabBar.js"

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		login,
		commonInfo,
		tabBar
	}
})