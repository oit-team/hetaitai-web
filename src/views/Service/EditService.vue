<template>
  <div>
    <div class="container main m-auto">
      <header class="flex justify-between items-center">
        <el-page-header :content="editFlag ? '新增服务' : '编辑服务'" @back="$router.go(-1)">
        </el-page-header>
      </header>
      <el-divider></el-divider>
      <el-main style="width:60%;">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-form-item label="服务名称" prop="serviceName">
            <el-input v-model="form.serviceName"></el-input>
          </el-form-item>
          <el-form-item label="服务标题" prop="serviceTitle">
            <el-input v-model="form.serviceTitle"></el-input>
          </el-form-item>
          <el-form-item label="服务类型" prop="serviceType">
            <el-select v-model="form.serviceType" placeholder="请选择服务类型">
              <el-option v-for="item in serverTypeList" :key="item.dictitemCode" :label="item.dicttimeDisplayName" :value="Number(item.dictitemCode)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务价格" prop="servicePrice" disabled="editFlag">
            <el-input v-model="form.servicePrice"></el-input>
          </el-form-item>
          <el-form-item label="服务价格单位" prop="servicePriceUnit">
            <el-select v-model="form.servicePriceUnit" placeholder="请选择服务价格单位">
              <el-option v-for="item in serverPrice" :key="item.dictitemCode" :label="item.dicttimeDisplayName" :value="Number(item.dictitemCode)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上门接送" prop="specificService">
            <el-switch
              v-model="form.specificService"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
          <el-form-item v-if="form.specificService" label="接送金额" prop="serviceSpecificPrice">
            <el-input v-model="form.serviceSpecificPrice"></el-input>
          </el-form-item>
          <el-form-item label="服务内容" prop="serviceContent">
            <el-checkbox-group v-model="checkedServices">
              <el-checkbox
                v-for="(item, index) in serviceContentList"
                :key="index"
                :label="item.remark"
                style="margin-left:10px;"
              >
                <img :src="item.imgUrl">
                <span>{{ item.remark }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="服务对象">
            <el-tag
              v-for="tag in form.serviceObject"
              :key="tag.name"
              closable
              effect="plain"
              style="margin-left:10px;"
              type="info"
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag.name }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              style="width:50%;margin-left:10px;"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              style="margin-left:10px;"
              icon="el-icon-plus"
              size="small"
              type="primary"
              plain
              @click="showInput"
            >
              点击新增服务对象
            </el-button>
          </el-form-item>
          <el-form-item label="电话回访" prop="phoneAccess">
            <el-input v-model="form.phoneAccess"></el-input>
          </el-form-item>
          <el-form-item label="告知流程" prop="informProcess">
            <el-input v-model="form.informProcess" type="textarea" autosize resize="none"></el-input>
          </el-form-item>
          <el-form-item label="服务说明" prop="serviceDescription">
            <el-input v-model="form.serviceDescription" type="textarea" autosize resize="none"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('form')">
              保存
            </el-button>
            <el-button v-if="editFlag" type="success" size="small" icon="el-icon-refresh" @click="resetForm('form')">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </div>
  </div>
</template>

<script>
import { dictitemInfoAllMethod, getServicesListById, updateServices } from '@/api/service'
import { dictitemServiceInfo } from '@/api/dictionaries'
export default {
  name: 'EditService',
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      editFlag: true,
      serverPrice: [], // 价格列表
      serverTypeList: [], // 服务类型
      checkedServices: [], // 选中的服务内容
      serviceContentList: [], // 服务内容列表
      form: {
        serviceName: '',
        serviceDescription: '',
        serviceType: '',
        serviceTitle: '',
        servicePrice: '',
        serviceSpecificPrice: '',
        servicePriceUnit: '',
        specificService: '',
        serviceContent: '',
        serviceObject: '',
        InformProcess: '',
        phoneAccess: '',
      },
      content: '',
      id: '',
      rules: {
        serviceName: [
          { required: true, message: '请填写服务名称', trigger: 'blur' },
        ],
        serviceTitle: [
          { required: true, message: '请填写服务标题', trigger: 'blur' },
        ],
        serviceType: [
          { required: true, message: '请选择服务类型', trigger: 'blur' },
        ],
        servicePrice: [
          { required: true, message: '接送金额要大于0', trigger: 'blur' },
        ],
        servicePriceUnit: [
          { required: true, message: '请选择服务价格单位', trigger: 'blur' },
        ],
        specificService: [
          { required: true, message: '请选择是否上门接送', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    if (this.$route.query.id) {
      this.title = '编辑服务'
      this.editFlag = false
      this.id = this.$route.query.id
      this.getServicesListById()
      this.dictitemServiceInfo()
      this.getServiceTypeList()
    } else {
      this.title = '新增服务'
      this.form = {}
    }
  },
  activated() {
  },
  methods: {
    // 查询服务详情
    async getServicesListById() {
      const res = await getServicesListById({
        serviceId: this.id,
      })
      this.form = res.body
      this.getServicePriceList()
      this.form.serviceId = this.id
      this.form.serviceObject = this.form.serviceObject ? JSON.parse(this.form.serviceObject) : []
      this.form.serviceContent = JSON.parse(this.form.serviceContent)
      this.form.serviceContent.forEach((item) => {
        this.checkedServices.push(item.remark)
      })
    },
    // 根据字典项查询价格
    async getServicePriceList() {
      const res = await dictitemInfoAllMethod({
        type: 'SERVICE_PRICE_UNIT',
      })
      this.serverPrice = res.body.result
    },
    // 根据字典项查询服务类型
    async getServiceTypeList() {
      const res = await dictitemInfoAllMethod({
        type: 'SERVICE_TYPE',
      })
      this.serverTypeList = res.body.result
    },
    // 根据字典项查询服务内容
    async dictitemServiceInfo() {
      const res = await dictitemServiceInfo({
        type: 'SERVICE_CONTENT',
      })
      this.serviceContentList = res.body.result
    },
    // 删除tag
    handleClose(tag) {
      this.form.serviceObject.splice(this.form.serviceObject.indexOf(tag), 1)
    },
    // 聚焦
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 确定新增tag
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.form.serviceObject.push({
          name: inputValue,
          sort: this.form.serviceObject.length + 1,
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 修改服务
    async updateServices() {
      const price = this.form.serviceSpecificPrice && this.form.specificService
      this.form.serviceSpecificPrice = price ? this.form.serviceSpecificPrice : 0

      await updateServices({
        ...this.form,
      })
      this.$message({
        message: '修改成功!',
        type: 'success',
      })
    },
    // 提交
    async submitForm(formName) {
      await this.$refs[formName].validate()
      this.form.serviceContent = this.serviceContentList.filter((item) => {
        return this.checkedServices.includes(item.remark)
      })
      if (this.editFlag) {
        // 新增
      } else {
        await this.updateServices()
      }
      this.$router.back()
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
