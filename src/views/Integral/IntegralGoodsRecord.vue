<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto>
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
      data: {
        data: {},
        formData: {
          workerName: '',
          goodsName: '',
          startcreateTime: '',
          endcreateTime: '',
          pageSize: 20,
          pageNum: 1,
        },
      },
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getData,
        table: {
          data: this.data.result,
          actions: {
            width: 180,
          },
        },
        pager: {
          total: this.data.count,
        },
      }
    },
  },
  methods: {
    getData(params) {
      getGoodsExchangeRecord({
        ...this.formData,
        ...params,
      }).then((res) => {
        if (res.head.status === 0) {
          this.data = res.body
        } else {
          this.$message(res.head.msg)
        }
      }).catch(() => {
        this.$message('查询失败')
      })
    },
    deleteOrder() {
    },
  },
}
</script>

<style scoped>

</style>
