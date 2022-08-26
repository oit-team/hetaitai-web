<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto>
          <template #content:orderState="{ row }">
            <el-tag v-if="row.orderState === '未支付'" type="danger">
              {{ row.orderState }}
            </el-tag>
            <el-tag v-if="row.orderState === '待分配'" type="warning">
              {{ row.orderState }}
            </el-tag>
            <el-tag v-if="row.orderState === '服务中'" type="success">
              {{ row.orderState }}
            </el-tag>
          </template>
          <template #content:distributionState="{ row }">
            <el-tag v-if="row.distributionState === '未分配'" type="danger">
              {{ row.distributionState }}
            </el-tag>
            <el-tag v-if="row.distributionState === '已分配'" type="warning">
              {{ row.distributionState }}
            </el-tag>
            <el-tag v-if="row.distributionState === '已接单'" type="success">
              {{ row.distributionState }}
            </el-tag>
          </template>
        </TablePage>
      </div>
    </main>
    <el-drawer
      ref="drawer"
      custom-class="demo-drawer"
      title="下发订单"
      :visible.sync="drawer"
      direction="rtl"
      size="45%"
    >
      <div class="h-full flex flex-col py-3 px-4">
        <TablePage v-bind="allotTablePageOption" ref="allotTable" class="allot-table">
          <template #content:distributionState="{ row }">
            <el-tag v-if="row.distributionState === '未分配'" type="danger">
              {{ row.distributionState }}
            </el-tag>
            <el-tag v-if="row.distributionState === '已分配'" type="warning">
              {{ row.distributionState }}
            </el-tag>
            <el-tag v-if="row.distributionState === '已接单'" type="success">
              {{ row.distributionState }}
            </el-tag>
          </template>
        </TablePage>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getOrderList, updateDistributionState } from '@/api/order'
import { getUserList } from '@/api/user'
export default {
  name: 'OrderList',
  data: () => {
    return {
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
      drawer: false,
      orderNo: '',
      // checkedEscortInfo: '',
      // escortForm: {},
      // escortList: [],
      pageNum: 1,
      pageSize: 20,

    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getOrderList,
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
                    item: row,
                  },
                }),
              },
              {
                tip: '下发',
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
                click: ({ row }) => this.deleteOrder,
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
            width: 160,
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
    this.getOrderList()
  },
  activated() {
    this.getOrderList()
  },
  methods: {
    // 设置下发订单文本域
    setAllotTableField() {
      console.log(this.$refs.allotTable)
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
      }])
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
      return !(row.distributionState === '未分配' && row.orderState === '待分配' && this.$store.state.userInfo.userType === 1)
    },
    // 点击下发订单按钮
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
      const res = await updateDistributionState({
        distributionState: '2',
        orderNo: this.orderNo,
        distributionId: row.userId,
      })
      if (res.head.status === 0) {
        this.$refs.allotTable.loadData()
        this.$message({
          message: '分配成功!',
          type: 'success',
        })
        this.drawer = false
      } else {
        this.$message({
          message: res.head.msg,
          type: 'warning',
        })
      }
    },
    // drawer点击确定
    // confirm() {
    //   console.log('点击了确定')
    //   if (this.escortForm.nickName) {
    //     this.checkedEscortInfo = this.escortList.filter((item) => {
    //       return this.escortForm.nickName.includes(item.nickName)
    //     })
    //     console.log('选中的陪检员信息', this.checkedEscortInfo)
    //     this.updateDistributionState()
    //     // this.getOrderList()
    //     this.$refs.table.doLayout()
    //     this.drawer = false
    //   }
    // },
    // drawer点击取消
    // cancelForm() {
    //   console.log('点击了取消')
    //   this.escortForm = ''
    //   this.$message({
    //     message: '取消分配',
    //     type: 'success',
    //   })
    //   this.drawer = false
    // },
    // onSubmit() {
    //   console.log('submit!')
    // },
    // deleteOrder() {},
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
