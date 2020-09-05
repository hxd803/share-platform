<template>
  <div class="app-container">
    <!-- <el-table :data="platInfoList" style="width: 100%; margin-top:10px;" border size="small">
      <el-table-column
        align="center"
        label="ID">
        <template slot-scope="scope">
          {{ scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="名称">
        <template slot-scope="scope">
          {{ scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="公司名称">
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="开户名">
        <template slot-scope="scope">
          {{ scope.row.bankAccountName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="开户银行">
        <template slot-scope="scope">
          {{ scope.row.bankName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="支行名称">
        <template slot-scope="scope">
          {{ scope.row.bankBranchName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="银行账号">
        <template slot-scope="scope">
          {{ scope.row.bankAccountNumber }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <!-- <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '修改服务平台' : '新增服务平台'">
      <el-form :model="platInfo" ref="platInfoForm" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item label="平台名称" required prop="name">
          <el-input v-model="platInfo.name" placeholder="平台名称" />
        </el-form-item>
        <el-form-item label="公司名称" required prop="companyName">
          <el-input v-model="platInfo.companyName" placeholder="公司名称" />
        </el-form-item>
        <el-form-item label="开户名" required prop="bankAccountName">
          <el-input v-model="platInfo.bankAccountName" placeholder="开户名"/>
        </el-form-item>
        <el-form-item label="开户行" required prop="bankName">
          <el-input v-model="platInfo.bankName" placeholder="开户行"/>
        </el-form-item>
        <el-form-item label="支行名称" required prop="bankName">
          <el-input v-model="platInfo.bankBranchName" placeholder="支行名称"/>
        </el-form-item>
        <el-form-item label="银行账号" required prop="bankAccountNumber">
          <el-input v-model="platInfo.bankAccountNumber" placeholder="银行账号"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmplatInfo">保存</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
    <el-row>
      <el-col :span="12">
        <el-card class="platformInfo">
          <div slot="header">
            <span class="title">平台信息</span>
          </div>
          <el-form :model="platInfo" ref="platInfoForm" :rules="isEdit ? rules : {}" label-width="100px" label-position="left" size="small">
            <el-form-item label="平台名称:" :required="isEdit" prop="name">
              <el-input v-if="isEdit" v-model="platInfo.name" placeholder="平台名称" />
              <span v-else>{{platInfo.name}}</span>
            </el-form-item>
            <el-form-item label="公司名称:" :required="isEdit" prop="companyName">
              <el-input v-if="isEdit" v-model="platInfo.companyName" placeholder="公司名称" />
              <span v-else>{{platInfo.companyName}}</span>
            </el-form-item>
            <el-form-item label="开户名:" :required="isEdit" prop="bankAccountName">
              <el-input v-if="isEdit" v-model="platInfo.bankAccountName" placeholder="开户名"/>
              <span v-else>{{platInfo.bankAccountName}}</span>
            </el-form-item>
            <el-form-item label="开户行:" :required="isEdit" prop="bankName">
              <el-input v-if="isEdit" v-model="platInfo.bankName" placeholder="开户行"/>
              <span v-else>{{platInfo.bankName}}</span>
            </el-form-item>
            <el-form-item label="支行名称:" :required="isEdit" prop="bankBranchName">
              <el-input v-if="isEdit" v-model="platInfo.bankBranchName" placeholder="支行名称"/>
              <span v-else>{{platInfo.bankBranchName}}</span>
            </el-form-item>
            <el-form-item label="银行账号:" :required="isEdit" prop="bankAccountNumber">
              <el-input v-if="isEdit" v-model="platInfo.bankAccountNumber" placeholder="银行账号"/>
              <span v-else>{{platInfo.bankAccountNumber}}</span>
            </el-form-item>
            <el-form-item>
              <el-button v-if="!isEdit" type="primary" @click="handleEdit">编辑</el-button>
              <el-button v-if="isEdit" type="primary" @click="confirmplatInfo">保存</el-button>
              <el-button v-if="isEdit" @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchInfo, updatePlatform } from '@/api/service-platform'

const defaultPlatInfo = {
  id: 0,
  name: '',
  companyName: '',
  bankAccountName: '',
  bankName: '',
  bankBranchName: '',
  bankAccountNumber: ''
}
export default {
  name: 'platInfo',
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入平台名称' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称' }
        ],
        bankAccountName: [
          { required: true, message: '请输入开户名' }
        ],
        bankName: [
          { required: true, message: '请输入开户行' }
        ],
        bankBranchName: [
          { required: true, message: '请输入支行名称' }
        ],
        bankAccountNumber: [
          { required: true, message: '请输入银行账号' }
        ]
      },
      platInfo: Object.assign({}, defaultPlatInfo),
      dialogType: 'new',
      dialogVisible: false,
      isEdit: false
    }
  },
  created () {
    this.fetchInfo()
  },
  methods: {
    fetchInfo () {
      fetchInfo().then(response => {
        this.platInfo = Object.assign({}, response.object)
      }).catch(() => {})
    },
    handleEdit (scope) {
      // this.dialogType = 'edit'
      // this.dialogVisible = true
      // this.platInfo = Object.assign({}, scope.row)
      this.isEdit = true
    },
    cancelEdit () {
      this.isEdit = false
      this.$refs.platInfoForm.clearValidate()
      this.fetchInfo()
    },
    async confirmplatInfo () {
      let formValid = false
      console.log(this.$refs.platInfoForm)
      this.$refs.platInfoForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      updatePlatform(this.platInfo).then(response => {
        this.isEdit = false
        this.fetchInfo()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(err => { console.error(err) })
    }
  }
}
</script>
<style scoped>
.platformInfo .title {
  font-size: 14px;
  font-weight: normal;
}
</style>
