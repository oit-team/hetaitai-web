<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto></TablePage>
      </div>
    </main>
  </div>
</template>

<script>
import { getOrderList } from '@/api/order'
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
                click: scope => this.deleteUser(scope),
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
  methods: {
    // 查询订单
    async getOrderList(params) {
      const res = await getOrderList({
        ...this.formData,
        ...params,
      })
      this.data = res.body
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
