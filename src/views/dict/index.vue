<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-card class="dict-list-panel">
          <div slot="header">
            <span class="title">数据字典</span>
            <el-button style="float: right; padding: 3px 0" type="text" size="mini" icon="el-icon-plus" @click="handleAdd(true)">新建字典</el-button>
          </div>
          <div>
            <el-table :data="dictList" style="width: 100%;"
                row-key="id"
                height="600"
                size="mini">
              <el-table-column label="字典编码">
                <template slot-scope="scope">
                  {{ scope.row.code }}
                </template>
              </el-table-column>
              <el-table-column label="字典名称">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleCurrentChange(scope.row)">{{ scope.row.dictLabel }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
                  <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card v-show="this.currentDict.id">
          <div slot="header">
            <span class="title">【{{currentDict.dictLabel}}】- 字典项</span>
            <el-button style="float: right; padding: 3px 0" type="text" size="mini" icon="el-icon-plus" @click="handleAdd(false)">新建字典项</el-button>
          </div>
          <el-table :data="dictItemList" style="width: 100%;"
              row-key="id"
              height="600"
              size="mini">
            <el-table-column label="字典编码">
              <template slot-scope="scope">
                {{ scope.row.code }}
              </template>
            </el-table-column>
            <el-table-column label="字典项">
              <template slot-scope="scope">
                {{ scope.row.dictLabel }}
              </template>
            </el-table-column>
            <el-table-column label="字典值">
              <template slot-scope="scope">
                {{ scope.row.dictValue }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="dict" ref="dictForm" :rules="rules" label-width="120px" label-position="left" size="small">
        <el-form-item label="字典编码" prop="code" :required="isZero">
          <el-input v-model="dict.code" :disabled="!isZero || dialogType === 'edit'"/>
        </el-form-item>
        <el-form-item v-if="!isZero" label="字典名称" >
          <el-input v-model="dict.name" disabled/>
        </el-form-item>
        <el-form-item :label="isZero ? '字典名称' : '显示值'" required prop="dictLabel">
          <el-input v-model="dict.dictLabel" :placeholder="isZero ? '字典名称' : '显示值'" />
        </el-form-item>
        <el-form-item v-if="!isZero" label="字典值" required prop="dictValue">
          <el-input v-model="dict.dictValue" placeholder="字典值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" required>
          <el-input v-model="dict.sort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dict.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmDict">保存</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// , dictDetail, createDict, updateDict, deleteDict
import { lazyTree, createDict, updateDict, deleteDict } from '@/api/dict'
import { Message } from 'element-ui'

const defaultDict = {
  id: 0,
  parentId: 0,
  code: '',
  name: '',
  dictLabel: '',
  dictValue: -1,
  sort: 1,
  remark: ''
}

export default {
  name: 'Dict',
  data () {
    return {
      rules: {
        code: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
        ],
        dictLabel: [
          { required: true, message: this.isZero ? '请输入字典名称' : '请输入显示值', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入字典排序', trigger: 'blur' }
        ]
      },
      dict: Object.assign({}, defaultDict),
      dictList: [],
      dictItemList: [],
      dialogVisible: false,
      dialogTitle: '',
      dialogType: 'new',
      isZero: false,
      currentDict: {}
    }
  },
  created () {
    this.loadList(0)
  },
  methods: {
    loadList (parentId) {
      lazyTree({ parentId: parentId }).then(response => {
        if (parentId === 0) {
          this.dictList = response.object
        } else {
          this.dictItemList = response.object
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleCurrentChange (row) {
      this.currentDict = Object.assign({}, row)
      this.loadList(this.currentDict.id)
    },
    handleAdd (isZero) {
      this.dict = Object.assign({}, defaultDict)
      this.isZero = isZero
      if (!isZero) {
        if (this.currentDict.id) {
          this.dict.parentId = this.currentDict.id
          this.dict.code = this.currentDict.code
          this.dict.name = this.currentDict.dictLabel
          this.dict.dictValue = null
        } else {
          Message({
            message: '请指定字典',
            type: 'error',
            duration: 1000
          })
          return
        }
      }
      this.dialogVisible = true
      this.dialogTitle = isZero ? '新建字典' : '【' + this.currentDict.dictLabel + '】 新建字典项'
      this.dialogType = 'new'
    },
    handleEdit (scope) {
      this.isZero = scope.row.parentId === 0
      this.dialogTitle = this.isZero ? '修改字典' : '修改字典项'
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.dict = Object.assign({}, scope.row)
      if (!this.isZero) {
        this.dict.name = this.currentDict.dictLabel
      }
    },
    handleDelete (scope) {
      this.isZero = scope.row.parentId === 0
      this.$confirm(this.isZero ? '确定删除该字典?' : '确定删除该字典项？', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteDict({ id: scope.row.id }).then(response => {
          this.loadList(scope.row.parentId)
          // 如果当前选中项刚好和删除的项相等，清空当前选中项
          if (this.currentDict.id === scope.row.id) {
            this.currentDict = {}
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(err => { console.error(err) })
    },
    confirmDict () {
      const isEdit = this.dialogType === 'edit'

      let formValid = false
      this.$refs.dictForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      if (isEdit) {
        updateDict(this.dict).then(response => {
          this.dialogVisible = false
          this.loadList(this.dict.parentId)
          // 如果当前选中项刚好和修改的项相等，刷新当前选中项
          if (this.currentDict.id === this.dict.id) {
            this.currentDict = Object.assign({}, this.dict)
          }
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createDict(this.dict).then(response => {
          this.dialogVisible = false
          this.loadList(this.dict.parentId)
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
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.dict-list-panel{
  margin-right: 10px;
}
.dict-list-card .title{
  font-size: 14px;
  font-weight: normal;
}
</style>
