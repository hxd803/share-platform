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
            <el-form-item label="商户名称:" prop="name">
              <el-input v-model="paramsForm.name"/>
            </el-form-item>
          </el-form>
      </div>
      <el-button type="primary" icon="el-icon-search" size="mini" class="searchBtn" @click="handleSearch()">查询</el-button>
      <el-button type="primary" icon="el-icon-refresh-left" size="mini" class="searchBtn" @click="handleSearchReset()">重置</el-button>
    </div>
    <el-table :data="merchantList" style="width: 100%; margin-top:10px;" border size="small">
      <el-table-column
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="商户id">
        <template slot-scope="scope">
          {{ scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="商户名称">
        <template slot-scope="scope">
          {{ scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="有效期起">
        <template slot-scope="scope">
          {{ scope.row.serviceStartTime | parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="有效期止">
        <template slot-scope="scope">
          {{ scope.row.serviceEndTime | parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="服务费率">
        <template slot-scope="scope">
          {{ scope.row.serviceRate}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="服务状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.serviceStatus == 0" type="info">下架</el-tag>
          <el-tag size="small" v-if="scope.row.serviceStatus == 1" >上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" v-if="scope.row.serviceStatus == 1" icon="el-icon-view" @click="handleViewContract(scope)">查看合同</el-button>
          <el-button size="small" type="text" v-if="scope.row.serviceStatus == 0" icon="el-icon-upload" @click="handleUploadContract(scope)">上传合同</el-button>
          <el-button size="small" type="text" icon="el-icon-setting" @click="handleEdit(scope)">费率配置</el-button>
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

    <el-dialog :visible.sync="rateConfigDialogVisible" title="服务费率配置">
      <el-form :model="merchant" ref="merchantForm" label-width="100px" label-position="right" size="small">
        <el-form-item label="商户名称:">
          {{merchant.name}}
        </el-form-item>
        <el-form-item label="服务有效期:"  prop="serviceTime" :rules="[{ required: true, message: '请选择正确的服务有效期'}]">
          <el-date-picker
            v-model="merchant.serviceTime"
            type="daterange"
            :picker-options="serviceTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="服务费率:"  prop="serviceRate" :rules="[{ required: true, message: '请输入正确的服务费率'}]">
          <el-input-number v-model="merchant.serviceRate" :precision="2" :max="1" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="服务状态:"  prop="serviceStatus" :rules="[{ required: true, message: '请选择服务状态'}]">
          <el-radio-group v-model="merchant.serviceStatus">
            <el-radio :label="0">下架</el-radio>
            <el-radio :label="1">上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="confirmMerchant">保存</el-button>
          <el-button @click="rateConfigDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="contractDialogVisible" :title="contractDialogType === 'view' ? '查看合同' : '上传合同'" @close="contractDialogClose">
      <el-upload
        ref="contractUpload"
        :class="{'hide-upload':contractDialogType === 'view'}"
        action="https://dev-file.sneakerpai.com/file/upload"
        list-type="picture-card"
        accept=".jpeg,.jpg,.png"
        :multiple="true"
        :show-file-list="true"
        :on-preview="handlePhotoPreview"
        :on-success="handleContractUploadSuccess"
        :on-remove="handleContractUploadRemove"
        :file-list="contractPhotoList"
        :disabled="contractDialogType === 'view'">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-divider></el-divider>
      <div style="margin-top: 20px; padding-left: 40px;">
        <el-button type="primary" v-if="contractDialogType === 'upload'" @click="confirmContract" size="small">保存</el-button>
        <el-button @click="contractDialogVisible=false" size="small">{{ contractDialogType === 'view' ? '关闭' : '取消' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="photoPreviewDialogVisible">
      <img width="100%" :src="photoPreviewImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getMerchant, rateConfig, contractList, uploadContract } from '@/api/merchant'

const defaultMerchant = {
  id: 0,
  serviceRate: '',
  serviceStatus: 0,
  serviceTime: '',
  serviceStartTime: '',
  serviceEndTime: ''
}
export default {
  name: 'MerchantRateConfig',
  data () {
    return {
      merchant: Object.assign({}, defaultMerchant),
      merchantList: [],
      dialogType: 'new',
      dialogVisible: false,
      rateConfigDialogVisible: false,
      searchTimeSlot: '',
      createTimeSlotOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.paramsForm.createTimeStart = minDate
          this.paramsForm.createTimeEnd = maxDate
        }
      },
      serviceTimeOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.merchant.serviceStartTime = minDate
          this.merchant.serviceEndTime = maxDate
        }
      },
      paramsForm: {
        currentPage: 1,
        pageSize: 10,
        name: '',
        createTimeStart: '',
        createTimeEnd: ''
      },
      totalRecords: 0,
      photoPreviewDialogVisible: false,
      photoPreviewImageUrl: '',
      contractDialogVisible: false,
      contractDialogType: 'view',
      contractPhotoList: []
    }
  },
  created () {
    this.fetchList()
  },
  computed: {

  },
  methods: {
    fetchList () {
      fetchList(this.paramsForm).then(response => {
        this.merchantList = response.object.rows
        this.totalRecords = response.object.total
      }).catch(() => {})
    },
    handleSearch () {
      this.fetchList()
    },
    handleSearchReset () {
      this.$refs.searchFrom.resetFields()
      this.fetchList()
    },
    handleViewContract (scope) {
      this.contractDialogType = 'view'
      contractList({ id: scope.row.id }).then(response => {
        if (response.code === 1 && response.object) {
          response.object.map((url) => {
            this.contractPhotoList.push({ url: url, rUrl: url }) // 加载时，覆盖一个属性上去，便于直接获取远程url
          })
        }
        this.contractDialogVisible = true
      }).catch(() => {})
    },
    handleUploadContract (scope) {
      this.contractDialogType = 'upload'
      this.merchant.id = scope.row.id
      contractList({ id: scope.row.id }).then(response => {
        if (response.code === 1 && response.object) {
          response.object.map((url) => {
            this.contractPhotoList.push({ url: url, rUrl: url }) // 加载时，覆盖一个属性上去，便于直接获取远程url
          })
        }
        this.contractDialogVisible = true
      }).catch(() => {})
    },
    contractDialogClose () {
      this.contractPhotoList.length = 0
      this.$refs.contractUpload.clearFiles()
    },
    handlePhotoExceed (files, fileList) {
      this.$message.warning('文件数量超出限制')
    },
    handlePhotoPreview (file) {
      this.photoPreviewImageUrl = file.url
      this.photoPreviewDialogVisible = true
    },
    handleContractUploadSuccess (response, file, fileList) {
      this.$set(file, 'rUrl', response.object.viewPath) // 上传成功后，覆盖一个属性上去，便于直接获取远程url
      console.log(this.$refs.contractUpload.uploadFiles)
    },
    handleContractUploadRemove (file, fileList) {
      //
    },
    confirmContract () {
      console.log(this.contractPhotoList)
      const urls = []
      const files = this.$refs.contractUpload.uploadFiles
      if (files) {
        files.map((file) => {
          urls.push(file.rUrl)
        })
      }
      this.merchant.contractPhotoList = urls
      uploadContract(this.merchant).then(response => {
        this.contractDialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(err => { console.error(err) })
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      getMerchant({ id: scope.row.id }).then(response => {
        this.merchant = Object.assign({}, response.object)
        if (this.merchant.serviceStartTime && this.merchant.serviceEndTime) {
          this.$set(this.merchant, 'serviceTime', [this.merchant.serviceStartTime, this.merchant.serviceEndTime])
        }
        this.rateConfigDialogVisible = true
      }).catch(() => {})
    },
    async confirmMerchant () {
      let formValid = false
      console.log(this.$refs.userForm)
      this.$refs.merchantForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      rateConfig(this.merchant).then(response => {
        this.rateConfigDialogVisible = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(err => { console.error(err) })
    }
  }
}
</script>
<style>
  .info-label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
    font-weight: 700;
    margin-bottom: -10px;
  }
  .hide-upload .el-upload--picture-card {
    display: none;
  }
  .hide-upload .el-upload-list__item-delete {
    display: none;
  }
</style>
