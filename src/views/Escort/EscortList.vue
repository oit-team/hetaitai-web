<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto></TablePage>
      </div>
    </main>
  </div>
</template>

<script>
import { deleteEscortList, getEscortList } from '@/api/escort'

export default {
  name: 'EscortList',
  components: {
  },
  data: () => {
    return {
      data: {},
      count: '',
      resultList: {},
      formData: {
        userPhone: '',
        userType: '',
        sex: '',
        state: '',
        pageNum: 1,
        pageSize: 20,
      },
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getEscortList,
        actions: [
          {
            name: '新增陪诊员',
            type: 'success',
            icon: 'el-icon-plus',
            to: '/escortlist/addEscort',
          },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  path: '/escortlist/addEscort',
                  query: { item: row },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteEscortList,
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
  methods: {
    // 获取陪检员列表
    async getEscortList(params) {
      const res = await getEscortList({
        ...this.formData,
        ...params,
      })
      this.data = res.body
      this.$refs.table.doLayout()
    },

    // 删除陪检员
    async deleteEscortList({ row }) {
      const res = await deleteEscortList({
        userId: row.id,
      })
      this.getEscortList()
      this.$message({
        message: res.head.msg,
        type: 'success',
      })
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
