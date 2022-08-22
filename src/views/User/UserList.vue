<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col">
      <div id="customerList" class="pageCommonStyle" style="height:100%;display: flex;flex-direction: column;">
        <TablePage v-bind="tablePageOption" ref="table" auto></TablePage>
      </div>
    </main>
    <!-- userlist
    <el-button @click="add">
      add
    </el-button> -->
  </div>
</template>

<script>
// import { getUsers } from '@/api/user'
import axios from 'axios'

export default {
  name: 'User',
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
        userType: '',
        sex: '',
        state: '',
      },
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
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
          data: this.data.resultList,
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
          total: this.data.count,
        },
        // selectionItem: true,
        // selection: true,
      }
    },
  },
  methods: {
    async loadData() {
      await axios({
        url: '/api/system/user/getUsers',
        method: 'post',
        data: {
          head: {
            aid: localStorage.getItem('userId'),
            ver: '1.0',
            ln: 'cn',
            mod: 'app',
            de: '2019-10-16',
            sync: 1,
            chcode: 'ef19843298ae8f2134f',
          },
          con: { ...this.formData },
        },
      }).then((res) => {
        if (res.data.head.status === 0) {
          this.data = res.data.body
        } else {
          this.$message.error(res.data.head.msg)
        }
      })
      // getUsers().then((res) => {
      //   console.log(res)
      // }).catch(() => {})
    },
    addUser() {
    },
    deleteUser(scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await axios.post({
          url: '/api/system/user/delUser',
          data: {
            head: {
              aid: localStorage.getItem('userId'),
              ver: '1.0',
              ln: 'cn',
              mod: 'app',
              de: '2019-10-16',
              sync: 1,
              chcode: 'ef19843298ae8f2134f',
            },
            con: {
              userId: scope.row.id,
            },
          },
        }).then((res) => {
          console.log(res)
        })
      })
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
