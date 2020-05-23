import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Portfolio from '../components/portfolio/Portfolio.vue'
import Stocks from '../components/stocks/Stocks.vue'
import Login from '../components/signin/Login.vue'
import Register from '../components/signup/Register.vue'
import StockLanding from '../components/StocksLanding.vue'
import LandingPageHeader from '../components/LandingPageHeader.vue'
import Header from '../components/StockPageHeader.vue'
import store from '../store/index'
import errorPage from '../components/404.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/signin',
  name: 'Login',
  components: {
    default: Login,
    'Header-Top': LandingPageHeader
  }
},
{
  path: '/signup',
  name: 'Register',
  components: {
    default: Register,
    'Header-Top': LandingPageHeader
  }
},
{
  path: '/stocklanding',
  name: 'StockLanding',
  components: {
    default: StockLanding,
    'Header-Top': Header
  },
  beforeEnter (to, from, next) {
    setTimeout(() => {
      if (store.getters.isAuthenticated) {
        next()
      } else {
        next('/signin')
      }
    }, 1)
  },
  children: [{
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio
  },
  {
    path: '/stocks',
    name: 'Stocks',
    component: Stocks
  }
  ]

},
{
  path: '*',
  component: errorPage,
  beforeEnter (to, from, next) {
    if (window.localStorage.getItem('token')) {
      next('/home')
    } else if (window.location.pathname === '/') {
      next('/signin')
    } else {
      next()
    }
  }
}
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
