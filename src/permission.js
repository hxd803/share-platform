import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import { getToken, removeToken } from '@/utils/auth'
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      const hasMenus = store.getters.menus && store.getters.menus.length > 0
      if (hasRoles && hasMenus) {
        next()
      } else {
        try {
          const { menus } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await removeToken()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
