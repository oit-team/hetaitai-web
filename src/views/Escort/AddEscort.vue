<template>
  <div>
    <div class="container main m-auto">
      <header class="flex justify-between items-center">
        <el-page-header :content="editFlag ? '新增陪诊员' : '编辑陪诊员'" @back="$router.go(-1)">
        </el-page-header>
      </header>
      <el-divider></el-divider>
      <el-main style="width:50%;">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="form.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" placeholder="请选择性别">
              <el-option label="男" :value="0"></el-option>
              <el-option label="女" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="form.userType" placeholder="请选择用户类型">
              <el-option label="管理" :value="1"></el-option>
              <el-option label="陪诊陪检人员" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="editFlag" label="初始密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('form')">
              保存
            </el-button>
            <el-button v-if="editFlag" type="success" size="small" icon="el-icon-refresh" @click="resetForm('form')">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </div>
  </div>
</template>

<script>
import CryptoJS from '@/utils/crypto'
import { addEscortList, editEscortList, getEscortListById } from '@/api/escort'
export default {
  name: 'AddEscort',
  data() {
    return {
      editFlag: true,
      form: {},
      content: '',
      id: '',
      rules: {
        nickName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个汉子或英文', trigger: 'blur' },
        ],
        userPhone: [
          { required: true, message: '请输入正确联系电话且长度11位数字', trigger: 'blur' },
        ],
        userType: [
          { required: true, message: '请输入用户类型', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    if (this.$route.query.id) {
      this.title = '编辑陪诊员'
      this.editFlag = false
      this.id = this.$route.query.id
      this.getEscortListById()
    } else {
      this.title = '新增陪诊员'
      this.form = {}
    }
  },
  activated() {
  },
  methods: {
    // 查询陪诊员详情
    async getEscortListById() {
      const res = await getEscortListById({
        userId: this.id,
      })
      this.form = res.body
    },
    // 新增陪诊员
    async addEscortList() {
      await addEscortList({
        userPhone: this.form.userPhone,
        password: this.form.password && CryptoJS.encrypt(this.form.password),
        userType: this.form.userType,
        sex: this.form.sex,
        nickName: this.form.nickName,
        address: this.form.address,
      })
      this.$message({
        message: '新增成功!',
        type: 'success',
      })
    },
    // 编辑陪诊员信息
    async editEscortList() {
      await editEscortList({
        userId: this.form.id,
        userPhone: this.form.userPhone,
        userType: this.form.userType,
        sex: this.form.sex,
        nickName: this.form.nickName,
        address: this.form.address,
      })
      this.$message({
        message: '修改成功!',
        type: 'success',
      })
    },
    // 提交
    async submitForm(formName) {
      await this.$refs[formName].validate()
      await (this.editFlag ? this.addEscortList() : this.editEscortList())
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
