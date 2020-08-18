<template>
  <div class="app-container">
    <el-button type="text" size="small" icon="el-icon-plus" :disabled="addSubDisabled" @click="handleAdd">新增</el-button>
    <el-table :data="organizes" style="width: 100%; margin-top:30px;"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChild'}"
              :expand-row-keys="expandRowKeys"
              border
              size="small">
      <el-table-column
        label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="全名">
        <template slot-scope="scope">
          {{ scope.row.fullName }}
        </template>
      </el-table-column>
      <el-table-column
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0">集团</el-tag>
          <el-tag v-if="scope.row.type == 1" type="danger">公司</el-tag>
          <el-tag v-if="scope.row.type == 2" type="warning">部门</el-tag>
          <el-tag v-if="scope.row.type == 3" type="info">组</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddSub(scope)">新建下级</el-button>
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="organize" ref="organizeForm" label-width="100px" label-position="left">
        <el-form-item label="上级组织" prop="parentName">
          <el-select :value="parentSelectValue" :clearable="true" @clear="clearParentSelect" class="parent-select">
            <el-option :value="parentSelectValue" class="organize-tree-option">
              <organize-tree @getValue="changedParent($event)"></organize-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织名称" prop="name" :rules="[{ required: true, message: '组织名称不能为空'}]">
          <el-input v-model="organize.name" placeholder="组织名称" />
        </el-form-item>
        <el-form-item label="组织类型"  prop="type" :rules="[{ required: true, message: '请选择组织类型'}]">
          <el-radio-group v-model="organize.type">
            <el-radio :label="0">集团</el-radio>
            <el-radio :label="1">公司</el-radio>
            <el-radio :label="2">部门</el-radio>
            <el-radio :label="3">组</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="[{ required: true, message: '组织排序不能为空'}]">
          <el-input v-model="organize.sort" placeholder="组织排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="organize.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="confirmOrganize">保存</el-button>
          <el-button size="small" @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTree, organizeDetail, createOrganize, updateOrganize, deleteOrganize } from '@/api/organize'
import OrganizeTree from './organize-tree'

const defaultOrganize = {
  id: 0,
  parentId: 0,
  parentName: '',
  type: 0,
  name: '',
  sort: 1,
  remark: ''
}

export default {
  name: 'Organize',
  components: { OrganizeTree },
  data () {
    return {
      organize: Object.assign({}, defaultOrganize),
      organizes: [],
      dialogType: 'new',
      addSubDisabled: false,
      dialogVisible: false,
      dialogTitle: '',
      organizeInfo: [],
      parentSelectValue: '',
      expandRowKeys: []
    }
  },
  created () {
    this.fetchTreeList()
  },
  computed: {
  },
  methods: {
    // initOneLevelTree () {
    //   this.organizes = []
    //   lazyTree({ parentId: 0 }).then(response => {
    //     this.organizes = response.object
    //   }).catch(() => {})
    // },
    // loadNode (row, node, resolve) {
    //   console.log(row)
    //   lazyTree({ parentId: row.id }).then(response => {
    //     resolve(response.object)
    //     this.expandRowKeys.push(row.id)
    //   }).catch(() => {})
    // },
    fetchTreeList () {
      fetchTree().then(response => {
        this.organizes = response.object
      }).catch(() => {})
    },
    handleAddSub (scope) {
      this.organize = Object.assign({}, defaultOrganize)
      this.organize.parentId = scope.row.id
      this.organize.parentName = scope.row.name
      this.dialogTitle = '新建下级组织'
      this.dialogType = 'new'
      this.dialogVisible = true
      this.parentSelectValue = scope.row.name
    },
    handleAdd () {
      this.dialogTitle = '新建组织'
      this.dialogVisible = true
      this.dialogType = 'new'
      this.organize = Object.assign({}, defaultOrganize)
      this.parentSelectValue = ''
    },
    handleEdit (scope) {
      organizeDetail({ id: scope.row.id }).then(response => {
        this.organize = Object.assign({}, response.object)
        this.dialogType = 'edit'
        this.dialogTitle = '修改组织'
        this.dialogVisible = true
        this.parentSelectValue = this.organize.parentName
      }).catch(() => {})
    },
    changedParent (data) {
      this.parentSelectValue = data.name
      this.organize.parentId = data.id
      this.organize.parentName = data.name
    },
    clearParentSelect () {
      this.parentSelectValue = ''
      this.organize.parentId = 0
      this.organize.parentName = ''
    },
    // reloadChildren (nodeKey) {
    //   lazyTree({ parentId: nodeKey }).then(response => {
    //     if (nodeKey === 0) {
    //       this.rootNode.childNodes = []
    //       this.loadNode(this.rootNode, this.rootNodeResolve)
    //     } else {
    //       const parentNode = this.$refs.organizeTree.getNode(this.organize.parentId)
    //       if (parentNode && parentNode.isLeaf) {
    //         this.expandedKeys.push(this.organize.parentId) // 如果父节点是叶子节点，强行展开
    //       } else {
    //         this.$refs.organizeTree.updateKeyChildren(nodeKey, response.object)
    //       }
    //     }
    //   }).catch(() => {})
    // },
    async confirmOrganize () {
      const isEdit = this.dialogType === 'edit'

      let formValid = false
      this.$refs.organizeForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      if (isEdit) {
        updateOrganize(this.organize).then(response => {
          this.dialogVisible = false
          this.fetchTreeList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createOrganize(this.organize).then(response => {
          this.dialogVisible = false
          this.fetchTreeList()
          this.$message({
            type: 'success',
            message: '新建成功!'
          })
        }).catch(err => { console.error(err) })
      }
    },
    handleDelete (scope) {
      this.$confirm('确定删除该组织?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteOrganize({ id: scope.row.id }).then(response => {
          this.fetchTreeList()
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
  .parent-select{
    width: 100%;
  }
  .organize-tree-option{
    height: auto;
  }
  .organize-tree-option.selected{
    font-weight: 20;
  }
  .organize-tree-option.hover,
  .organize-tree-option:hover{
    background-color: #ffffff;
  }
</style>
