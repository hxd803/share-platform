<template>
  <div class="app-container">
    <el-row>
      <el-col :span="9">
        <el-card class="tree-card">
          <el-tree
            ref="regionTree"
            :data="regions"
            :props="defaultProps"
            node-key="code"
            lazy
            :load="loadNode"
            :default-expanded-keys="expandedKeys"
            :highlight-current="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            @node-click="getRegionDetail"
          />
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card class="option-menu">
          <el-button type="primary" size="small" icon="el-icon-plus" :disabled="addSubDisabled" @click="handleAddSub">新增下级</el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </el-card>
        <el-card class="region-form-card">
          <el-form :model="region" ref="regionForm" label-width="100px" label-position="left">
            <el-form-item label="父区划编号" prop="parentCode">
              <el-input v-model="region.parentCode" disabled placeholder="父级区划编号" />
            </el-form-item>
            <el-form-item label="父区划名称" prop="parentName">
              <el-input v-model="region.parentName" disabled placeholder="父级区划名称" />
            </el-form-item>
            <el-form-item label="区划编号" prop="code" :rules="[{ required: true, message: '区划编号不能为空'}]">
              <el-input v-model="region.code" placeholder="区划编号"/>
            </el-form-item>
            <el-form-item label="区划名称" prop="name" :rules="[{ required: true, message: '区划名称不能为空'}]">
              <el-input v-model="region.name" placeholder="区划名称" />
            </el-form-item>
            <el-form-item label="区划等级"  prop="level" :rules="[{ required: true, message: '请选择区划等级'}]">
              <el-radio-group v-model="region.level">
                <el-radio :label="0">国家</el-radio>
                <el-radio :label="1">省份/直辖市</el-radio>
                <el-radio :label="2">地市</el-radio>
                <el-radio :label="3">区县</el-radio>
                <el-radio :label="4">乡镇/街道</el-radio>
                <el-radio :label="5">村委</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="区划排序" prop="sort" :rules="[{ required: true, message: '区划排序不能为空'}]">
              <el-input v-model="region.sort" placeholder="区划排序" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="region.remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="备注"
              />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="confirmRegion">保存</el-button>
              <el-button size="small" @click="resetForm">清空</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { lazyTree, regionDetail, createRegion, updateRegion, deleteRegion } from '@/api/region'
import { Message } from 'element-ui'

const defaultRegion = {
  code: '',
  parentCode: '',
  parentName: '',
  ancestors: '',
  name: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  townCode: '',
  townName: '',
  villageCode: '',
  villageName: '',
  level: null,
  sort: 1,
  remark: ''
}

export default {
  name: 'Region',
  data () {
    return {
      region: Object.assign({}, defaultRegion),
      regions: [],
      dialogType: 'new',
      expandedKeys: [],
      addSubDisabled: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: this.getIsLeaf
      }
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    loadNode (node, resolve) {
      lazyTree({ parentCode: node.data.code ? node.data.code : '00' }).then(response => {
        resolve(response.object)
      }).catch(() => {})
    },
    getIsLeaf (data, node) {
      return !data.hasChild
    },
    getRegionDetail (data) {
      regionDetail({ code: data.code }).then(response => {
        this.region = Object.assign({}, response.object)
        this.addSubDisabled = this.region.level === 5
        this.dialogType = 'edit'
      }).catch(() => {})
    },
    resetForm () {
      this.$refs.regionForm.resetFields()
    },
    handleAddSub () {
      const checkedRegionNode = this.$refs.regionTree.getCurrentNode()
      if (checkedRegionNode === null) {
        Message({
          message: '请选择父级区划',
          type: 'error',
          duration: 1000
        })
        return
      }
      regionDetail({ code: checkedRegionNode.code }).then(response => {
        const parentRegion = response.object
        this.region = Object.assign({}, parentRegion)
        this.region.parentCode = parentRegion.code
        this.region.parentName = parentRegion.name
        this.region.code = ''
        this.region.name = ''
        this.region.level = parentRegion.level + 1

        this.dialogType = 'new'
      }).catch(() => {})
    },
    reloadChildren (nodeKey) {
      lazyTree({ parentCode: nodeKey }).then(response => {
        this.$refs.regionTree.updateKeyChildren(nodeKey, response.object)
      }).catch(() => {})
    },
    async confirmRegion () {
      const isEdit = this.dialogType === 'edit'

      let formValid = false
      this.$refs.regionForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      if (isEdit) {
        updateRegion(this.region).then(response => {
          this.dialogVisible = false
          this.reloadChildren(this.region.parentCode)
          this.resetForm()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createRegion(this.region).then(response => {
          this.dialogVisible = false

          const parentNode = this.$refs.regionTree.getNode(this.region.parentCode)
          if (parentNode.isLeaf) {
            this.expandedKeys.push(this.region.parentCode) // 如果父节点是叶子节点，强行展开
          } else {
            this.reloadChildren(this.region.parentCode)
          }
          this.resetForm()
          this.$message({
            type: 'success',
            message: '新建成功!'
          })
        }).catch(err => { console.error(err) })
      }
    },
    handleDelete () {
      const checkedRegionNode = this.$refs.regionTree.getCurrentNode()
      if (checkedRegionNode === null) {
        Message({
          message: '请选择要删除的区划',
          type: 'error',
          duration: 1000
        })
        return
      }
      this.$confirm('确定删除该区划?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteRegion({ code: checkedRegionNode.code }).then(response => {
          this.$refs.regionTree.remove(checkedRegionNode)
          this.resetForm()
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
  .tree-card{
    height: 745px;
    overflow-y: auto;
    margin-right: 10px;
  }
  .option-menu{
    height: 70px;
    margin-bottom: 10px;
  }
  .region-form-card{
    height: 650px;
  }
</style>
