<template>
  <div class="login-container">
    <el-form  ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" size="small">
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          prefix-icon="el-icon-user"
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="Password"
          name="password"
          type="text"
          tabindex="1"
          autocomplete="on"
          prefix-icon="el-icon-lock"
          clearable
          show-password
        />
      </el-form-item>
      <el-form-item prop="captcha" class="validacode">
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="验证码"
          name="captcha"
          type="text"
          tabindex="1"
          autocomplete="on"
          prefix-icon="el-icon-edit-outline"
          clearable
        />
        <el-image :src="captchaImg" class="img" @click="refreshCaptchaImg()">
          <div slot="placeholder">
            加载中<span>...</span>
          </div>
        </el-image>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" style="width:100%;margin-bottom:30px;" type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCaptchaImg } from '@/api/user'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        captchaKey: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      loading: false,
      redirect: undefined,
      captchaImg: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted () {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    }
    if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.refreshCaptchaImg()
  },
  methods: {
    async refreshCaptchaImg () {
      getCaptchaImg().then(response => {
        this.captchaImg = response.object.image
        this.loginForm.captchaKey = response.object.key
      }).catch(() => {})
    },
    handleLogin () {
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.refreshCaptchaImg()
      })
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
<style lang="scss" scoped>
  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .validacode {
      .el-input {
        width: 380px;
        margin-right: 10px;
      }
      .img {
        display: inline-block;
        vertical-align: middle;
        width: 130px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
</style>
