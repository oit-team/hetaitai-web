<template>
  <div id="addTrain" class="pageCommonStyle h-full">
    <el-page-header :content="isAdd ? '新增培训计划' : '编辑培训计划'" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      style="width:70%;"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="培训标题" prop="titleName">
        <el-input v-model="ruleForm.titleName" maxlength="10" placeholder="请选择培训标题"></el-input>
      </el-form-item>
      <el-form-item label="培训内容" prop="trainingContent">
        <el-input v-model="ruleForm.trainingContent" maxlength="10" placeholder="请选择培训内容"></el-input>
      </el-form-item>
      <el-form-item label="培训时间">
        <el-date-picker
          v-model="ruleForm.trainTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="培训成员">
        <el-table
          ref="multipleTable"
          :data="sysUserList.filter(data => data)"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="userId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            reserve-selection
          >
          </el-table-column>
          <el-table-column
            prop="userId"
            label="编号"
            width="260"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
            width="150"
          >
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="userPhone"
          >
          </el-table-column>
          <el-table-column
            align="right"
          >
            <template slot="header">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入姓名或手机号搜索"
                @input="selectUserDatasList"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="sysUserListCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">
          保存
        </el-button>
        <el-button v-if="isAdd" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addTraining, getSysUserList, getTrainingById, updateTraining } from '@/api/training'

export default {
  name: 'AddTrain',
  components: {},
  data() {
    return {
      search: '',
      currentPage: 1,
      isAdd: true,
      title: '',

      ruleForm: {
        titleName: '',
        trainingContent: '',
        trainTime: '',
      },
      multipleSelection: [], // 已选护工id
      sysUserList: [], // 总护工列表
      sysUserListCount: null,
      trainingSysUserList: [], // 已选护工列表

      pageNum: 1,
      pageSize: 20,

      rules: {
        titleName: [
          { required: true, message: '请输入培训标题', trigger: 'blur' },
        ],
        trainingContent: [
          { required: true, message: '请输入培训内容', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.title = '编辑培训'
      this.isAdd = false
    } else {
      this.title = '新增培训'
      this.ruleForm = {}
    }
    this.initData()
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    async initData() {
      const id = this.$route.query.id
      await this.getSysUserList(id || 0)
      if (id) await this.getTrainingById(id)
    },
    // 获取护工列表
    async getSysUserList(id) {
      const res = await getSysUserList({
        trainingId: id,
        userName: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
      this.sysUserList = res.body.sysUserList
      this.sysUserListCount = res.body.count
      this.trainingSysUserList = res.body.trainingSysUserList
    },
    selectUserDatasList() {
      const id = this.$route.query.id
      this.getSysUserList(id || 0)
    },
    handleSelectionChange(val) {
      const selectList = []
      val.forEach((item) => {
        selectList.push(item.userId)
      })
      this.multipleSelection = selectList
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSysUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageNum = val
      this.getSysUserList()
    },
    goBack() {
      this.$router.go(-1)
    },

    async addTraining() {
      const res = await addTraining({
        ...this.ruleForm,
        startTime: this.ruleForm.trainTime[0],
        endTime: this.ruleForm.trainTime[1],
        trainingUserList: this.multipleSelection,
      })
      this.$message({
        message: res.head.msg,
        type: 'success',
      })
    },

    async updateTraining() {
      const res = await updateTraining({
        ...this.ruleForm,
        startTime: this.ruleForm.trainTime[0],
        endTime: this.ruleForm.trainTime[1],
        trainingUserList: this.multipleSelection,
        trainingId: this.$route.query.id,
      })
      this.$message({
        message: res.head.msg,
        type: 'success',
      })
    },

    async getTrainingById(id) {
      const res = await getTrainingById({
        trainingId: id,
      })
      this.ruleForm = res.body
      this.$set(this.ruleForm, 'trainTime', [this.ruleForm.startTime, this.ruleForm.endTime])

      // 匹配userId 并勾选
      const selectData = this.trainingSysUserList
      if (selectData) {
        const userIds = this.sysUserList.map(({ userId }) => userId)
        selectData.forEach((row) => {
          const index = userIds.indexOf(row)
          if (~index) {
            this.$refs.multipleTable.toggleRowSelection(this.sysUserList[index], true)
          }
        })
      }
    },

    async submitForm(formName) {
      await this.$refs[formName].validate()
      await (this.isAdd ? this.addTraining() : this.updateTraining())
      this.$router.back()
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.multipleTable.clearSelection()
    },
  },
}
</script>

<style lang="scss" scoped>
#addRole{
  min-height: 82vh;
}
</style>
