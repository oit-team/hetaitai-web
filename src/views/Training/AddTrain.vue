<template>
  <div id="addTrain" class="pageCommonStyle h-full">
    <el-page-header :content="isAdd ? '新增培训' : '编辑培训'" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div class="content-left w-3/5">
        <el-form-item class="mb-8" label="培训标题" prop="titleName">
          <el-input v-model="ruleForm.titleName" maxlength="10" placeholder="请输入培训标题"></el-input>
        </el-form-item>
        <el-form-item class="mb-8" label="培训内容" prop="trainingContent">
          <el-input v-model="ruleForm.trainingContent" maxlength="10" placeholder="请输入培训内容"></el-input>
        </el-form-item>
        <el-form-item class="mb-8" label="培训时间">
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
        <el-form-item>
          <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">
            保存
          </el-button>
          <el-button v-if="isAdd" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
            重置
          </el-button>
        </el-form-item>
      </div>
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

      pageNum: 1,
      pageSize: 10,

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
      this.getTrainingById(id)
    } else {
      this.title = '新增培训'
      this.ruleForm = {}
    }
  },
  methods: {

    goBack() {
      this.$router.go(-1)
    },

    async addTraining() {
      const res = await addTraining({
        ...this.ruleForm,
        startTime: this.ruleForm.trainTime[0],
        endTime: this.ruleForm.trainTime[1],
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
