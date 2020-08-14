const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  loginStatus: state => state.user.loginStatus,
  accessToken: state => state.user.accessToken,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  routes: state => state.permission.routes
}
export default getters
