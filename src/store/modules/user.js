import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  accessToken: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menus: []
}

const mutations = {
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login ({ commit, dispatch }, userInfo) {
    const { username, password, captchaKey, captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, captcha: captcha, captchaKey: captchaKey }).then(response => {
        const data = response.object
        commit('SET_ACCESS_TOKEN', data.accessToken)
        commit('SET_NAME', data.realName)
        setToken(data.accessToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response.object
        commit('SET_NAME', data.realName)
        commit('SET_ROLES', data.roleIds)
        commit('SET_MENUS', data.menus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_ACCESS_TOKEN', null)
        commit('SET_ROLES', [])
        commit('SET_MENUS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetLoginStatus ({ commit }) {
    commit('SET_ACCESS_TOKEN', null)
    commit('SET_ROLES', [])
    commit('SET_MENUS', [])
    removeToken()
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
