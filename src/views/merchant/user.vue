<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="search-view">
          <el-form ref="searchFrom" :model="paramsForm" :inline="true" size="mini">
            <el-form-item label="创建时间:" prop="searchTimeSlot">
              <el-date-picker
                  type="daterange"
                  v-model="searchTimeSlot"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="createTimeSlotOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="商户名称:" prop="merchantName">
              <el-input v-model="paramsForm.merchantName"/>
            </el-form-item>
            <el-form-item label="登录名:" prop="userName">
              <el-input v-model="paramsForm.userName"/>
            </el-form-item>
            <el-form-item label="当前状态:" prop="status">
              <el-select v-model="paramsForm.status">
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="禁用" value="-1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
      </div>
      <el-button type="primary" icon="el-icon-search" size="mini" class="searchBtn" @click="handleSearch()">查询</el-button>
      <el-button type="primary" icon="el-icon-refresh-left" size="mini" class="searchBtn" @click="handleSearchReset()">重置</el-button>
    </div>
    <el-button size="small" type="text" icon="el-icon-plus" style="margin-top:10px;" @click="handleAddUser">新建操作员</el-button>
    <el-table :data="userList" style="width: 100%; margin-top:10px;" border size="small">
      <el-table-column
        align="center"
        type="index">
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名">
        <template slot-scope="scope">
          {{ scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="姓名">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="手机号码">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="关联商户">
        <template>
          暂无
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag size="small" v-if="scope.row.status == -1" type="danger">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" v-if="scope.row.status == -1" icon="el-icon-video-play" @click="handleEnable(scope)">启用</el-button>
          <el-button size="small" type="text" v-if="scope.row.status == 0" icon="el-icon-video-pause" @click="handleDisable(scope)">禁用</el-button>
          <el-button size="small" type="text" icon="el-icon-refresh-left" @click="handleResetPassword(scope)">重置密码</el-button>
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
          <!-- <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="fetchList"
      @current-change="fetchList"
      :current-page.sync="paramsForm.currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size.sync="paramsForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecords">
    </el-pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '修改操作员' : '新增操作员'">
      <el-form :model="user" ref="userForm" :rules="rules" label-width="80px" label-position="left" size="small">
        <el-form-item label="用户名" required prop="userName">
          <el-input v-model="user.userName" :disabled="dialogType === 'edit'" placeholder="用户名，请使用邮箱" />
        </el-form-item>
        <el-form-item label="姓名" required prop="realName">
          <el-input v-model="user.realName" placeholder="姓名"/>
        </el-form-item>
        <el-form-item label="手机号码" required prop="phone">
          <el-input v-model="user.phone" placeholder="手机号码"/>
        </el-form-item>
        <el-form-item label="登录密码" required prop="password" v-if="dialogType === 'new'">
          <el-input v-model="user.password" clearable show-password placeholder="初始登录密码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmUser">保存</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList as fetchUserList, getUser2Edit, enableUser, disableUser, deleteUser, updateUser, createUser, resetPassword } from '@/api/merchant-user'

const defaultUser = {
  id: 0,
  userName: '',
  realName: '',
  phone: '',
  password: ''
}
export default {
  name: 'MerchantUser',
  data () {
    return {
      rules: {
        userName: [
          { required: true, message: '请输入用户名' },
          { type: 'email', message: '请输入正确的邮箱地址' }
        ],
        realName: [
          { required: true, message: '请输入姓名' }
        ],
        phone: [
          { required: true, message: '请输入手机号码' }
        ],
        password: [
          { required: true, message: '请输入初始密码' }
        ]
      },
      user: Object.assign({}, defaultUser),
      userList: [],
      dialogType: 'new',
      dialogVisible: false,
      merchantListVisible: false,
      searchTimeSlot: '',
      createTimeSlotOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.paramsForm.createTimeStart = minDate
          this.paramsForm.createTimeEnd = maxDate
        }
      },
      paramsForm: {
        currentPage: 1,
        pageSize: 10,
        userName: '',
        status: '',
        merchantName: '',
        createTimeStart: '',
        createTimeEnd: ''
      },
      totalRecords: 0
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      fetchUserList(this.paramsForm).then(response => {
        this.userList = response.object.rows
        this.totalRecords = response.object.total
      }).catch(() => {})
    },
    showMerchantList (scope) {
      this.merchantListVisible = true
    },
    handleSearch () {
      this.fetchList()
    },
    handleSearchReset () {
      this.$refs.searchFrom.resetFields()
      this.fetchList()
    },
    handleAddUser () {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      getUser2Edit({ id: scope.row.id }).then(response => {
        this.user = response.object
        this.dialogVisible = true
      }).catch(() => {})
    },
    async confirmUser () {
      const isEdit = this.dialogType === 'edit'

      let formValid = false
      console.log(this.$refs.userForm)
      this.$refs.userForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      if (isEdit) {
        updateUser(this.user).then(response => {
          this.dialogVisible = false
          this.fetchList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        this.user.password = this.$md5(this.user.password)
        createUser(this.user).then(response => {
          this.dialogVisible = false
          this.fetchList()
          this.$message({
            type: 'success',
            message: '新建成功!'
          })
        }).catch(err => { console.error(err) })
      }
    },
    handleResetPassword (scope) {
      this.$confirm('确定为该用户重置登录密码?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        resetPassword({ id: scope.row.id }).then(response => {
          this.fetchList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    },
    handleEnable (scope) {
      this.$confirm('确定启用该用户?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        enableUser({ id: scope.row.id }).then(response => {
          this.fetchList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    },
    handleDisable (scope) {
      this.$confirm('确定禁用该用户?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        disableUser({ id: scope.row.id }).then(response => {
          this.fetchList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    },
    handleDelete (scope) {
      this.$confirm('确定删除该用户?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteUser({ id: scope.row.id }).then(response => {
          this.fetchList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    }
  }
}
</script>
