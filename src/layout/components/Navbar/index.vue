<template>
  <div class="navbar-container">
    <Hamburger :is-active="sidebar.opened" class="hamburger-container" @toggle-collapse="toggleCollapse"></Hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <el-dropdown class="user-container" trigger="click" size="medium" >
        <span class="el-dropdown-link">
          <i class="el-icon-user"></i>
          <el-link style="margin-left: 8px; margin-top: -5px;">{{ currentUserName }}</el-link>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="handleEditPassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :visible.sync="passwordEditDialogVisible" title="修改密码" @close="handleEditPasswordCancel">
      <el-form ref="updatePasswordFrom" :model="updatePasswordFrom" label-width="100px" label-position="left">
        <el-form-item label="原密码" required prop="originalPassword">
          <el-input v-model="updatePasswordFrom.originalPassword" show-password clearable placeholder="原密码" />
        </el-form-item>
        <el-form-item label="新密码" required prop="newPassword">
          <el-input v-model="updatePasswordFrom.newPassword" show-password clearable placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" required prop="confirmNewPassword">
          <el-input v-model="updatePasswordFrom.confirmNewPassword" show-password clearable placeholder="确认新密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmPassword">保存</el-button>
        <el-button @click="handleEditPasswordCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'
import { mapState } from 'vuex'
import Hamburger from './Hamburger'
import { updatePassword } from '@/api/user'

export default {
  name: 'Navbar',
  components: { Hamburger, Breadcrumb },
  data () {
    return {
      updatePasswordFrom: {
        originalPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      passwordEditDialogVisible: false
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      currentUserName: state => state.user.name
    })
  },
  methods: {
    toggleCollapse () {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleEditPassword () {
      this.passwordEditDialogVisible = true
    },
    handleEditPasswordCancel () {
      this.passwordEditDialogVisible = false
      this.$refs.updatePasswordFrom.resetFields()
    },
    async confirmPassword () {
      updatePassword(this.updatePasswordFrom).then(response => {
        this.passwordEditDialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(err => { console.error(err) })
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar-container{
    height: 50px !important;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu{
      float: right;
      height: 100%;
      line-height: 50px;

      .user-container {
        margin-right: 30px;
        height: 50px;
      }
    }

  }
</style>
