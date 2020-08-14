<template>
  <div class="app-container">
    <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddRole">新建角色</el-button>
    <el-table :data="rolesList" style="width: 100%; margin-top:30px;" border size="small">
      <el-table-column
        align="center"
        type="index">
      </el-table-column>
      <el-table-column
        align="center"
        label="CODE">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="描述">
        <template slot-scope="scope">
          {{ scope.row.describe }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '修改角色' : '新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="CODE" required>
          <el-input v-model="role.code" :disabled="dialogType === 'edit'" placeholder="角色CODE" />
        </el-form-item>
        <el-form-item label="名称" required>
          <el-input v-model="role.name" :disabled="dialogType === 'edit'" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述" required>
          <el-input
            v-model="role.describe"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="授权" required>
          <el-tree
            ref="menuTree"
            :data="menus"
            :props="defaultProps"
            default-expand-all
            :check-strictly="checkStrictly"
            show-checkbox
            node-key="id"
            class="menu-tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <el-tag size="mini"  v-if="data.type == 0">菜单</el-tag>
              <el-tag size="mini"  v-if="data.type == 1" type="danger">按钮</el-tag>
              <el-tag size="mini"  v-if="data.type == 2" type="info">数据</el-tag>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmRole">保存</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRole, updateRole, deleteRole } from '@/api/role'
import { fetchTreeTable } from '@/api/menu'

const defaultRole = {
  id: 0,
  code: '',
  name: '',
  describe: '',
  menus: []
}

export default {
  name: 'Role',
  data () {
    return {
      role: Object.assign({}, defaultRole),
      rolesList: [],
      dialogType: 'new',
      dialogVisible: false,
      checkStrictly: false,
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      paramsForm: {
        currentPage: 1,
        pageSize: 10
      },
      totalRecords: 0
    }
  },
  created () {
    this.fetchList()
    this.getMenus()
  },
  computed: {
    menuTree () {
      return this.menus
    }
  },
  methods: {
    async getMenus () {
      const res = await fetchTreeTable()
      this.menus = res.object
    },
    fetchList () {
      fetchList(this.paramsForm).then(response => {
        this.rolesList = response.object.rows
        this.totalRecords = response.object.total
      }).catch(() => {})
    },
    handleAddRole () {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs.menuTree) {
        this.$refs.menuTree.setCheckedNodes([])
      }
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = Object.assign({}, scope.row)
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs.menuTree.setCheckedKeys(this.role.menus)
        this.checkStrictly = false
      })
    },
    getCheckedMenuIds () {
      const data = []
      const checkedMenuNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      checkedMenuNodes.forEach(menuNode => {
        data.push(menuNode.id)
      })
      return data
    },
    async confirmRole () {
      const isEdit = this.dialogType === 'edit'
      this.role.menus = this.getCheckedMenuIds()
      if (isEdit) {
        updateRole(this.role).then(response => {
          this.dialogVisible = false
          this.fetchList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createRole(this.role).then(response => {
          this.dialogVisible = false
          this.fetchList()
          this.$message({
            type: 'success',
            message: '新建成功!'
          })
        }).catch(err => { console.error(err) })
      }
    },
    handleDelete (id) {
      this.$confirm('确定删除该角色?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteRole({ id: id }).then(response => {
          this.fetchList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    }
  }
}
</script>

<style>
  .menu-tree {
    min-height: 300px;
    overflow-y: auto;
    max-height: 300px;
  }
</style>
