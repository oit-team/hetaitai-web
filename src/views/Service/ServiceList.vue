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
import axios from 'axios'

export default {
  name: 'ServiceList',
  data() {
    return {
      data: {},
      formData: {
        pageNum: 1,
        pageSize: 20,
        serviceNo: '',
        serviceName: '',
        serviceType: '',
        specificService: '',
      },
      resultList: [],
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getData,
        actions: [
          {
            name: '新增菜单',
            type: 'success',
            icon: 'el-icon-plus',
            // click: this.addUser,
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
                // click: (scope) => this.$router.push({
                //   path: '/system/menuList/AddMneu',
                //   query: { item: scope },
                // }),
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
        // selectionItem: true,
        // selection: true,
      }
    },
  },
  created() {
  },
  methods: {
    async getData() {
      await axios({
        url: '/api/goods/serviceInfo/getServices',
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
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
