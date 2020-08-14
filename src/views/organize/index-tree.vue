<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="option-menu">
          <el-button type="primary" size="small" icon="el-icon-plus" :disabled="addSubDisabled" @click="handleAddOneLevel">新增一级组织</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" :disabled="addSubDisabled" @click="handleAddSub">新增下级组织</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" :disabled="addSubDisabled" @click="handleUpdate">修改</el-button>
          <el-button size="small" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="9">
        <el-card class="tree-card">
          <el-tree
            ref="organizeTree"
            :data="organizes"
            :props="defaultProps"
            node-key="id"
            lazy
            :load="loadNode"
            :default-expanded-keys="expandedKeys"
            :highlight-current="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            :draggable="true"
            @node-click="getOrganizeDetail"
          >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>
              {{ node.label }}
            </span>
          </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card class="organize-info-card">
          <transition name="fade-transform" mode="out-in">
            <div v-if="showInfo">
              <div class="line">
                <div class="label">ID：</div>
                <div class="value">{{ showInfoOrganize.id }}</div>
              </div>
              <div class="line">
                <div class="label">名称：</div>
                <div class="value">{{ showInfoOrganize.name }}</div>
              </div>
              <div class="line">
                <div class="label">全称：</div>
                <div class="value">{{ showInfoOrganize.fullName }}</div>
              </div>
              <div class="line">
                <div class="label">类型：</div>
                <div class="value">
                  <el-tag size="mini"  v-if="showInfoOrganize.type == 0">集团</el-tag>
                  <el-tag size="mini"  v-if="showInfoOrganize.type == 1" type="danger">公司</el-tag>
                  <el-tag size="mini"  v-if="showInfoOrganize.type == 2" type="warning">部门</el-tag>
                  <el-tag size="mini"  v-if="showInfoOrganize.type == 3" type="info">组</el-tag>
                </div>
              </div>
              <div class="line">
                <div class="label">排序：</div>
                <div class="value">{{ showInfoOrganize.sort }}</div>
              </div>
            </div>
          </transition>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="organize" ref="organizeForm" label-width="100px" label-position="left">
        <el-form-item label="上级组织" prop="parentName" v-if="organize.parentId != 0">
          <el-input v-model="organize.parentName" disabled placeholder="上级组织" />
        </el-form-item>
        <el-form-item label="组织名称" prop="name" :rules="[{ required: true, message: '组织名称不能为空'}]">
          <el-input v-model="organize.name" placeholder="组织名称" />
        </el-form-item>
        <el-form-item label="组织类型"  prop="level" :rules="[{ required: true, message: '请选择组织类型'}]">
          <el-radio v-model="organize.type" :label="0">集团</el-radio>
          <el-radio v-model="organize.type" :label="1">公司</el-radio>
          <el-radio v-model="organize.type" :label="2">部门</el-radio>
          <el-radio v-model="organize.type" :label="3">组</el-radio>
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
import { lazyTree, organizeDetail, createOrganize, updateOrganize, deleteOrganize } from '@/api/organize'

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
  data () {
    return {
      organize: Object.assign({}, defaultOrganize),
      organizes: [],
      showInfoOrganize: null,
      showInfo: false,
      dialogType: 'new',
      expandedKeys: [],
      addSubDisabled: false,
      dialogVisible: false,
      dialogTitle: '',
      organizeInfo: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: this.getIsLeaf
      },
      rootNode: [],
      rootNodeResolve: []
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.rootNode = node
        this.rootNodeResolve = resolve
      }
      lazyTree({ parentId: node.data.id ? node.data.id : 0 }).then(response => {
        resolve(response.object)
      }).catch(() => {})
    },
    getIsLeaf (data, node) {
      return !data.hasChild
    },
    getOrganizeDetail (data) {
      this.showInfo = false
      organizeDetail({ id: data.id }).then(response => {
        this.showInfoOrganize = Object.assign({}, response.object)
        this.showInfo = true
      }).catch(() => {})
    },
    resetForm () {
      this.$refs.organizeForm.resetFields()
    },
    handleAddSub () {
      const checkedorganizeNode = this.$refs.organizeTree.getCurrentNode()
      if (checkedorganizeNode === null) {
        this.$message({
          type: 'error',
          message: '请选择父级组织!'
        })
        return
      }
      this.organize = Object.assign({}, defaultOrganize)
      this.organize.parentId = checkedorganizeNode.id
      this.organize.parentName = checkedorganizeNode.name
      this.dialogTitle = '新建下级组织'
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleAddOneLevel () {
      this.dialogTitle = '新建一级组织'
      this.dialogVisible = true
      this.dialogType = 'add-root'
      this.organize = Object.assign({}, defaultOrganize)
    },
    handleUpdate () {
      const checkedorganizeNode = this.$refs.organizeTree.getCurrentNode()
      if (checkedorganizeNode === null) {
        this.$message({
          type: 'error',
          message: '请选择要需改的组织!'
        })
        return
      }
      organizeDetail({ id: checkedorganizeNode.id }).then(response => {
        this.organize = Object.assign({}, response.object)
        this.dialogType = 'edit'
        this.dialogTitle = '修改组织'
        this.dialogVisible = true
      }).catch(() => {})
    },
    reloadChildren (nodeKey) {
      lazyTree({ parentId: nodeKey }).then(response => {
        if (nodeKey === 0) {
          this.rootNode.childNodes = []
          this.loadNode(this.rootNode, this.rootNodeResolve)
        } else {
          const parentNode = this.$refs.organizeTree.getNode(this.organize.parentId)
          if (parentNode && parentNode.isLeaf) {
            this.expandedKeys.push(this.organize.parentId) // 如果父节点是叶子节点，强行展开
          } else {
            this.$refs.organizeTree.updateKeyChildren(nodeKey, response.object)
          }
        }
      }).catch(() => {})
    },
    async confirmOrganize () {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        updateOrganize(this.organize).then(response => {
          this.dialogVisible = false
          this.reloadChildren(this.organize.parentId)
          this.resetForm()
          this.getOrganizeDetail(this.organize)
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createOrganize(this.organize).then(response => {
          this.dialogVisible = false
          this.reloadChildren(this.organize.parentId)
          this.resetForm()
          this.$message({
            type: 'success',
            message: '新建成功!'
          })
        }).catch(err => { console.error(err) })
      }
    },
    handleDelete () {
      const checkedorganizeNode = this.$refs.organizeTree.getCurrentNode()
      if (checkedorganizeNode === null) {
        this.$message({
          type: 'error',
          message: '请选择要删除的组织!'
        })
        return
      }
      this.$confirm('确定删除该区划?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteOrganize({ id: checkedorganizeNode.id }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$refs.organizeTree.remove(checkedorganizeNode)
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    }
  }
}
</script>

<style>
  .tree-card{
    height: 650px;
    overflow-y: auto;
    margin-right: 10px;
  }
  .option-menu{
    height: 70px;
    margin-bottom: 10px;
  }
  .organize-info-card{
    height: 650px;
    padding-left: 20px;
    font-size: 14px;
  }
  .organize-info-card .line{
    display: flex;
    font-size: 14px;
    line-height: 30px;
    margin-top: 10px;
  }
  .organize-info-card .line .label{
    width: 120px;
    text-align: left;
    margin-right: 20px;
}
</style>
