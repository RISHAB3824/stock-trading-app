/* eslint-disable no-unused-vars */
import toast from '../../toastMessage'

const state = {
  funds: 100000,
  stocks: []
}

const mutations = {
  'BUY_STOCK' (state, {
    stockId,
    quantity,
    stockPrice
  }) {
    var costPrice = stockPrice * quantity
    if (costPrice > state.funds || state.funds <= 0) {
      toast('Insufficient Funds..', {
        position: 'bottom-center',
        type: 'error',
        duration: 2000,
        singleton: true
      })
      return
    }

    const record = state.stocks.find(element => element.id === stockId)
    if (record) {
      record.quantity = Number(record.quantity) + Number(quantity)
    } else {
      state.stocks.push({
        id: stockId,
        quantity: quantity
      })
    }

    state.funds -= stockPrice * quantity
    toast('Stocks are bought successfully', {
      position: 'bottom-center',
      type: 'info',
      duration: 2000,
      singleton: true
    })
  },
  'SELL_STOCK' (state, {
    stockId,
    quantity,
    stockPrice
  }) {
    const record = state.stocks.find(element => element.id === stockId)

    if (Number(quantity) > Number(record.quantity)) {
      toast('Trying to sell more quantity than available', {
        position: 'bottom-center',
        type: 'error',
        duration: 2000,
        singleton: true
      })
      return
    } else if (record.quantity > quantity) {
      record.quantity -= quantity
    } else {
      state.stocks.splice(state.stocks.indexOf(record), 1)
    }
    toast('Stock unit sold successfully', {
      position: 'bottom-center',
      type: 'info',
      duration: 2000,
      singleton: true
    })
    state.funds = Number(state.funds) + Number(stockPrice * quantity)
  }
}

const actions = {
  sellStock ({
    commit
  }, order) {
    commit('SELL_STOCK', order)
  }
}

const getters = {
  stockPortfolio (state, getters) {
    return state.stocks.map(stock => {
      const record = getters.stocks.find(element => element.id === stock.id)
      return {
        id: stock.id,
        quantity: stock.quantity,
        name: record.name,
        price: record.price
      }
    })
  },
  funds (state) {
    return state.funds
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
