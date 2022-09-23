<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto>
          <template #content:orderState="{ row }">
            <el-tag :type="getStateColor(row.orderStateKey, 'order')">
              {{ row.orderState }}
            </el-tag>
          </template>
        </TablePage>
      </div>
    </main>
    <el-drawer
      ref="drawer"
      custom-class="demo-drawer"
      title="分配订单"
      :visible.sync="drawer"
      direction="rtl"
      size="45%"
    >
      <div class="h-full flex flex-col py-3 px-4">
        <TablePage v-bind="allotTablePageOption" ref="allotTable" class="allot-table">
          <template #content:userServiceStateName="{ row }">
            <el-tag :type="getStateColor(row.userServiceState, 'service')">
              {{ row.userServiceStateName }}
            </el-tag>
          </template>
        </TablePage>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { dictitemInfoAllMethod, getOrderList, updateDistributionState } from '@/api/order'
import { getUserList } from '@/api/user'

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

// 接单状态
const SERVICE_STATE = {
  // 待接单
  PENDING_ORDER: 1,
  // 已接单
  RECEIVED: 2,
  // 已完成
  COMPLETED: 3,
  /// 已取消
  TIMEOUT: 4,
}

export default {
  name: 'OrderList',
  data: () => {
    return {
      ORDER_STATE,
      SERVICE_STATE,
      drawer: false,

      data: {},
      allotData: {},
      formData: {
        pageNum: 1,
        pageSize: 20,
        orderUser: '',
        orderNo: '',
        escortId: '',
        orderState: '',
        distributionState: '',
      },
      orderNo: '',
      orderSatusList: [], // 订单状态列表
      distributionStateList: [], // 接单状态列表
      newDistributionStateList: [],
      pageNum: 1,
      pageSize: 20,

    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getOrderList,
        search: {
          fieldProps: {
            // 订单状态
            orderState: {
              options: this.newOrderSatusList,
            },
            // 接单状态
            distributionState: {
              options: this.newDistributionStateList,
            },
          },
        },
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '查看',
                type: 'primary',
                icon: 'el-icon-view',
                click: ({ row }) => this.$router.push({
                  name: 'CheckOrder',
                  query: {
                    orderNo: row.orderNo,
                  },
                }),
              },
              {
                tip: '分配',
                type: 'success',
                icon: 'el-icon-thumb',
                disabled: this.isDisabled,
                click: this.allocationOrder,
              },
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                disabled: true,
                click: ({ row }) => this.$router.push({
                  name: 'CheckOrder',
                  query: {
                    item: row,
                  },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                disabled: true,
                click: this.deleteOrder,
              },
            ],
          },
        },
        pager: {
          total: this.data.count,
        },
      }
    },
    allotTablePageOption() {
      return {
        promise: this.getUserList,
        table: {
          data: this.allotData.resultList,
          actions: {
            width: 100,
            buttons: [
              {
                tip: '分配',
                type: 'success',
                icon: 'el-icon-position',
                click: this.updateDistributionState,
              },
            ],
          },
        },
        pager: {
          total: this.allotData.count,
        },
      }
    },
  },
  created() {
    this.getOrderSatusList()
    this.getDistributionStateList()
  },
  activated() {
    this.$refs.table.loadData()
    this.$refs.allotTable.loadData()
    this.getOrderList()
  },
  methods: {
    getStateColor(state, type) {
      let map = {}

      if (type === 'order') {
        map = {
          danger: [ORDER_STATE.PENDING_PAY, ORDER_STATE.UNASSIGNED],
          success: [ORDER_STATE.COMPLETED, ORDER_STATE.SERVING],
          warning: [ORDER_STATE.CANCELLED, ORDER_STATE.REFUNDED],
        }
      } else {
        map = {
          danger: [SERVICE_STATE.PENDING_ORDER],
          success: [SERVICE_STATE.COMPLETED, SERVICE_STATE.RECEIVED],
          warning: [SERVICE_STATE.TIMEOUT],
        }
      }

      let color = ''
      Object.entries(map).forEach(([k, v]) => {
        if (v.includes(state)) color = k
      })

      return color
    },
    // 设置分配订单文本域
    setAllotTableField() {
      this.$refs.allotTable.setFields([{
        fieldKey: 'nickName',
        fieldName: '真实姓名',
        fieldType: '文本',
      },
      {
        fieldKey: 'userPhone',
        fieldName: '联系电话',
        fieldType: '文本',
      },
      {
        fieldKey: 'userServiceStateName',
        fieldName: '接单状态',
        fieldType: '文本',
        noSearchShow: true,
      },
      {
        fieldKey: 'workingStateName',
        fieldName: '上班状态',
        fieldType: '文本',
        noSearchShow: true,
      }])
    },

    // 根据字典项查询订单状态
    async getOrderSatusList() {
      const res = await dictitemInfoAllMethod({
        type: 'ORDER_STATE',
      })
      this.orderSatusList = res.body.result
      this.newOrderSatusList = this.orderSatusList.map(item => ({
        optionKey: item.dictitemCode,
        optionValue: item.remark,
      }))
    },

    // 根据字典项查询接单状态
    async getDistributionStateList() {
      const res = await dictitemInfoAllMethod({
        type: 'DISTRIBUTION_STATE',
      })
      this.distributionStateList = res.body.result

      this.newDistributionStateList = this.distributionStateList.map(item => ({
        optionKey: item.dictitemCode,
        optionValue: item.remark,
      }))
    },

    // 查询订单列表
    async getOrderList(params) {
      const res = await getOrderList({
        ...this.formData,
        ...params,
      })
      this.data = res.body
    },

    // 下发按钮是否禁用
    isDisabled({ row }) {
      return !(row.isSend === 1 && row.orderStateKey === 2)
    },

    // 点击分配订单按钮
    allocationOrder({ row }) {
      this.orderNo = row.orderNo
      this.drawer = true
      this.$nextTick(() => {
        this.setAllotTableField()
        this.$refs.allotTable.loadData()
      })
    },
    // 获取陪检员数据
    async getUserList(params) {
      const res = await getUserList({
        ...params,
      })
      this.allotData = res.body
    },
    // 分配陪检员
    async updateDistributionState({ row }) {
      await updateDistributionState({
        distributionState: '1',
        orderNo: this.orderNo,
        distributionId: row.userId,
      })
      this.$message({
        message: '分配成功!',
        type: 'success',
      })
      this.$refs.table.loadData()
      this.drawer = false
    },
  },
}
</script>

<style lang='scss' scoped>
.allot-table{
  ::v-deep .el-form{
    grid-template-columns: repeat(2, 1fr)
  }
}
</style>
