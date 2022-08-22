<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col">
      <div id="customerList" class="pageCommonStyle" style="height:100%;display: flex;flex-direction: column;">
        <TablePage v-bind="tablePageOption" ref="table" auto></TablePage>
      </div>
    </main>
  </div>
</template>

<script>
import { getEscortList } from '@/api/escort'

export default {
  name: 'EscortList',
  components: {
    // TablePage,
  },
  data: () => {
    return {
      data: {},
      count: '',
      resultList: {},
      formData: {
        pageNum: 1,
        pageSize: 20,
        userPhone: '',
        userType: 2,
        sex: '',
        state: '',
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
                // click: this.deleteUser,
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
    async getEscortList() {
      const res = await getEscortList({
        ...this.formData,
      })
      this.data = res.body
    },
    addUser() {
      // this.$router.push({
      //     name: 'AddEscort',
      //     query: {
      //       item: scope,
      //       edit: false,
      //     },
      //   }),
    },
    deleteUser() {
    },
    add() {
      this.$router.push({
        name: 'addUser',
      })
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
