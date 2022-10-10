<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto>
          <template #content:orderState="{ row }">
            <el-tag :type="getStateColor(row.orderStateKey, 'order')">
              {{ row.orderState }}
            </el-tag>
          </template>
        </TablePage>
      </div>
    </main>
    <el-drawer
      :title="dialogTitle"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="h-full p-8 flex flex-col justify-between">
        <el-form :model="form" class="flex-1" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goodsName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input
              v-model="form.goodsDescribe"
              autocomplete="off"
              maxlength="30"
              type="textarea"
              rows="2"
            ></el-input>
          </el-form-item>
          <el-form-item label="兑换积分">
            <el-input v-model="form.consumePoints" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="form.stockNum" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer flex" v-if="isEdit === ''">
          <el-button @click="$refs.drawer.closeDrawer()" class="flex-1">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading" class="flex-1">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
        <div class="demo-drawer__footer flex" v-else-if="isEdit === '1'">
          <el-button @click="$refs.drawer.closeDrawer()" class="flex-1">取 消</el-button>
          <el-button type="primary" @click="onUpdata" :loading="loading" class="flex-1">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addGoods, getGoodsList, updateGoodsInfo, updateGoodsState } from '@/api/integral'

export default {
  name: 'IntegralGoodsList',
  data() {
    return {
      formData: {
        goodsName: '',
        goodsState: '',
        startcreateTime: '',
        endcreateTime: '',
        pageSize: 20,
        pageNum: 1,
      },
      form: {
        goodsName: '',
        goodsDescribe: '',
        consumePoints: '',
        stockNum: '',
        goodsState: '0',
      },
      data: {},
      dialog: false,
      loading: false,
      dialogTitle: '商品',
      lookGoods: {},
      isEdit: '',
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.getData,
        actions: [
          {
            name: '新增商品',
            type: 'success',
            icon: 'el-icon-plus',
            click: this.addGoods,
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
                click: ({ row }) => {
                  this.dialog = true
                  this.lookGoods = row
                  this.form.goodsName = row.goodsName
                  this.form.goodsDescribe = row.goodsDescribe
                  this.form.consumePoints = row.consumePoints
                  this.form.stockNum = row.stockNum
                  this.isEdit = '0'
                },
              },
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: ({ row }) => {
                  if (row.goodsState === 1) {
                    this.$message.error('请先下架商品')
                    return false
                  }
                  this.dialog = true
                  this.lookGoods = row
                  this.form.goodsName = row.goodsName
                  this.form.goodsDescribe = row.goodsDescribe
                  this.form.consumePoints = row.consumePoints
                  this.form.stockNum = row.stockNum
                  this.form.goodsId = row.id
                  this.isEdit = '1'
                },
              },
              {
                tip: ({ row }) => row.goodsState === 0 ? '上架' : '下架',
                type: ({ row }) => row.goodsState === 0 ? 'success' : 'danger',
                icon: ({ row }) => row.goodsState === 0 ? 'el-icon-s-promotion' : 'el-icon-minus',
                disabled: ({ row }) => row.goodsState === 3,
                click: ({ row }) => this.putGoods(row),
              },
              // {
              //   tip: '删除',
              //   type: 'danger',
              //   icon: 'el-icon-delete',
              //   click: ({ row }) => this.deleteGoods(row),
              // },
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
    // 获取商品列表
    async getData(params) {
      const res = await getGoodsList({
        ...this.formData,
        ...params,
      })
      if (res.head.status === 0) {
        this.data = res.body
      } else {
        this.$message.error(res.head.msg)
      }
    },
    // 新增商品提交按钮
    async onSubmit() {
      this.loading = true
      const res = await addGoods({ ...this.form })
      if (res.head.status === 0) {
        this.$message.success('新增成功')
        this.loading = false
        this.dialog = false
        this.getData()
      } else {
        this.$message.error(res.head.msg)
        this.loading = false
      }
    },
    // 新增积分商品
    addGoods() {
      this.dialog = true
      this.form = {
        goodsName: '',
        goodsDescribe: '',
        consumePoints: '',
        stockNum: '',
        goodsState: '0',
      }
      this.isEdit = ''
    },
    // 修改商品信息
    async onUpdata() {
      this.loading = true
      this.form.goodsState = undefined
      const res = await updateGoodsInfo({
        ...this.form,
      })
      if (res.head.status === 0) {
        this.loading = false
        this.dialog = false
        this.$message.success('修改成功')
        this.getData()
      } else {
        this.loading = false
        this.$message.error(res.head.msg)
      }
    },
    // 商品上下架
    putGoods(row) {
      if (row.goodsState === 2) this.$message.error('商品库存不足')
      let msg = ''
      if (row.goodsState === 0) {
        msg = '是否确定上架该商品'
      } else {
        msg = '是否确定下架该商品'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await updateGoodsState({
          goodsId: row.id,
          goodsState: row.goodsState === 1 ? '0' : '1',
        })
        if (res.head.status === 0) {
          this.$message.success('操作成功')
          this.getData()
        } else {
          this.$message.error(res.head.msg)
        }
      }).catch()
    },
  },
}
</script>

<style scoped>

</style>
