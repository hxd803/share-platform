<template>
  <el-container class="app-wrapper" :class="{'hideSidebar' : !this.sidebar.opened}">
    <el-aside>
      <sidebar/>
    </el-aside>
    <el-container class="main-container">
      <el-header>
        <navbar/>
        <tags-view/>
      </el-header>
      <el-main>
        <app-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AppMain from './components/AppMain'
import TagsView from './components/TagsView'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: { Sidebar, Navbar, AppMain, TagsView },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  }
}
</script>

<style lang="scss">
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;

    .el-aside {
      width: 210px !important;
      overflow-x: hidden;
    }

    .el-header {
      height: 84px !important;
      padding: 0;
    }

    .el-main {
      padding: 0;
    }
  }
</style>
