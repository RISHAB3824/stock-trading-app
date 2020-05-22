import axios from '../../axios-auth'
import globalAxios from 'axios'
import router from '../../router'
import toast from '../../toastMessage'

const state = {
  idToken: null,
  userId: null,
  userName: null
}
const mutations = {
  authUser (state, userData) {
    state.idToken = userData.token
    state.userId = userData.userId
  },
  clearUserData (state) {
    state.idToken = null
    state.userId = null
    state.userName = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('expirationDate')
  },
  getUserName (state) {
    globalAxios.get('/users.json').then(res => {
      for (var x in res.data) {
        if (res.data[x].userId === state.userId) {
          localStorage.setItem('userName', res.data[x].username)
          state.userName = res.data[x].username
          break
        }
      }
    }).catch(error => console.log(error))
  }
}
const actions = {
  signup ({
    commit,
    dispatch
  }, formData) {
    axios
      .post(':signUp?key=AIzaSyB1Nxbj92EmaqB0E_DN2GDCMRbW742K8_A', {
        email: formData.email,
        password: formData.password,
        returnSecureToken: true
      })
      .then(res => {
        commit('authUser', {
          token: res.data.idToken,
          userId: res.data.localId
        })
        dispatch('storeUser', formData)
        toast('Resgristration Successfull', {
          position: 'bottom-center',
          type: 'success',
          duration: 2000,
          singleton: true
        })
        router.push('/signin')
      })
      .catch(error => {
        console.log(error)
        let message = 'Please check your details before submitting'
        if (error.response.data.error.message === 'EMAIL_EXISTS') {
          message = 'Email id already exists'
        } else if (error.response.data.error.message.includes('WEAK_PASSWORD')) {
          message = 'Password should be at least 6 characters'
        } else if (error.response.data.error.message === 'INVALID_EMAIL') {
          message = 'Email id is not valid'
        }
        toast(message, {
          position: 'bottom-center',
          type: 'error',
          duration: 2000,
          singleton: true
        })
      })
  },
  login ({
    commit,
    dispatch
  }, formData) {
    if (!formData.email || !formData.password) {
      toast('Email id or Password field cannot be empty', {
        position: 'bottom-center',
        type: 'error',
        duration: 2000,
        singleton: true
      })
      return
    }
    axios
      .post(
        ':signInWithPassword?key=AIzaSyB1Nxbj92EmaqB0E_DN2GDCMRbW742K8_A', {
          email: formData.email,
          password: formData.password,
          displayName: '123',
          returnSecureToken: true
        }
      )
      .then(res => {
        var authUser = {
          token: res.data.idToken,
          userId: res.data.localId
        }
        commit('authUser', authUser)
        commit('getUserName')
        toast('Successfully Logging in...', {
          position: 'bottom-center',
          type: 'success',
          duration: 2000,
          singleton: true
        })
        const now = new Date()
        const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
        localStorage.setItem('token', res.data.idToken)
        localStorage.setItem('userId', res.data.localId)
        localStorage.setItem('expirationDate', expirationDate)
        dispatch('tryAutoLogout', res.data.expiresIn)
        dispatch('getPurchasedStocks', res.data.localId)
        router.push('/home')
      })
      .catch(error => {
        console.log(error)
        toast('Please check your username/password', {
          position: 'bottom-center',
          type: 'error',
          duration: 2000,
          singleton: true
        })
      })
  },
  logOut ({
    commit, dispatch
  }) {
    dispatch('saveCurrentPortFolios')
    commit('clearUserData')
    router.replace('/signin')
  },
  tryAutoLogin ({
    commit, dispatch
  }) {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')
    const expDate = localStorage.getItem('expirationDate')
    const now = new Date()
    if (!token && !userId && (now >= expDate)) {
      // eslint-disable-next-line no-useless-return
      return
    }
    commit('authUser', {
      token,
      userId,
      userName
    })
    dispatch('getPurchasedStocks', userId)
  },
  tryAutoLogout ({
    commit,
    dispatch
  }, expTime) {
    setTimeout(() => {
      dispatch('logOut')
    }, expTime * 1000)
  },
  storeUser ({
    commit,
    state
  }, formData) {
    if (!state.idToken) {
      return
    }
    // formData.idToken = state.idToken
    formData.userId = state.userId
    globalAxios.post('/users.json' + '?auth=' + state.idToken, formData).then(res => {
    }).catch(error => console.log(error))
  }
}

const getters = {
  store (state) {
    return {
      idToken: state.idToken,
      userId: state.userId,
      userName: state.userName
    }
  },
  isAuthenticated (state) {
    return state.idToken !== null
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
