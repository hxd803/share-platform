import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission (menus, route) {
  if (route.meta && route.meta.menuCode) {
    return menus.some(menu => route.meta.menuCode === menu)
  } else {
    return true
  }
}

export function filterAsyncRoutes (routes, menus) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menus, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menus)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit }, menus) {
    return new Promise(resolve => {
      let accessedRoutes = []
      const menuCodes = []
      menus.forEach(menu => {
        menuCodes.push(menu.code)
      })
      accessedRoutes = filterAsyncRoutes(asyncRoutes, menuCodes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
