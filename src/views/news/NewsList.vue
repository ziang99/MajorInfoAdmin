<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      <el-breadcrumb-item>资讯列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入标题关键字进行搜索" v-model="queryInfo.query" clearable @clear="getListDetail">
            <el-button slot="append" icon="el-icon-search" @click="getListDetail"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加资讯</el-button>
        </el-col>
      </el-row>
      <!-- 信息列表 -->
      <el-table :data="listDetail" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="news_logo" label="图片" width="130px" align="center">
          <template #default="{row}">
            <el-image style="width: 100px; height: 100px" 
            :src="baseurl + row.news_logo" fit="fill" >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="news_name" label="标题" width="150px" align="center"></el-table-column>
        <el-table-column prop="news_introduce" label="简介" align="center">
          <template #default="{row}">
            {{row.news_introduce}}
          </template>
        </el-table-column>
        <el-table-column prop="news_title_id" label="所属专业" width="150px" align="center">
          <template #default="{row}">
            {{row.news_title_id}}
          </template>
        </el-table-column>
        <el-table-column prop="likenum" label="点赞人数" width="60px" align="center">
          <template #default="{row}">
            {{row.likenum}}
          </template>
        </el-table-column>
        <el-table-column prop="collect" label="收藏人数" width="60px" align="center">
          <template #default="{row}">
            {{row.collect}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <template slot-scope="slotProps">
            <!-- 修改 -->
            <el-button 
              type="warning" 
              icon="el-icon-edit" 
              size="mini" 
              @click="updataUser(slotProps.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              @click="delUser(slotProps.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 8]" 
        :page-size="queryInfo.pagesize" 
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加信息提示框 -->
    <el-dialog title="添加信息" :visible.sync="dialogVisible" width="40%" @close="addClose" center>
      <!-- 内容表单 -->
      <el-form :model="userForm" :rules="formRules" ref="addFormRef" label-width="80px" label-position="right" status-icon>
        <el-form-item label="所属专业" prop="news_title_id">
          <el-select v-model="userForm.news_title_id" placeholder="请选择所属专业" style="width: 100%;">
            <el-option
              :value="item.name"
              v-for="item in category" :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="news_logo">
          <el-upload
            :action="baseurl + '/admin/image/upload'"
            :headers="tokenObj"
            list-type="picture"
            :limit="1"
            :on-exceed="exceed"
            :http-request="imgRequest"
          >
            <el-button type="primary" size="small ">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" prop="news_name">
          <el-input type="textarea" v-model="userForm.news_name" placeholder="请输入标题" ></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="news_introduce">
          <el-input type="textarea" v-model="userForm.news_introduce" placeholder="请填写简介内容" ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改内容提示框 -->
    <el-dialog title="修改信息" :visible.sync="updataDialog" width="40%" center @close="updataClose">
      <!-- 内容表单 -->
      <el-form :model="updataUserInfo" :rules="formRules" ref="updataFormRef" label-width="80px" label-position="right"
        status-icon>
        <el-form-item label="所属专业" prop="news_title_id">
          <el-select v-model="updataUserInfo.news_title_id" placeholder="请选择所属专业" style="width: 100%;">
            <el-option
              :value="item.name"
              v-for="item in category" :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="news_logo">
          <el-upload
            :action="baseurl + '/admin/image/upload'"
            :headers="tokenObj"
            list-type="picture"
            :limit="1"
            :on-exceed="exceed"
            :http-request="imgRequest"
          >
            <el-button type="primary" size="small ">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" prop="news_name">
          <el-input type="textarea" v-model="updataUserInfo.news_name" placeholder="请输入标题" ></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="news_introduce">
          <el-input type="textarea" v-model="updataUserInfo.news_introduce" placeholder="请填写简介内容" ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="updataDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdata">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getListDetail, 
    getCategory, 
    addListDetail, 
    addListDetailImgae,
    getDetail,
    updataDetail,
    delectDetail,
    delImage,
    updateImage
  } from 'network/newList.js';
  export default {
    name: 'NewsList',
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          // 搜索框关键字
          query: '',
          // 当前页码
          pagenum: 1,
          // 每页显示条数
          pagesize: 4
        },
        // 总记录数
        total: 0,
        baseurl: '',
        // 详情列表数据
        listDetail: [],
        // 添加信息提示框的显示与隐藏
        dialogVisible: false,
        // 添加信息的表单数据
        userForm: {
          news_name: null,
          news_introduce: null,
          news_logo: null,
          news_title_id: null,
          news_banner: 0,
          likenum: 0,
          islike: 0,
          collect: 0,
        },
        // 添加信息的表单验证规则
        formRules: {
          news_title_id: [
            { required: true, message: "请选择所属专业", trigger: "blur" }
          ],
          news_name: [
            { required: true, message: "请输入标题", trigger: "blur" },
            { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
          ],
          news_introduce: [
            { required: true, message: "请输入简介内容", trigger: "blur" },
            { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
          ]
        },
        // 类目列表
        category: [],
        // 添加信息时点击图片上传
        file: {},
        // 要修改的那条用户信息
        updataUserInfo: {},
        // 修改提示框的显示与隐藏
        updataDialog: false,
      }
    },
    computed: {
      tokenObj() {
        return {
          'token': window.sessionStorage.getItem('token')
        }
      }
    },
    created() {
      this.baseurl = this.baseURL
      this.getListDetail()
    },
    methods: {
      async getListDetail() {
        let res = await getListDetail(this.queryInfo)
        // console.log(res)
        if(res.code === 200){
          this.listDetail = res.data
          this.total = res.total
        }else{
          this.$message.error({
            message: "信息加载失败",
            center: true,
            showClose: true
          });
        }
      },
      // 点击添加类目按钮时，打开对话框
      async addUser () {
        let res = await getCategory()
        // console.log(res)
        if(res.code === 200){
          this.category = res.data
        }else{
          this.$message.error({
            message: "类目查询失败",
            center: true,
            showClose: true
          });
        }
        this.dialogVisible = true
      },
      // 当添加类目对话框关闭时，重置表单
      addClose () {
        this.$refs.addFormRef.resetFields()
      },
      // 点击确认添加按钮后，当校验整个添加表单信息都符合规则时，发起请求添加类目
      confirmAdd () {
        this.$refs.addFormRef.validate(async valid => {
          if (valid) {
            // 图片字段部分
            let formData = new FormData()
            // console.log(this.file)
            formData.append('file', this.file)
            const flag = await addListDetailImgae(formData)
            // console.log(flag)
            if(flag.code === 401) {
              return this.$message.error({
                message: "图片太大",
                center: true,
                showClose: true
              });
            }else if(flag.code === 402) {
              return this.$message.error({
                message: "格式有误",
                center: true,
                showClose: true
              });
            }
            // 其他字段部分
            this.userForm.news_logo = flag.img
            const res = await addListDetail(this.userForm)
            // console.log(res)
            if(res.code === 200){
              this.getListDetail()
              this.dialogVisible = false
              this.$message.success({
                message: "添加信息成功",
                center: true,
                showClose: true
              });
            }else{
              this.$message.error({
                message: "添加信息失败",
                center: true,
                showClose: true
              });
            }
          }
        })
      },
      // 文件超出个数限制时的钩子
      exceed(files, fileList) {
        this.$message.warning({
          message: "上传一张图片即可哦~",
          center: true,
          showClose: true
        });
      },
      // 添加信息点击图片上传时触发
      imgRequest(e) {
        this.file = e.file
      },
      // 更新每页显示的条数
      handleSizeChange (newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getListDetail()
      },
      // 更新切换的页数
      handleCurrentChange (newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getListDetail()
      },

      // 点击修改按钮时
      async updataUser (userId) {
        // console.log(userId)
        const res = await getDetail(userId)
        // console.log(res)
        if (res.code !== 200) {
          return this.$message.error({
            message: '获取该条信息内容失败!',
            center: true,
            showClose: true
          })
        } else {
          this.updataUserInfo = res.data
          this.category = res.category
        }
        // 打开对话框
        this.updataDialog = true
      },
      // 当修改对话框关闭时，重置表单
      updataClose () {
        this.$refs.updataFormRef.resetFields()
      },
      // 点击确认修改按钮后，当校验整个修改表单信息都符合规则时，发起请求修改用户信息
      confirmUpdata () {
        this.$refs.updataFormRef.validate(async state => {
          // console.log(state)
          if (state) {
            // console.log(this.updataUserInfo)
            // 图片字段部分
            let formData = new FormData()
            // console.log(this.file)
            formData.append('file', this.file)
            const flag = await updateImage(formData, this.updataUserInfo.id)
            // console.log(flag)
            if(flag.code === 401) {
              return this.$message.error({
                message: "图片太大",
                center: true,
                showClose: true
              });
            }else if(flag.code === 402) {
              return this.$message.error({
                message: "格式有误",
                center: true,
                showClose: true
              });
            }

            this.updataUserInfo.news_logo = flag.img
            const res = await updataDetail(this.updataUserInfo)
            // console.log(res)
            if (res.code !== 200) {
              return this.$message.error({
                message: '修改信息失败',
                center: true,
                showClose: true
              })
            } else {
              this.getListDetail()
              this.updataDialog = false
              this.$message.success({
                message: '修改信息成功',
                center: true,
                showClose: true
              })
            }
          }
        })
      },
      // 点击删除按钮时
      async delUser (userId) {
        // console.log(userId)
        // 弹框询问是否确认删除
        const res = await this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).catch(err => err)
        // console.log(res)
        if (res !== 'confirm') {
          return this.$message({
            type: 'info',
            message: '已取消删除操作！',
            center: true,
            showClose: true
          })
        } else {
          const res = await delectDetail(userId)
          // console.log(res)
          if (res.code === 200) {
            this.queryInfo = {
              query: '',
              pagenum: 1,
              pagesize: 4
            }
            this.getListDetail()
            this.$message({
              type: 'success',
              message: '删除成功',
              center: true,
              showClose: true
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败！',
              center: true,
              showClose: true
            })
          }
        }
      },
    },
  }
</script>

<style scoped>

</style>