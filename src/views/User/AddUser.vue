<template>
  <div>
    <div class="container main m-auto">
      <header class="flex justify-between items-center">
        <el-page-header :content="title" @back="$router.go(-1)">
        </el-page-header>
      </header>
      <el-divider></el-divider>
      <el-main style="width:50%;">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="form.nickName" :readonly="!isEdit"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="form.userPhone" :readonly="!isEdit"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" placeholder="性别" :disabled="!isEdit">
              <el-option label="男" :value="0"></el-option>
              <el-option label="女" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="userTypeName">
            <el-input v-model="form.userTypeName" :readonly="!isEdit"></el-input>
          </el-form-item>
          <!-- <el-form-item v-if="isEdit" label="初始密码" prop="password">
            <el-input v-model="form.password" :readonly="!isEdit"></el-input>
          </el-form-item> -->
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" :readonly="!isEdit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isEdit" size="small" icon="el-icon-check" type="primary" @click="submitForm('form')">
              保存
            </el-button>
            <!-- <el-button v-if="isEdit" type="success" size="small" icon="el-icon-refresh" @click="resetForm('form')">
              重置
            </el-button> -->
          </el-form-item>
        </el-form>
      </el-main>
    </div>
  </div>
</template>

<script>
import { getUserById } from '@/api/user'
// import { addUser, editUser } from '@/api/user'
export default {
  name: 'AddEscort',
  data() {
    return {
      isEdit: false,
      form: {},
      content: '',
      id: '',
      rules: {
        nickName: [
          { message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个汉字或字母', trigger: 'blur' },
        ],
        userPhone: [
          { message: '请输入联系电话', trigger: 'blur' },
          { min: 2, max: 32, message: '长度11位数字', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    if (this.$route.query.id) {
      this.isEdit = this.$route.query.edit
      this.title = this.isEdit ? '编辑用户' : '查看用户'
      // this.editFlag = false
      this.id = this.$route.query.id
      this.getUserById()
    } else {
      // this.title = '新增用户'
      // this.form = {}
    }
  },
  activated() {
  },
  methods: {
    // 查询用户详情
    async getUserById() {
      const res = await getUserById({
        userId: this.id,
      })
      this.form = res.body
    },
    // 查看用户
    // async addUser() {
    //   const res = await addUser({
    //     userPhone: this.form.userPhone,
    //     password: CryptoJS.encrypt(this.form.password),
    //     userType: this.form.userType,
    //     sex: this.form.sex,
    //     nickName: this.form.nickName,
    //     address: this.form.address,
    //   })
    //   this.$refs.table.getEscortList()
    //   this.$message({
    //     message: res.head.msg,
    //     type: 'success',
    //   })
    // },

    // 编辑用户信息
    // async editUser() {
    //   const res = await editUser({
    //     userId: this.form.id,
    //     userPhone: this.form.userPhone,
    //     userType: this.form.userType,
    //     sex: this.form.sex,
    //     nickName: this.form.nickName,
    //     address: this.form.address,
    //   })
    //   this.$message({
    //     message: res.head.msg,
    //     type: 'success',
    //   })
    //   this.$refs.table.getUsers()
    // },
    // 提交
    async submitForm(formName) {
      await this.$refs[formName].validate()
      await (!this.isEdit ? this.addUser() : this.editUser())
      this.$router.back()
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
