<template>
  <div class="app-container">
    <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddUser">新建用户</el-button>
    <el-table :data="userList" style="width: 100%; margin-top:30px;" border size="small">
      <el-table-column
        align="center"
        type="index">
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名">
        <template slot-scope="scope">
          {{ scope.row.username}}
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
        label="e-mail">
        <template slot-scope="scope">
          {{ scope.row.email }}
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
        align="center"
        label="最后修改时间">
        <template slot-scope="scope">
          {{ scope.row.lastModifyTime | parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0">正常</el-tag>
          <el-tag v-if="scope.row.status == -1" type="danger">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" v-if="scope.row.status == -1" icon="el-icon-arrow-up" @click="handleEnable(scope)">启用</el-button>
          <el-button size="small" type="text" v-if="scope.row.status == 0" icon="el-icon-arrow-down" @click="handleDisable(scope)">禁用</el-button>
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '修改用户' : '新增用户'">
      <el-form :model="user" :ref="userForm" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="用户名" required prop="username">
          <el-input v-model="user.username" :disabled="dialogType === 'edit'" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="姓名" required prop="realName">
          <el-input v-model="user.realName" placeholder="姓名"/>
        </el-form-item>
        <el-form-item label="手机号码" required prop="phone">
          <el-input v-model="user.phone" placeholder="手机号码"/>
        </el-form-item>
        <el-form-item label="e-mail" required prop="email">
          <el-input v-model="user.email" placeholder="e-mail"/>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="user.roleIds">
            <el-checkbox
              v-for="data in roles"
              :label="data.id"
              :key="data.id">
              {{data.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmUser">保存</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findAllRole as fetchRoleList } from '@/api/role'
import { fetchList as fetchUserList, getUser2Edit, enableUser, disableUser, deleteUser, updateUser, createUser } from '@/api/user'

const defaultUser = {
  id: 0,
  username: '',
  realName: '',
  phone: '',
  email: '',
  roleIds: []
}
export default {
  name: 'User',
  data () {
    return {
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' }
        ]
      },
      user: Object.assign({}, defaultUser),
      userList: [],
      dialogType: 'new',
      dialogVisible: false,
      checkedRoles: [],
      roles: [],
      paramsForm: {
        currentPage: 1,
        pageSize: 10
      },
      totalRecords: 0
    }
  },
  created () {
    this.fetchList()
    this.getRoles()
  },
  methods: {
    async getRoles () {
      const res = await fetchRoleList()
      this.roles = res.object
    },
    fetchList () {
      fetchUserList(this.paramsForm).then(response => {
        this.userList = response.object.rows
        this.totalRecords = response.object.total
      }).catch(() => {})
    },
    handleAddUser () {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.user.roleIds = []
      getUser2Edit({ id: scope.row.id }).then(response => {
        this.user = response.object
        this.dialogVisible = true
      }).catch(() => {})
    },
    async confirmUser () {
      const isEdit = this.dialogType === 'edit'

      let formValid = false
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
