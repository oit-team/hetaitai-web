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
import { getServicesList } from '@/api/service'

export default {
  name: 'ServiceList',
  data() {
    return {
      data: {},
      formData: {
        serviceNo: '',
        serviceName: '',
        serviceType: '',
        specificService: '',
        pageNum: 1,
        pageSize: 20,
      },
      resultList: [],
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getServicesList,
        table: {
          data: this.data.resultList,
          actions: {
            buttons: [
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  path: '/servicelist/editService',
                  query: { item: row },
                }),
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
  },
  methods: {
    // 获取服务列表
    async getServicesList(params) {
      const res = await getServicesList({
        ...this.formData,
        ...params,
      })
      this.data = res.body
      this.$refs.table.doLayout()
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
