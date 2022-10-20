<template>
  <div>
    <div class="container main m-auto">
      <header class="flex justify-between items-center">
        <el-page-header :content="title" @back="$router.go(-1)">
        </el-page-header>
      </header>
      <el-divider></el-divider>
      <el-main class="flex flex-col justify-center" style="width:80%;">
        <el-descriptions title="基础信息" :column="3" :size="size">
          <template slot="extra">
            <el-button type="primary" plain size="small" @click="openDistributionRecords">
              分配记录
            </el-button>
          </template>
          <el-descriptions-item label="订单编号">
            {{ form.orderNo || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="下单人">
            {{ form.orderUser || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="陪诊人">
            {{ form.escortId || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="接送金额">
            {{ form.specificMoney || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="服务金额">
            {{ form.orderMoney || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="服务次数">
            {{ form.serviceNum || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="医院名称">
            {{ form.hospitalName || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="订单总金额">
            {{ form.orderTotalMoney || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag size="small" :type="getStateColor(form.orderStateKey)">
              {{ form.orderState || '暂无' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="下单时间">
            {{ form.orderTime || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="订单备注">
            暂无
          </el-descriptions-item>
        </el-descriptions>
        <div>
          <el-card v-if="form.specificService" class="box-card">
            <div slot="header" class="clearfix">
              <span>专项服务</span>
            </div>
            <div class="text item">
              <el-descriptions class="margin-top" :column="3" :size="size">
                <el-descriptions-item label="客户姓名">
                  {{ form.customerName || '暂无' }}
                </el-descriptions-item>
                <el-descriptions-item label="联系电话">
                  {{ form.customerPhone || '暂无' }}
                </el-descriptions-item>
                <el-descriptions-item label="接送地址">
                  {{ form.customerAddress || '暂无' }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
          <el-empty v-else description="暂无专项服务"></el-empty>
        </div>
      </el-main>
      <el-drawer
        title="订单分配记录"
        :visible.sync="drawer"
        :direction="direction"
      >
        <div class="py-3 px-4">
          <div v-if="distributionRecords.length === 0">
            <el-empty description="暂无分配记录" />
          </div>
          <div v-else>
            <div v-for="(item, index) in distributionRecords" :key="index" class="mb-4 text-sm">
              <div class="flex">
                <p class="mr-20">
                  操作人：{{ item.operationId || '暂无' }}
                </p><p class="mr-20">
                  接单人：{{ item.distributionId || '暂无' }}
                </p>
              </div>
              <div>
                <p class="mr-24">
                  <span>当前订单状态：</span><span class="text-red-600">{{ item.stateChange || '暂无' }}</span>
                </p>
                <p class="mr-24">
                  <span>分配时间：</span>{{ item.distributionTime || '暂无' }}
                </p>
                <p class="mr-24">
                  <span>操作时间：</span>{{ item.operationTime || '暂无' }}
                </p>
                <p class="mr-24">
                  <span>接单时间：</span>{{ item.completeTime || '暂无' }}
                </p>
              </div>
              <div v-if="item.remark">
                <p class="mr-24">
                  <span>原因：{{ item.remark }}</span>
                </p>
              </div>
              <el-divider class="!my-2" />
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { getCustomerOrderById, getDistributionRecords } from '@/api/order'

// 订单状态
const ORDER_STATE = {
  // 待支付
  PENDING_PAY: 1,
  // 待分配
  UNASSIGNED: 2,
  // 服务中
  SERVING: 3,
  // 已完成
  COMPLETED: 4,
  // 已取消
  CANCELLED: 5,
  // 已退款
  REFUNDED: 6,
}

export default {
  name: 'CheckOrder',
  data() {
    return {
      ORDER_STATE,

      size: '',
      isEdit: '',
      form: {},
      content: '',
      orderNo: '',
      drawer: false,
      direction: 'rtl',
      distributionRecords: [],
    }
  },
  created() {
    if (this.$route.query.orderNo) {
      this.title = '订单详情'
      this.orderNo = this.$route.query.orderNo
      this.getCustomerOrderById()
    }
  },
  activated() {
  },
  methods: {
    getStateColor(state) {
      const map = {
        danger: [ORDER_STATE.PENDING_PAY, ORDER_STATE.UNASSIGNED],
        success: [ORDER_STATE.COMPLETED, ORDER_STATE.SERVING],
        warning: [ORDER_STATE.CANCELLED, ORDER_STATE.REFUNDED],
      }

      let color = ''
      Object.entries(map).forEach(([k, v]) => {
        if (v.includes(state)) color = k
      })

      return color
    },
    // 查询用户详情
    async getCustomerOrderById() {
      const res = await getCustomerOrderById({
        orderNo: this.orderNo,
      })
      this.form = res.body
    },
    // 点击分配记录
    openDistributionRecords() {
      this.drawer = true
      this.getDistributionRecords()
    },
    // 获取订单分配记录
    async getDistributionRecords() {
      const res = await getDistributionRecords({
        orderNo: this.orderNo,
      })
      this.distributionRecords = res.body.resultList
    },
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
