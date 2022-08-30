<template>
  <div class="he-page">
    <div></div>
    <div class="w-1/4 flex justify-center">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item prop="name">
          <el-input v-model="form.userPhone" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" show-password prefix-icon="el-icon-lock" @change="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" @click="login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import crypto from '@/utils/crypto'
import { login } from '@/api/login'

export default {
  name: 'Login',
  data: () => ({
    form: {
      userPhone: '',
      password: '',
    },
    rules: {
      userPhone: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
    },
  }),
  created: {
  },
  methods: {
    async login() {
      const res = await login({
        userPhone: this.form.userPhone,
        password: crypto.encrypt(this.form.password),
      })
      this.$store.commit('changeUserInfo', res.body.resultList)
      localStorage.setItem('token', res.body.token)
      localStorage.setItem('userId', res.body.resultList.id)
      this.$router.push({
        name: 'ServiceList',
      })
    },
  },
}
</script>

<style lang='scss' scoped>
.he-page{
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100vh;
}
</style>
