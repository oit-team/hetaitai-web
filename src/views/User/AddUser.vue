<template>
  <div>
    <div class="container main m-auto">
      <header class="flex justify-between items-center">
        <el-page-header :content="content" @back="$router.back()">
        </el-page-header>
        <div v-if="$route.query.edit === true || !$route.query.item">
          <el-button type="primary" @click="submit">
            保存
          </el-button>
        </div>
      </header>
      <el-main>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="form.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" placeholder="性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="form.userType" placeholder="用户类型">
              <el-option label="管理" value="1"></el-option>
              <el-option label="陪诊陪检人员" value="2"></el-option>
              <el-option label="客户" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="初始密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-form>
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddUser',
  data() {
    return {
      form: {
        nickName: '',
        userPhone: '',
        password: '',
        userType: '',
        sex: '',
        address: '',
      },
      content: '',
    }
  },
  created() {
    // edit -> 是否是编辑  有item，则表示不是新增
    this.content = this.$route.query.item && this.$route.query.edit ? '编辑用户' : this.$route.query.item && !this.$route.query.edit ? '查看用户' : '新增用户'
    if (this.$route.query.item) {
      this.form = this.$route.query.item.row
    }
  },
  methods: {
    submit() {
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
