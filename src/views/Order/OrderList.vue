<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto></TablePage>
      </div>
    </main>
    <el-drawer
      ref="drawer"
      custom-class="demo-drawer"
      title="下发订单"
      :visible.sync="drawer"
      direction="rtl"
    >
      <div class="demo-drawer__content py-3 px-4">
        <el-form :model="escortForm">
          <el-form-item label="分配人：" prop="nickName">
            <el-select v-model="escortForm.nickName" placeholder="请选择要分配的人员">
              <el-option v-for="item in escortList" :key="item.id" :label="item.nickName" :value="item.nickName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button size="small" @click="cancelForm">
            取 消
          </el-button>
          <el-button size="small" type="primary" @click="confirm()">
            确定
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getOrderList, updateDistributionState } from '@/api/order'
import { getEscortList } from '@/api/escort'
export default {
  name: 'OrderList',
  data: () => {
    return {
      data: {},
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
      checkedEscortInfo: '',
      escortForm: {},
      escortList: [],
      // rules: {
      //   nickName: [
      //     { required: true, message: '请选择接单人', trigger: 'change' },
      //   ],
      // },
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
                icon: 'el-icon-position',
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
  },
  created() {
    this.getOrderList()
  },
  activated() {
    this.getOrderList()
  },
  methods: {
    // 查询订单
    async getOrderList(params) {
      const res = await getOrderList({
        ...this.formData,
        ...params,
      })
      this.data = res.body
    },
    // 是否禁用
    isDisabled({ row }) {
      return !(row.distributionState === '未分配' && row.orderState === '待分配' && this.$store.state.userInfo.userType === 1)
    },
    // 分配订单
    allocationOrder({ row }) {
      this.orderNo = row.orderNo
      this.drawer = true
      this.getEscortList()
    },
    // 查询陪检员列表
    async getEscortList() {
      const res = await getEscortList({
        pageNum: 1,
        pageSize: 999,
        userType: 2,
      })
      this.escortList = res.body.resultList
    },
    // 分配陪检员
    async updateDistributionState() {
      const res = await updateDistributionState({
        distributionState: '2',
        orderNo: this.orderNo,
        distributionId: (this.checkedEscortInfo[0].id).toString(),
      })
      console.log('点击确定分配陪检员', res)
      if (res.head.status === 0) {
        this.$message({
          message: '分配成功',
          type: 'success',
        })
      } else {
        this.$message({
          message: res.head.msg,
          type: 'success',
        })
      }
    },
    // drawer点击确定
    confirm() {
      console.log('点击了确定')
      if (this.escortForm.nickName) {
        this.checkedEscortInfo = this.escortList.filter((item) => {
          return this.escortForm.nickName.includes(item.nickName)
        })
        console.log('选中的陪检员信息', this.checkedEscortInfo)
        this.updateDistributionState()
        this.getOrderList()
        this.drawer = false
      }
    },
    // drawer点击取消
    cancelForm() {
      console.log('点击了取消')
      this.escortForm = ''
      this.$message({
        message: '取消分配',
        type: 'success',
      })
      this.drawer = false
    },
    // deleteOrder() {},
  },
}
</script>

<style lang='scss' scoped>

</style>
