<template>
  <div>
    <div class="container main m-auto">
      <header class="flex justify-between items-center">
        <el-page-header :content="title" @back="$router.go(-1)">
        </el-page-header>
      </header>
      <el-divider></el-divider>
      <el-main style="width:80%;">
        <el-descriptions title="基础信息" :column="3" :size="size">
          <template slot="extra">
            <el-button type="primary" size="small">
              操作
            </el-button>
          </template>
          <el-descriptions-item label="下单人">
            {{ form.orderUser }}
          </el-descriptions-item>
          <el-descriptions-item label="陪诊人">
            {{ form.escortId }}
          </el-descriptions-item>
          <el-descriptions-item label="订单编号">
            {{ form.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item label="上门金额">
            {{ form.specificMoney }}
          </el-descriptions-item>
          <el-descriptions-item label="服务金额">
            {{ form.orderMoney }}
          </el-descriptions-item>
          <el-descriptions-item label="订单总金额">
            {{ form.orderTotalMoney }}
          </el-descriptions-item>
          <el-descriptions-item label="下单时间">
            {{ form.orderTime }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag size="small">
              {{ form.orderState }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="接单状态">
            <el-tag size="small">
              {{ form.orderState }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="订单备注">
            暂无
          </el-descriptions-item>
        </el-descriptions>
        <div>
          <el-card v-if="form.specificService" class="box-card">
            <div slot="header" class="clearfix">
              <span>专项服务</span>
              <el-button style="float: right; padding: 3px 0" type="text">
                操作按钮
              </el-button>
            </div>
            <div class="text item">
              <el-descriptions class="margin-top" :column="3" :size="size">
                <el-descriptions-item label="客户姓名">
                  {{ form.customerName }}
                </el-descriptions-item>
                <el-descriptions-item label="联系电话">
                  {{ form.customerPhone }}
                </el-descriptions-item>
                <el-descriptions-item label="上门时间">
                  {{ form.customerDoorTime }}
                </el-descriptions-item>
                <el-descriptions-item label="上门地址">
                  {{ form.customerAddress || '暂无' }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
          <el-empty v-else description="暂无专项服务"></el-empty>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
import { getCustomerOrderById } from '@/api/order'
export default {
  name: 'CheckOrder',
  data() {
    return {
      size: '',
      isEdit: '',
      form: {},
      content: '',
      orderNo: '',
    }
  },
  created() {
    console.log(this.$store.state.userInfo.userType)
    if (this.$route.query.item) {
      this.title = '订单详情'
      this.orderNo = this.$route.query.item.orderNo
      this.getCustomerOrderById()
    }
  },
  activated() {
  },
  methods: {
    // 查询用户详情
    async getCustomerOrderById() {
      const res = await getCustomerOrderById({
        orderNo: this.orderNo,
      })
      this.form = res.body
    },

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
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       if (!this.isEdit) {
    //         // this.addUser()
    //       } else {
    //         this.editUser()
    //       }
    //       this.$router.back()
    //     } else {
    //       return false
    //     }
    //   })
    // },
  },
}
</script>

<style lang='scss' scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    margin-top: 30px;
  }
</style>
