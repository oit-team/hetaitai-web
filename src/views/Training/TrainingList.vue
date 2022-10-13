<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto></TablePage>
      </div>
    </main>

    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      direction="rtl"
      size="42%"
    >
      <el-tabs v-model="tabsIndex" class="py-3 px-4" @tab-click="changeTabs">
        <el-tab-pane label="已选成员" name="2" lazy>
        </el-tab-pane>
        <el-tab-pane label="未选成员" name="1" lazy>
        </el-tab-pane>
      </el-tabs>

      <div class="handle-table">
        <TablePage v-bind="checkTablePageOption" ref="checkedTable" auto></TablePage>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addTrainingUser, delTraining, delTrainingUser, getSysUserList, getTrainList } from '@/api/training'

export default {
  name: 'TrainingList',
  components: {
  },
  data: () => {
    return {
      drawer: false,
      data: {},
      checkedData: {},
      unCheckedData: {},
      formData: {
        pageNum: 1,
        pageSize: 20,
      },
      userId: null,
      tabsIndex: '2',
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getTrainList,
        actions: [
          {
            name: '新增培训',
            type: 'success',
            icon: 'el-icon-plus',
            to: '/trainingList/addTrain',
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
                  path: '/trainingList/addTrain',
                  query: { id: row.id },
                }),
              },
              {
                tip: '指配成员',
                type: 'success',
                icon: 'el-icon-thumb',
                click: this.getTabUserList,
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.delTraining,
                disabled: ({ row }) => row.trainingState !== 0,
              },
            ],
          },
        },
        pager: {
          total: this.data.count,
        },
      }
    },

    checkTablePageOption() {
      return {
        promise: this.getcheckedUserList,
        actions: [
          {
            name: '保存',
            type: 'primary',
            click: this.saveUserInfo,
          },
        ],
        table: {
          rowKey: 'userId',
          reserveSelection: true,
          selection: true,
          data: this.checkedData.sysUserList,
          actions: {
            width: 180,
          },
        },
        pager: {
          total: this.checkedData.count,
        },
      }
    },
  },
  methods: {
    // 设置成员文本域
    setCheckedTableField() {
      this.$refs.checkedTable.setFields([{
        fieldKey: 'userName',
        fieldName: '姓名',
        fieldType: '文本',
      },
      {
        fieldKey: 'userPhone',
        fieldName: '手机号',
        fieldType: '文本',
      }])
    },

    // 获取培训列表
    async getTrainList(params) {
      const res = await getTrainList({
        ...this.formData,
        ...params,
      })
      this.data = res.body
      this.$refs.table.doLayout()
    },

    // 删除培训
    delTraining({ row }) {
      this.$confirm('确定删除该计划', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }).then(async () => {
        const res = await delTraining({
          trainingId: row.id,
        })
        this.getTrainList()
        this.$message.success(res.head.msg)
      }).catch(() => {})
    },

    // 点击打开分配成员
    getTabUserList({ row }) {
      this.userId = row.id
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.checkedTable.clearSelection()
        this.setCheckedTableField()
      })
    },

    // 获取成员
    async getcheckedUserList(params) {
      const res = await getSysUserList({
        ...params,
        trainingId: this.userId,
        codeType: this.tabsIndex,
      })
      this.checkedData = res.body
    },

    // tabs改变
    changeTabs() {
      this.$refs.checkedTable.resetForm()
      this.$refs.checkedTable.clearSelection()
      this.checkedData = {}
      this.$refs.checkedTable.loadData()
    },

    // 新增成员
    async addTrainingUser(checkedeIds) {
      await addTrainingUser({
        trainingId: this.userId,
        trainingUserList: checkedeIds,
      })
    },

    // 删除成员
    async delTrainingUser(checkedeIds) {
      await delTrainingUser({
        trainingId: this.userId,
        trainingUserList: checkedeIds,
      })
    },

    saveUserInfo() {
      const checkedeIds = this.$refs.checkedTable.selected.map(({ userId }) => userId)
      this.$confirm('确定保存吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (this.tabsIndex === '2') {
          this.delTrainingUser(checkedeIds)
        } else {
          this.addTrainingUser(checkedeIds)
        }
        this.changeTabs()
        this.drawer = false
        this.$message({
          type: 'success',
          message: '保存成功!',
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保存',
        })
      })
    },

  },
}
</script>

<style lang='scss' scoped>
.handle-table{
  height: calc(100% - 100px);
  ::v-deep .el-form{
    grid-template-columns: repeat(2, 1fr)
  }
}
::v-deep .table-page{
  padding: 5px 10px;
}
</style>
