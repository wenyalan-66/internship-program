import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from './store';
import axios from 'axios'

Vue.prototype.$axios= axios
Vue.config.productionTip = false
Vue.use(uView);
App.mpType = 'app'
Vue.prototype.$store = store;

const app = new Vue({
    ...App,
	store
})
app.$mount()
