<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入搜索关键字" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户信息 -->
      <el-table :data="userInfo" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名" width="130px" align="center"></el-table-column>
        <el-table-column prop="headimg" label="头像" width="130px" align="center">
          <template #default="{row}">
            <el-image style="width: 100px; height: 100px" 
            :src="baseurl + row.headimg" fit="fill" >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="130px" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" width="90px" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" width="130px" align="center"></el-table-column>
        <el-table-column prop="showtext" label="个性签名" align="center"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getUserInfo } from "network/userInfo.js";
  export default {
    name: 'UserInfo',
    data() {
      return{
        // 获取用户信息的参数对象
        queryInfo: {
          // 搜索框关键字
          query: '',
          // 当前页码
          pagenum: 1,
          // 每页显示条数
          pagesize: 4
        },
        // 用户数据
        userInfo: [],
        // 图片公共地址
        baseurl: '',
      }
    },
    created() {
      this.baseurl = this.baseURL
      // 获取用户信息的数据
      this.getUserInfo()
    },
    methods: {
      // 获取用户信息的数据
      async getUserInfo() {
        let res = await getUserInfo()
        // console.log(res)
        if (res.code !== 200) {
          this.$message.error({
            message: "信息查询失败",
            center: true,
            showClose: true
          });
        }else{
          this.userInfo =  res.data
        }
      },
    },
  }
</script>

<style scoped>
</style>