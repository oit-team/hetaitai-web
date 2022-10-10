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
  </div>
</template>

<script>
import { getGoodsExchangeRecord } from '@/api/integral'

export default {
  name: 'IntegralGoodsRecord',
  data() {
    return {
      newOrderSatusList: [],
      newDistributionStateList: [],
      data: {},
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getData,
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
          data: this.data.result,
          actions: {
            width: 180,
            buttons: [
              // {
              //   tip: '查看',
              //   type: 'primary',
              //   icon: 'el-icon-view',
              //   click: ({ row }) => this.$router.push({
              //     name: 'CheckOrder',
              //     query: {
              //       orderNo: row.orderNo,
              //     },
              //   }),
              // },
              // {
              //   tip: '编辑',
              //   type: 'warning',
              //   icon: 'el-icon-edit',
              //   disabled: true,
              //   click: ({ row }) => this.$router.push({
              //     name: 'CheckOrder',
              //     query: {
              //       item: row,
              //     },
              //   }),
              // },
              // {
              //   tip: '删除',
              //   type: 'danger',
              //   icon: 'el-icon-delete',
              //   disabled: true,
              //   click: this.deleteOrder,
              // },
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
  },
  methods: {
    async getData() {
      const res = await getGoodsExchangeRecord({
        ...this.formData,
      })
      if (res.head.status === 0) {
        console.log(21)
        this.data = res.body
      }
    },
    deleteOrder() {
    },
  },
}
</script>

<style scoped>

</style>
