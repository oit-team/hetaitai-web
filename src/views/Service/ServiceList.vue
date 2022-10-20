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
import { dictitemInfoAllMethod, getServicesList } from '@/api/service'

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
      serviceTypeList: [],
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getServicesList,
        search: {
          fieldProps: {
            // 服务类型
            serviceType: {
              options: this.newServiceTypeList,
            },
          },
        },
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
                  query: { id: row.id },
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
  mounted() {
    this.getServiceTypeList()
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
    // 根据字典项查询服务类型
    async getServiceTypeList() {
      const res = await dictitemInfoAllMethod({
        type: 'SERVICE_TYPE',
      })
      this.serviceTypeList = res.body.result
      this.newServiceTypeList = this.serviceTypeList.map(item => ({
        optionKey: item.dictitemCode,
        optionValue: item.remark,
      }))
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
