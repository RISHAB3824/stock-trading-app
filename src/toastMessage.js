import Toasted from 'vue-toasted'
import Vue from 'vue'

const getToastNotification = (message, toastOptions) => {
  Vue.use(Toasted, toastOptions)
  Vue.toasted.show(message, toastOptions)
}

export default getToastNotification
