import Vue from 'vue'
import Vuex from 'vuex'
import stocks from './modules/stocks'
import portfolio from './modules/portfolio'
import signin from './modules/usersigning'
import portFolioAxios from '../axios-portfolio-auth'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    saveCurrentPortFolios ({ commit, dispatch, getters }) {
      const userId = getters.store.userId
      const portFolioStocks = getters.stockPortfolio
      if (!portFolioStocks.length) {
        return
      }
      const fundsAvailable = getters.funds
      const now = new Date()

      var dataToInsert = {
        [userId]: {
          stocks: portFolioStocks,
          funds: fundsAvailable,
          purchasedDate: now
        }
      }
      portFolioAxios.get('/portfolio.json').then(res => {
        dispatch('insertPortFolioDetails', dataToInsert)
      }).catch(error => console.log(error))
    },
    insertPortFolioDetails ({ commit }, payload) {
      portFolioAxios.patch('/portfolio.json', payload).then().catch(error => console.log(error))
    },
    getPurchasedStocks ({ commit, getters }, userId) {
      portFolioAxios.get('/portfolio.json').then(res => {
        if (!res.data) {
          portfolio.state.funds = 100000
        } else {
          for (var x in res.data) {
            // eslint-disable-next-line eqeqeq
            if (x.toString().trim() === userId.toString().trim()) {
              portfolio.state.stocks = []
              portfolio.state.funds = 0
              portfolio.state.stocks.push(...res.data[x].stocks)
              portfolio.state.funds = res.data[x].funds
              break
            } else {
              portfolio.state.stocks = []
              break
            }
          }
        }
      }).catch(error => console.log(error))
    }
  },
  modules: {
    stocks,
    portfolio,
    signin
  }
})
