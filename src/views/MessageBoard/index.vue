<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col" style="width:90%">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto></TablePage>
      </div>
    </main>
  </div>
</template>

<script>
import { getMessageList } from '@/api/message.js'

export default {
  name: 'MessageBoard',
  data() {
    return {
      data: {},
      formData: {
        pageNum: 1,
        pageSize: 20,
      },
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getMessageList,
        table: {
          data: this.data.resultList,
        },
        pager: {
          total: this.data.count,
        },
      }
    },
  },
  mounted() {
    this.getMessageList()
  },
  methods: {
    // 获取留言列表
    async getMessageList(params) {
      const res = await getMessageList({
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
