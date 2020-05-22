import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

Vue.filter('currency', value => {
  return 'Rs ' + value.toLocaleString()
})

axios.defaults.baseURL = 'https://stock-trader-backend-6ba77.firebaseio.com/'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
