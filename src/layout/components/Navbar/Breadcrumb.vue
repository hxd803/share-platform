<template>
      <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item" :replace="false">{{item.meta.title}}</el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data: function () {
    return {
      levelList: []
    }
  },
  created () {
    this.getBreadcrumb()
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name.trim().toLocaleLowerCase() !== 'Home'.toLocaleLowerCase()) {
        matched = [{ path: '/', meta: { title: '主页' } }].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;
  }

  /deep/ .el-breadcrumb__inner,
  /deep/ .el-breadcrumb__inner a {
    font-weight: 400 !important;
  }
</style>
