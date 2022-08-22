<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle" style="h-full flex flex-col">
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
      formData: {
        pageNum: 1,
        pageSize: 20,
        orderUser: '',
        orderNo: '',
        escortId: '',
        userType: 2,
      },
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getOrderList,
        actions: [
          {
            name: '新增用户',
            type: 'success',
            icon: 'el-icon-plus',
            click: scope => this.$router.push({
              name: 'AddUser',
            }),
          },
        ],
        table: {
          // data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '查看',
                type: 'primary',
                icon: 'el-icon-view',
                click: scope => this.$router.push({
                  name: 'AddUser',
                  query: {
                    item: scope,
                    edit: false,
                  },
                }),
              },
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: scope => this.$router.push({
                  name: 'AddUser',
                  query: {
                    item: scope,
                    edit: true,
                  },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: scope => this.deleteUser(scope),
              },
            ],
          },
        },
        pager: {
          // total: this.data.count,
        },
      }
    },
  },
  methods: {
    async getOrderList() {
      const res = await getOrderList({
        ...this.formData,
      })
      console.log(res)
      console.log(this.data)
      this.data = res.body
    },
    addUser() {
    },
    // deleteUser(scope) {
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(async () => {
    //     await axios.post({
    //       url: '/api/system/user/delUser',
    //       data: {
    //         head: {
    //           aid: localStorage.getItem('userId'),
    //           ver: '1.0',
    //           ln: 'cn',
    //           mod: 'app',
    //           de: '2019-10-16',
    //           sync: 1,
    //           chcode: 'ef19843298ae8f2134f',
    //         },
    //         con: {
    //           userId: scope.row.id,
    //         },
    //       },
    //     }).then((res) => {
    //       console.log(res)
    //     })
    //   })
    // },
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
