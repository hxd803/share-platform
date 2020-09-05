import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export const asyncRoutes = [
  {
    path: '/article',
    component: Layout,
    redirect: '/index',
    meta: { menuCode: 'ARTICLE_MANAGE' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/article/index'),
        name: 'Article',
        meta: { title: '文档管理', icon: 'document', affix: true, menuCode: 'ARTICLE_MANAGE' }
      }
    ]
  },
  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/index',
    meta: { title: '商户管理', icon: 'office-building', menuCode: 'MERCHANT_MANAGE' },
    children: [
      {
        path: 'merchant-user',
        component: () => import('@/views/merchant/user'),
        name: 'MerchantUser',
        meta: { title: '商户操作员管理', affix: true, menuCode: 'MERCHANT_USER_MANAGE' }
      },
      {
        path: 'index',
        component: () => import('@/views/merchant/index'),
        name: 'MerchantInfo',
        meta: { title: '商户信息管理', affix: true, menuCode: 'MERCHANT_INFO_MANAGE' }
      },
      {
        path: 'rate-config',
        component: () => import('@/views/merchant/rate-config'),
        name: 'MerchantRateConfig',
        meta: { title: '服务费率配置', affix: true, menuCode: 'MERCHANT_RATE_CONFIG' }
      }
    ]
  },
  // {
  //   path: '/merchant-user',
  //   component: Layout,
  //   redirect: '/index',
  //   meta: { menuCode: 'MERCHANT_USER_MANAGE' },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/merchant/user'),
  //       name: 'MerchantUser',
  //       meta: { title: 'merchant-user', icon: 'document', affix: true, menuCode: 'MERCHANT_USER_MANAGE' }
  //     }
  //   ]
  // },
  // {
  //   path: '/rate-config',
  //   component: Layout,
  //   redirect: '/index',
  //   meta: { menuCode: 'MERCHANT_RATE_CONFIG' },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/merchant/rate-config'),
  //       name: 'MerchantRateConfig',
  //       meta: { title: 'rate-config', icon: 'document', affix: true, menuCode: 'MERCHANT_RATE_CONFIG' }
  //     }
  //   ]
  // },
  {
    path: '/service-platform',
    component: Layout,
    redirect: '/index',
    meta: { menuCode: 'PLATFORM_INFO_MANAGE' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/service-platform/index'),
        name: 'ServicePlatform',
        meta: { title: '平台信息配置', icon: 'document', affix: true, menuCode: 'PLATFORM_INFO_MANAGE' }
      }
    ]
  },
  {
    path: '/systemManage',
    component: Layout,
    redirect: '/systemManage/userManage',
    name: 'SystemManage',
    meta: { title: '系统管理', icon: 's-tools', menuCode: 'SYSTEM_MANAGE' },
    children: [
      {
        path: 'organizeManage',
        component: () => import('@/views/organize/index'),
        name: 'organizeManage',
        meta: { title: '组织管理', menuCode: 'ORGANIZE_MANAGE' }
      },
      {
        path: 'userManage',
        component: () => import('@/views/user/index'),
        name: 'userManage',
        meta: { title: '用户管理', menuCode: 'USER_MANAGE' }
      },
      {
        path: 'roleManage',
        component: () => import('@/views/role/index'),
        name: 'roleManage',
        meta: { title: '角色管理', menuCode: 'ROLE_MANAGE' }
      },
      {
        path: 'menuManage',
        component: () => import('@/views/menu/index'),
        name: 'menuManage',
        meta: { title: '菜单管理', menuCode: 'MENU_MANAGE' }
      },
      {
        path: 'regionManage',
        component: () => import('@/views/region/index'),
        name: 'regionManage',
        meta: { title: '行政区划', menuCode: 'REGION_MANAGE' }
      },
      {
        path: 'dictManage',
        component: () => import('@/views/dict/index'),
        name: 'dictManage',
        meta: { title: '数据字典', menuCode: 'DICT_MANAGE' }
      }
    ]
  },
  // 404 页面要放在最后
  { path: '*', redirect: '/404', hidden: true }
]

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404')
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { menuCode: 'HOME' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Home',
        meta: { title: '主页', icon: 's-home', affix: true, menuCode: 'HOME' }
      }
    ]
  }
]

const createRouter = () => new Router({
  routes: constantRoutes
})
const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
