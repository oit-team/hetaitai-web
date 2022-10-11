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
import { delTraining, getTrainList } from '@/api/training'

// 培训状态
// const TRAIN_STATE = {
//   // 待开始
//   PENDING_START: 1,
//   // 培训中
//   TRAINING: 2,
//   // 已结束
//   END: 4,
// }

export default {
  name: 'TrainingList',
  components: {
  },
  data: () => {
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
        promise: this.getTrainList,
        actions: [
          {
            name: '新增培训计划',
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
  },
  methods: {
    // 获取培训成员列表
    async getTrainList(params) {
      const res = await getTrainList({
        ...this.formData,
        ...params,
      })
      this.data = res.body
      this.$refs.table.doLayout()
    },

    // 删除培训
    async delTraining({ row }) {
      const res = await delTraining({
        trainingId: row.id,
      })
      this.getTrainList()
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
