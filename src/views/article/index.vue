<template>
  <div class="app-container">
    <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddArticle">新建文档</el-button>
    <el-table :data="articlesList" style="width: 100%; margin-top:30px;" border size="small">
      <el-table-column
        align="center"
        label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
          <el-tag v-if="scope.row.isTop === 1" size="mini" type="danger">置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="副标题">
        <template slot-scope="scope">
          {{ scope.row.subTitle }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="标题图片">
        <template slot-scope="scope">
          <el-image v-if="scope.row.imageUrl"
            style="width: 100px; height: 100px"
            :src="scope.row.imageUrl"
            :fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="类型">
        <template slot-scope="scope">
          {{ typeDict[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="跳转地址">
        <template slot-scope="scope">
          {{ scope.row.linkUrl }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="显示状态">
        <template slot-scope="scope">
          {{ scope.row.describe }}
          <el-tag v-if="scope.row.isDisplay === 1" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">下架</el-tag>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '修改文档' : '新增文档'">
      <el-form :model="article" ref="articleForm" label-width="80px" label-position="left">
        <el-form-item label="类型" required prop="type" :rules="[{ required: true, message: '请选择类型'}]">
          <el-select v-model="article.type">
            <el-option v-for="item in types" :key="item.id" :value="item.dictValue" :label="item.dictLabel" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" required prop="title" :rules="[{ required: true, message: '请输入标题'}]">
          <el-input v-model="article.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="article.subTitle" type="textarea"  placeholder="副标题" />
        </el-form-item>
        <el-form-item label="标题图片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转地址">
          <el-input v-model="article.linkUrl" placeholder="跳转地址" />
        </el-form-item>
        <el-form-item label="内容">
          <editor-bar :isClear="false" v-model="article.content" @change="contentChange"></editor-bar>
        </el-form-item>
        <el-form-item label="是否显示" required>
          <el-radio-group v-model="article.isDisplay">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否置顶" required>
          <el-radio-group v-model="article.isTop">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmArticle">保存</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteArticle, updateArticle, createArticle } from '@/api/article'
import { dictionary } from '@/api/dict'
import EditorBar from '@/components/wangEditor'

const defaultArticle = {
  id: 0,
  title: '',
  subTitle: '',
  source: '',
  isDisplay: 1,
  imageUrl: '',
  linkUrl: '',
  content: '',
  type: '',
  isTop: 0,
  linkType: null
}

export default {
  name: 'Article',
  components: { EditorBar },
  data () {
    return {
      article: Object.assign({}, defaultArticle),
      articlesList: [],
      dialogType: 'new',
      dialogVisible: false,
      types: [],
      typeDict: {},
      paramsForm: {
        currentPage: 1,
        pageSize: 10
      },
      totalRecords: 0
    }
  },
  created () {
    this.getTypes()
    this.fetchList()
  },
  computed: {
  },
  methods: {
    async getTypes () {
      const res = await dictionary({ code: 'ArticleType' })
      this.types = res.object
      this.types.map((item) => {
        this.typeDict[item.dictValue] = item.dictLabel
      })
    },
    async fetchList () {
      fetchList(this.paramsForm).then(response => {
        this.articlesList = response.object.rows
        this.totalRecords = response.object.total
      }).catch(() => {})
    },
    contentChange (val) {
      this.article.content = val
    },
    handleAddArticle () {
      this.article = Object.assign({}, defaultArticle)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.article = Object.assign({}, scope.row)
      // this.article.type = String(this.article.type)
    },
    async confirmArticle () {
      let formValid = false
      this.$refs.articleForm.validate((valid) => {
        formValid = valid
      })
      console.log(formValid)
      if (!formValid) return

      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        updateArticle(this.article).then(response => {
          this.dialogVisible = false
          this.fetchList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).catch(err => { console.error(err) })
      } else {
        createArticle(this.article).then(response => {
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
      this.$confirm('确定删除该文档?', 'Warning', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        deleteArticle({ id: id }).then(response => {
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
