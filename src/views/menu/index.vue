<template>
  <div class="app-container">
    <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddRoot">新建一级菜单</el-button>
    <el-table :data="menuTreeList" style="width: 100%; margin-top:30px;"
              row-key="id"
              :tree-props="{children: 'children'}"
              border
              size="small">
      <el-table-column
        align="center"
        type="index">
      </el-table-column>
      <el-table-column
        label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="CODE">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0">菜单</el-tag>
          <el-tag v-if="scope.row.type == 1" type="danger">按钮</el-tag>
          <el-tag v-if="scope.row.type == 2" type="info">数据</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="权限URL">
        <template slot-scope="scope">
          {{ scope.row.permissionUrl != null ? scope.row.permissionUrl : '无' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="el-icon-plus" v-if="scope.row.type == 0" @click="handleAddSon(scope.row)">新建子菜单</el-button>
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="menu" ref="menuForm" label-width="120px" label-position="left">
        <el-form-item v-if="hasParent" label="上级CODE">
          <el-input v-model="menu.parentCode" disabled/>
        </el-form-item>
        <el-form-item v-if="hasParent" label="上级名称">
          <el-input v-model="menu.parentName" disabled/>
        </el-form-item>
        <el-form-item label="CODE" prop="code" required :rules="[{ required: true, message: '请输入菜单CODE'}]">
          <el-input v-model="menu.code" :disabled="dialogType === 'edit'" placeholder="菜单CODE" />
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入菜单名称'}]">
          <el-input v-model="menu.name" placeholder="菜单名称"/>
        </el-form-item>
        <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请选择菜单类型'}]">
          <el-select v-model="menu.type" placeholder="菜单类型">
            <el-option  key="0" label="菜单" value="0" />
            <el-option  key="1" label="按钮" value="1" />
            <el-option  key="2" label="数据" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限URL">
          <el-input v-model="menu.permissionUrl" placeholder="权限URL" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmMenu">保存</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTreeTable, createMenu, updateMenu, deleteMenu } from '@/api/menu'

const defaultMenu = {
  id: 0,
  parentId: 0,
  parentName: '',
  parentCode: '',
  code: '',
  name: '',
  type: null,
  permissionUrl: ''
}

export default {
  name: 'Menu',
  data () {
    return {
      menu: Object.assign({}, defaultMenu),
      menuTreeList: [],
      dialogVisible: false,
      dialogTitle: '',
      dialogType: 'new',
      hasParent: false
    }
  },
  created () {
    this.fetchTreeList()
  },
  methods: {
    fetchTreeList () {
      fetchTreeTable().then(response => {
        console.log(response)
        this.menuTreeList = response.object
      }).catch(error => {
        console.log(error)
      })
    },
    handleAddRoot () {
      this.dialogVisible = true
      this.dialogTitle = '新增一级菜单'
      this.dialogType = 'new'
      this.menu = Object.assign({}, defaultMenu)
    },
    handleAddSon (parentMenu) {
      this.dialogVisible = true
      this.dialogTitle = '新增子菜单'
      this.dialogType = 'new'
      this.hasParent = true
      this.menu = Object.assign({}, defaultMenu)
      this.menu.parentId = parentMenu.id
      this.menu.parentCode = parentMenu.code
      this.menu.parentName = parentMenu.name
    },
    handleEdit (scope) {
      this.dialogVisible = true
      this.dialogTitle = '修改子菜单'
      this.dialogType = 'edit'
      this.menu = Object.assign({}, scope.row)
      this.menu.type = String(this.menu.type) // 如果不转为String，select无法正确赋值
      console.log(this.menu)
      if (this.menu.parentId !== 0) {
        this.hasParent = true
        console.log(scope)
      }
    },
    handleDelete (scope) {
      if (scope.row.children.length > 0) {
        this.$message({
          type: 'error',
          message: '存在子菜单，不可删除!'
        })
        return
      }
      this.$confirm('确定删除该菜单?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteMenu({ id: scope.row.id }).then(response => {
          this.fetchTreeList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    },
    confirmMenu () {
      const isEdit = this.dialogType === 'edit'

      let formValid = false
      this.$refs.menuForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      if (isEdit) {
        updateMenu(this.menu).then(response => {
          this.dialogVisible = false
          this.fetchTreeList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createMenu(this.menu).then(response => {
          this.dialogVisible = false
          this.fetchTreeList()
          this.$message({
            type: 'success',
            message: '新建成功!'
          })
        }).catch(err => { console.error(err) })
      }
    }
  }
}
</script>
