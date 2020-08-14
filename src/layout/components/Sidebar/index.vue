<template>
    <div width="210px" class="sidebar-container">
      <logo :collapse="isCollapse"/>
      <el-scrollbar class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          background-color= "#304156"
          text-color="#bfcbd9"
          :unique-opened="false"
          active-text-color="#409EFF"
          mode="vertical"
          :collapse="isCollapse"
        >
          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </el-scrollbar>
    </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import { mapState } from 'vuex'

export default {
  components: { Logo, SidebarItem },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      permission_routes: state => state.permission.routes
    }),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleCollapse () {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidebar-container {
    transition: width 0.28s;
    width: 210px !important;
    background-color: #304156;
    height: 100%;
    overflow: hidden;

    // reset element-ui css
    .horizontal-collapse-transition {
      transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }

    .el-scrollbar__bar.is-vertical {
      right: 0px;
    }

    .el-scrollbar {
      height: calc(100% - 50px);
    }

    /deep/ .is-horizontal {
      display: none;
    }

    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    a {
      display: inline-block;
      width: 100%;
      overflow: hidden;
    }

    .el-menu {
      border: none;
      height: 100%;
      width: 100% !important;
    }

    .is-active>.el-submenu__title {
      color: #f4f4f5 !important;
    }

    .el-menu--collapse .el-menu .el-submenu {
      min-width: 210px !important;
    }
  }
</style>
