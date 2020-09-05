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
    <el-button size="small" type="text" icon="el-icon-plus" style="margin-top:10px;" @click="handleAddMerchant">新建商户</el-button>
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
        label="认证状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.authenticateStatus == 0" type="info">未认证</el-tag>
          <el-tag size="small" v-if="scope.row.authenticateStatus == 1" >已认证</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="签约状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.signUpStatus == 0" type="info">未签约</el-tag>
          <el-tag size="small" v-if="scope.row.signUpStatus == 1" >已签约</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '修改商户' : '新增商户'" width="1200px" top="0">
      <el-form :model="merchant" ref="merchantForm" label-width="140px" label-position="right" size="small">
        <span class="info-label">基础信息（准确真实填写企业基础信息）</span>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商户名称:"  prop="name" :rules="[{ required: true, message: '请输入商户名称'}]">
              <el-input v-model="merchant.name" placeholder="商户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业执照号:"  prop="businessLicenseNo" :rules="[{ required: true, message: '请输入商户名称'}]">
              <el-input v-model="merchant.businessLicenseNo" placeholder="商户名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="法人姓名:"  prop="legalName" :rules="[{ required: true, message: '请输入法人姓名'}]">
              <el-input v-model="merchant.legalName" placeholder="法人姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人身份证号码:"  prop="legalIdCardNo" :rules="[{ required: true, message: '请输入身份证号码'}]">
              <el-input v-model="merchant.legalIdCardNo" placeholder="法人身份证号码"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人联系方式:"  prop="legalPhone" :rules="[{ required: true, message: '请输入法人联系方式'}]">
              <el-input v-model="merchant.legalPhone" placeholder="法人联系方式"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="业务联系人:"  prop="businessLinkName" :rules="[{ required: true, message: '请输入业务联系人'}]">
              <el-input v-model="merchant.businessLinkName" placeholder="业务联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人手机号:"  prop="businessLinkPhone" :rules="[{ required: true, message: '请输入联系人手机号'}]">
              <el-input v-model="merchant.businessLinkPhone" placeholder="联系人手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人邮箱:"  prop="businessLinkEmail" :rules="[{ required: true, message: '请输入联系人邮箱'}]">
              <el-input v-model="merchant.businessLinkEmail" placeholder="联系人邮箱"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在省份:"  prop="provinceName" :rules="[{ required: true, message: '请输入所在省份'}]">
              <el-input v-model="merchant.provinceName" placeholder="所在省份"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在城市:"  prop="cityName" :rules="[{ required: true, message: '请输入所在城市'}]">
              <el-input v-model="merchant.cityName" placeholder="所在城市"/>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="详细地址:"  prop="address" :rules="[{ required: true, message: '请输入详细地址'}]">
              <el-input v-model="merchant.address" placeholder="详细地址"/>
            </el-form-item>
          </el-col>
        </el-row>

        <span class="info-label">账户信息（充值账户必须为对公账户）</span>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="开户名称:" prop="bankInfoEditRo.bankAccountName" :rules="[{ required: true, message: '请输入开户名称'}]">
              <el-input v-model="merchant.bankInfoEditRo.bankAccountName" placeholder="开户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户银行:"  prop="bankInfoEditRo.bankName" :rules="[{ required: true, message: '请输入开户银行'}]">
              <el-input v-model="merchant.bankInfoEditRo.bankName" placeholder="开户银行"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="省份:"  prop="bankInfoEditRo.bankProvinceName" :rules="[{ required: true, message: '请输入省份'}]">
              <el-input v-model="merchant.bankInfoEditRo.bankProvinceName" placeholder="省份"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="城市:"  prop="bankInfoEditRo.bankCityName" :rules="[{ required: true, message: '请输入城市'}]">
              <el-input v-model="merchant.bankInfoEditRo.bankCityName" placeholder="城市"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支行:"  prop="bankInfoEditRo.bankBranchName" :rules="[{ required: true, message: '请输入支行名称'}]">
              <el-input v-model="merchant.bankInfoEditRo.bankBranchName" placeholder="支行名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="银行联行号:"  prop="bankInfoEditRo.interBankNumber" :rules="[{ required: true, message: '请输入银行联行号'}]">
              <el-input v-model="merchant.bankInfoEditRo.interBankNumber" placeholder="银行联行号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="银行账户:"  prop="bankInfoEditRo.bankAccountNumber" :rules="[{ required: true, message: '请输入银行账户'}]">
              <el-input v-model="merchant.bankInfoEditRo.bankAccountNumber" placeholder="银行账户"/>
            </el-form-item>
          </el-col>
        </el-row>

        <span class="info-label">开票信息（企业基础开票信息）</span>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="纳税人识别号:" prop="invoiceInfoEditRo.taxpayerIdNumber" :rules="[{ required: true, message: '请输入纳税人识别号'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.taxpayerIdNumber" placeholder="纳税人识别号"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="识别号有效期:" prop="invoiceInfoEditRo.taxpayerIdTime" :rules="[{ required: true, message: '请选择识别号有效期'}]">
              <el-date-picker
                v-model="merchant.invoiceInfoEditRo.taxpayerIdTime"
                type="daterange"
                :picker-options="taxpayerIdTimeOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纳税人类型:" prop="invoiceInfoEditRo.taxpayerType" :rules="[{ required: true, message: '请选择纳税人类型'}]">
              <el-select v-model="merchant.invoiceInfoEditRo.taxpayerType" placeholder="纳税人类型">
                <el-option label="一般纳税人" value="一般纳税人"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="注册地址:" prop="invoiceInfoEditRo.registerAddress" :rules="[{ required: true, message: '请输入注册地址'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.registerAddress" placeholder="注册地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司联系电话:" prop="invoiceInfoEditRo.companyPhone" :rules="[{ required: true, message: '请输入公司联系电话'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.companyPhone" placeholder="公司联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户银行:" prop="invoiceInfoEditRo.bankName" :rules="[{ required: true, message: '请输入开户银行'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.bankName" placeholder="开户银行"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="省份:" prop="invoiceInfoEditRo.provinceName" :rules="[{ required: true, message: '请输入省份'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.provinceName" placeholder="省份"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市:" prop="invoiceInfoEditRo.cityName" :rules="[{ required: true, message: '请输入城市'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.cityName" placeholder="城市"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支行:" prop="invoiceInfoEditRo.bankBranchName" :rules="[{ required: true, message: '请输入支行名称'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.bankBranchName" placeholder="支行名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="银行账户:" prop="invoiceInfoEditRo.bankAccountNumber" :rules="[{ required: true, message: '请输入银行账户'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.bankAccountNumber" placeholder="银行账户"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收票人:" prop="invoiceInfoEditRo.receiptLinkName" :rules="[{ required: true, message: '请输入收票人'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.receiptLinkName" placeholder="收票人"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收票人电话:" prop="invoiceInfoEditRo.receiptLinkPhone" :rules="[{ required: true, message: '请输入收票人电话'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.receiptLinkPhone" placeholder="收票人电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收票地址:" prop="invoiceInfoEditRo.receiptAddress" :rules="[{ required: true, message: '请输入收票地址'}]">
              <el-input v-model="merchant.invoiceInfoEditRo.receiptAddress" placeholder="收票地址"/>
            </el-form-item>
          </el-col>
        </el-row>

        <span class="info-label">企业资质（企业三证扫描件回复印件加盖公章）</span>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="10">
            <el-form-item label="营业执照有效期:" prop="businessLicenseTime" :rules="[{ required: true, message: '请选择营业执照有效期'}]">
              <el-date-picker
                v-model="merchant.businessLicenseTime"
                :picker-options="businessLicenseTimeOptions"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="营业执照:" prop="businessLicensePhoto" :rules="[{ required: true, message: '请上传营业执照'}]">
              <el-upload
                :class="{'hide-upload':licensePhotoList.length>=photoLimitCount}"
                action="https://dev-file.sneakerpai.com/file/upload"
                list-type="picture-card"
                accept=".jpeg,.jpg,.png"
                :on-exceed="handlePhotoExceed"
                :on-success="handleLicenseUploadSuccess"
                :on-remove="handleLicenseUploadRemove"
                :on-preview="handlePhotoPreview"
                :file-list="licensePhotoList"
                :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="openAccountLicencePhoto" :rules="[{ required: true, message: '请上传开户许可证'}]">
              <span slot="label" style="text-align: center">
                开户许可证:
                <p style="font-size: 12px; line-height:20px; width: 90px; margin-left: 45px; color: #E6A23C;">无开户许可证再次上传营业执照</p>
              </span>
              <el-upload
                :class="{'hide-upload':openAccountLicensePhotoList.length>=photoLimitCount}"
                action="https://dev-file.sneakerpai.com/file/upload"
                list-type="picture-card"
                accept=".jpeg,.jpg,.png"
                :on-exceed="handlePhotoExceed"
                :on-success="handleOpenAccountLicenseSuccess"
                :on-remove="handleOpenAccountLicenseRemove"
                :on-preview="handlePhotoPreview"
                :file-list="openAccountLicensePhotoList"
                :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="法人身份证正面:" prop="legalIdCardFrontPhoto" :rules="[{ required: true, message: '请上传法人身份证正面'}]">
              <el-upload
                :class="{'hide-upload':legalIdCardFrontPhotoList.length>=photoLimitCount}"
                action="https://dev-file.sneakerpai.com/file/upload"
                list-type="picture-card"
                accept=".jpeg,.jpg,.png"
                :on-exceed="handlePhotoExceed"
                :on-success="handleLegalIdCardFrontUploadSuccess"
                :on-remove="handleLegalIdCardFrontUploadRemove"
                :on-preview="handlePhotoPreview"
                :file-list="legalIdCardFrontPhotoList"
                :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人身份证反面:" prop="legalIdCardBackPhoto" :rules="[{ required: true, message: '请上传法人身份证反面'}]">
              <el-upload
                :class="{'hide-upload':legalIdCardBackPhotoList.length>=photoLimitCount}"
                action="https://dev-file.sneakerpai.com/file/upload"
                list-type="picture-card"
                accept=".jpeg,.jpg,.png"
                :on-exceed="handlePhotoExceed"
                :on-success="handleLegalIdCardBackUploadSuccess"
                :on-remove="handleLegalIdCardBackUploadRemove"
                :on-preview="handlePhotoPreview"
                :file-list="legalIdCardBackPhotoList"
                :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <span class="info-label">其他设置 (关联操作人账号)</span>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作账户:" prop="operaterName" :rules="[{ required: true, message: '请选择操作账户'}]">
              <el-input v-model="merchant.operaterName" disabled placeholder="操作账户" style="width: 80%; margin-right: 10px;"/>
              <el-button type="text" @click="userSelectorDialogVisible=true">选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="confirmMerchant">保存</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="userSelectorDialogVisible" title="选择操作账户">
      <merchant-user-selector @getSelected="handleChangedUser($event)"></merchant-user-selector>
    </el-dialog>

    <el-dialog :visible.sync="photoPreviewDialogVisible">
      <img width="100%" :src="photoPreviewImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import MerchantUserSelector from './user-selector'
import { fetchList, createMerchant, updateMerchant, getMerchant } from '@/api/merchant'

const defaultMerchant = {
  id: 0,
  name: '',
  businessLicenseNo: '',
  legalName: '',
  legalIdCardNo: '',
  legalPhone: '',
  businessLinkName: '',
  businessLinkPhone: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  address: '',
  businessLicenseTime: '',
  businessLicenseStartTime: '',
  businessLicenseEndTime: '',
  businessLicensePhoto: '',
  openAccountLicencePhoto: '',
  legalIdCardFrontPhoto: '',
  legalIdCardBackPhoto: '',
  operaterId: '',
  operaterName: '',
  bankInfoEditRo: {
    id: 0,
    merchantId: '',
    merchantName: '',
    bankAccountName: '',
    bankName: '',
    bankProvinceCode: '',
    bankProvinceName: '',
    bankCityCode: '',
    bankCityName: '',
    bankBranchName: '',
    interBankNumber: '',
    bankAccountNumber: ''
  },
  invoiceInfoEditRo: {
    id: 0,
    merchantId: '',
    merchantName: '',
    taxpayerIdNumber: '',
    taxpayerIdTime: '',
    taxpayerIdStartTime: '',
    taxpayerIdEndTime: '',
    taxpayerType: '',
    registerAddress: '',
    companyPhone: '',
    bankName: '',
    provinceCode: '',
    provinceName: '',
    cityCode: '',
    cityName: '',
    bankBranchName: '',
    bankAccountNumber: '',
    receiptAddress: '',
    receiptLinkName: '',
    receiptLinkPhone: ''
  }
}
export default {
  name: 'Merchant',
  components: { MerchantUserSelector },
  data () {
    return {
      merchant: Object.assign({}, defaultMerchant),
      merchantList: [],
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
      taxpayerIdTimeOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.merchant.invoiceInfoEditRo.taxpayerIdStartTime = minDate
          this.merchant.invoiceInfoEditRo.taxpayerIdEndTime = maxDate
        }
      },
      businessLicenseTimeOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.merchant.businessLicenseStartTime = minDate
          this.merchant.businessLicenseEndTime = maxDate
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
      photoLimitCount: 1,
      photoPreviewDialogVisible: false,
      photoPreviewImageUrl: '',
      userSelectorDialogVisible: false
    }
  },
  created () {
    this.fetchList()
  },
  computed: {
    licensePhotoList () {
      return this.merchant.businessLicensePhoto ? [{ url: this.merchant.businessLicensePhoto }] : []
    },
    openAccountLicensePhotoList () {
      return this.merchant.openAccountLicencePhoto ? [{ url: this.merchant.openAccountLicencePhoto }] : []
    },
    legalIdCardFrontPhotoList () {
      return this.merchant.legalIdCardFrontPhoto ? [{ url: this.merchant.legalIdCardFrontPhoto }] : []
    },
    legalIdCardBackPhotoList () {
      return this.merchant.legalIdCardBackPhoto ? [{ url: this.merchant.legalIdCardBackPhoto }] : []
    }
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
    handleAddMerchant () {
      this.merchant = Object.assign({}, defaultMerchant)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      getMerchant({ id: scope.row.id }).then(response => {
        this.merchant = Object.assign({}, response.object)
        this.$set(this.merchant, 'businessLicenseTime', [this.merchant.businessLicenseStartTime, this.merchant.businessLicenseEndTime])

        this.$set(this.merchant, 'bankInfoEditRo', response.object.bankInfoVo)
        this.$set(this.merchant, 'invoiceInfoEditRo', response.object.invoiceInfoVo)
        this.$set(this.merchant.invoiceInfoEditRo, 'taxpayerIdTime', [this.merchant.invoiceInfoEditRo.taxpayerIdStartTime, this.merchant.invoiceInfoEditRo.taxpayerIdEndTime])
        console.log(this.merchant)
        this.dialogVisible = true
      }).catch(() => {})
    },
    // ------------各个图片处理Start
    handlePhotoExceed (files, fileList) {
      this.$message.warning('文件数量超出限制')
    },
    handlePhotoPreview (file) {
      this.photoPreviewImageUrl = file.url
      this.photoPreviewDialogVisible = true
    },
    // 营业执照
    handleLicenseUploadSuccess (response, file, fileList) {
      if (response.code === 1 && response.object) {
        this.merchant.businessLicensePhoto = response.object.viewPath
      }
    },
    handleLicenseUploadRemove (file, fileList) {
      this.merchant.businessLicensePhoto = ''
    },
    // 开户许可证
    handleOpenAccountLicenseSuccess (response, file, fileList) {
      if (response.code === 1 && response.object) {
        this.merchant.openAccountLicencePhoto = response.object.viewPath
      }
    },
    handleOpenAccountLicenseRemove (file, fileList) {
      this.merchant.openAccountLicencePhoto = ''
    },
    // 法人身份证正面
    handleLegalIdCardFrontUploadSuccess (response, file, fileList) {
      if (response.code === 1 && response.object) {
        this.merchant.legalIdCardFrontPhoto = response.object.viewPath
      }
    },
    handleLegalIdCardFrontUploadRemove (file, fileList) {
      this.merchant.legalIdCardFrontPhoto = ''
    },
    // 法人身份证背面
    handleLegalIdCardBackUploadSuccess (response, file, fileList) {
      if (response.code === 1 && response.object) {
        this.merchant.legalIdCardBackPhoto = response.object.viewPath
      }
    },
    handleLegalIdCardBackUploadRemove (file, fileList) {
      this.merchant.legalIdCardBackPhoto = ''
    },
    // ---------------各个图片处理End
    handleChangedUser (data) {
      this.merchant.operaterId = data.id
      this.merchant.operaterName = data.userName
      this.userSelectorDialogVisible = false
    },
    async confirmMerchant () {
      const isEdit = this.dialogType === 'edit'

      let formValid = false
      console.log(this.$refs.userForm)
      this.$refs.merchantForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      if (isEdit) {
        updateMerchant(this.merchant).then(response => {
          this.dialogVisible = false
          this.fetchList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createMerchant(this.merchant).then(response => {
          this.dialogVisible = false
          this.fetchList()
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
</style>
