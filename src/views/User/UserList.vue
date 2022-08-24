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
import { delUser, getUsers } from '@/api/user'

export default {
  name: 'UserList',
  components: {
  },
  data: () => {
    return {
      data: {},
      count: '',
      resultList: {},
      formData: {
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
        promise: this.getUsers,
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
                  name: 'AddUser',
                  query: {
                    item: row,
                    edit: false,
                  },
                }),
              },
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'AddUser',
                  query: {
                    item: row,
                    edit: true,
                  },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.delUser,
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
    // 获取用户列表
    async getUsers(params) {
      const res = await getUsers({
        ...this.formData,
        ...params,
      })
      this.data = res.body
      this.$refs.table.doLayout()
    },

    // 删除陪检员
    async delUser({ row }) {
      const res = await delUser({
        userId: row.id,
      })
      this.getUsers()
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
