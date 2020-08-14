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
  {
    path: '/workflowManage',
    component: Layout,
    redirect: '/workflowManage/workflowDategoryManage',
    name: 'workflowManage',
    meta: { title: '流程管理', icon: 's-tools', menuCode: 'WORKFLOW_MANAGE' },
    children: [
      {
        path: 'workflowDategoryManage',
        component: () => import('@/views/workflow/category/index'),
        name: 'workflowDategoryManage',
        meta: { title: '流程分类', menuCode: 'WORKFLOW_DATEGORY_MANAGE' }
      },
      {
        path: 'workflowModelManage',
        component: () => import('@/views/workflow/model/index'),
        name: 'workflowModelManage',
        meta: { title: '流程模型', menuCode: 'WORKFLOW_MODEL_MANAGE' }
      },
      {
        path: 'workflowDeploymentManage',
        component: () => import('@/views/workflow/deployment/index'),
        name: 'workflowDeploymentManage',
        meta: { title: '流程发布', menuCode: 'WORKFLOW_DEPLOYMENT_MANAGE' }
      }

    ]
  },
  {
    path: '/bpmnManage',
    component: Layout,
    redirect: '/bpmnRumen',
    meta: { menuCode: 'BPMN_RUMEN' },
    children: [
      {
        path: 'bpmnRumen',
        component: () => import('@/views/bpmn/index'),
        name: 'bpmnRumen',
        meta: { title: 'BPMN入门', menuCode: 'BPMN_RUMEN' }
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
