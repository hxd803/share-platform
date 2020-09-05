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
            <el-form-item label="商户名称:" prop="merchantName">
              <el-input v-model="paramsForm.merchantName"/>
            </el-form-item>
            <el-form-item label="登录名:" prop="userName">
              <el-input v-model="paramsForm.userName"/>
            </el-form-item>
          </el-form>
      </div>
      <el-button type="primary" icon="el-icon-search" size="mini" class="searchBtn" @click="handleSearch()">查询</el-button>
      <el-button type="primary" icon="el-icon-refresh-left" size="mini" class="searchBtn" @click="handleSearchReset()">重置</el-button>
    </div>
    <el-table :data="userList" style="width: 100%; margin-top:10px;" border size="small">
      <el-table-column
        align="center"
        type="index">
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名">
        <template slot-scope="scope">
          {{ scope.row.userName}}
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
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | parseTime}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="el-icon-video-play" @click="handleSelected(scope)">选择</el-button>
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
  </div>
</template>

<script>
import { fetchList as fetchUserList } from '@/api/merchant-user'

export default {
  name: 'MerchantUserSelector',
  data () {
    return {
      userList: [],
      searchTimeSlot: '',
      createTimeSlotOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.paramsForm.createTimeStart = minDate
          this.paramsForm.createTimeEnd = maxDate
        }
      },
      paramsForm: {
        currentPage: 1,
        pageSize: 10,
        userName: '',
        status: 0,
        merchantName: '',
        createTimeStart: '',
        createTimeEnd: ''
      },
      totalRecords: 0
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      fetchUserList(this.paramsForm).then(response => {
        this.userList = response.object.rows
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
    handleSelected (data) {
      this.$emit('getSelected', data.row)
    }
  }
}
</script>
