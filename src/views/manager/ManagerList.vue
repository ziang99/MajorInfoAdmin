<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索关键字" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addManager">添加管理员</el-button>
        </el-col>
      </el-row>
      <!-- 管理员列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="账号密码"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column label="操作" width="120px">
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
    </el-card>

    <!-- 添加管理员提示框 -->
    <el-dialog title="添加管理员" :visible.sync="dialogVisible" width="40%" @close="addClose" center>
      <!-- 内容表单 -->
      <el-form :model="userForm" :rules="formRules" ref="addFormRef" label-width="100px" label-position="right" status-icon>
        <el-form-item label="管理员名称" prop="username">
          <el-input v-model="userForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改管理员提示框 -->
    <el-dialog title="修改管理员信息" :visible.sync="updataDialog" width="40%" center @close="updataClose">
      <!-- 内容表单 -->
      <el-form :model="updataUserInfo" :rules="formRules" ref="updataFormRef" label-width="100px" label-position="right"
        status-icon>
        <el-form-item label="管理员名称" prop="username">
          <el-input v-model="updataUserInfo.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updataUserInfo.password" clearable></el-input>
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
  import { getUserList, delectUser, addGradeName, getGradeName,updataGrade } from "network/managerList.js";
  export default {
    name: 'ManagerList',
    data() {
      return{
        // 获取管理员列表的参数对象
        queryInfo: {
          // 搜索框关键字
          query: '',
          // 当前页码
          pagenum: 1,
          // 每页显示条数
          pagesize: 4
        },
        // 管理员数据
        userList: [],
        dialogVisible: false,
        userForm: {
          username: '',
          password: ''
        },
        formRules: {
          username: [
            { required: true, message: "请输入账号", trigger: "blur" },
            { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
          ]
        },
        // 要修改的那条学院信息
        updataUserInfo: {},
        // 修改学院提示框的显示与隐藏
        updataDialog: false,
      }
    },
    created() {
      // 获取管理员列表的数据
      this.getUserList()
    },
    methods: {
      // 获取管理员列表的数据
      async getUserList() {
        let res = await getUserList()
        // console.log(res)
        if (res.code !== 200) {
          this.$message.error({
            message: "信息查询失败",
            center: true,
            showClose: true
          });
        }else{
          this.userList =  res.data
        }
      },
      // 点击删除按钮时
      async delUser (userId) {
        // console.log(userId)
        // 弹框询问是否确认删除
        const res = await this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
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
          const res = await delectUser(userId)
          // console.log(res)
          if (res.code !== 200) {
            return this.$message({
              type: 'error',
              message: '删除操作失败！',
              center: true,
              showClose: true
            })
          } else {
            this.getUserList()
            this.$message({
              type: 'success',
              message: '已成功删除该管理员！',
              center: true,
              showClose: true
            })
          }
        }
      },
      // 点击添加管理员按钮时，打开对话框
      addManager () {
        this.dialogVisible = true
      },
      addClose () {
        this.$refs.addFormRef.resetFields()
      },
      confirmAdd () {
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (valid) {
            const res = await addGradeName(this.userForm)
            // console.log(res)
            if(res.code === 200){
              this.getUserList()
              this.dialogVisible = false
              this.$message.success({
                message: "添加成功",
                center: true,
                showClose: true
              });
            }else{
              this.$message.error({
                message: "添加失败!可能是该学院名称已存在~",
                center: true,
                showClose: true
              });
            }
          }
        })
      },
      // 点击修改学院按钮时
      async updataUser (userId) {
        // console.log(userId)
        const res = await getGradeName(userId)
        // console.log(res)
        if (res.code !== 200) {
          return this.$message.error({
            message: '获取该管理员失败!',
            center: true,
            showClose: true
          })
        } else {
          this.updataUserInfo = res.data
        }
        // 打开对话框
        this.updataDialog = true
      },
      // 当修改学院对话框关闭时，重置表单
      updataClose () {
        this.$refs.updataFormRef.resetFields()
      },
      // 点击确认修改按钮后，当校验整个修改表单信息都符合规则时，发起请求修改学院信息
      confirmUpdata () {
        this.$refs.updataFormRef.validate(async state => {
          // console.log(state)
          if (state) {
            // state为true时，证明要修改提交的数据格式无误，则发起修改请求
            const res = await updataGrade(this.updataUserInfo)
            // console.log(res)
            if (res.code !== 200) {
              return this.$message.error({
                message: '修改失败!可能是该名称已存在~',
                center: true,
                showClose: true
              })
            } else {
              this.getUserList()
              this.updataDialog = false
              this.$message.success({
                message: '修改成功!',
                center: true,
                showClose: true
              })
            }
          }
        })
      },


    },
  }
</script>

<style scoped>
</style>