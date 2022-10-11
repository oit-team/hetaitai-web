<template>
  <div class="flex h-full">
    <main class="flex-1 flex flex-col overflow-hidden">
      <div id="customerList" class="pageCommonStyle h-full flex flex-col">
        <TablePage v-bind="tablePageOption" ref="table" auto>
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
        <el-form :model="form" :rules="rules" class="flex-1" label-width="80px">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="form.goodsName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="goodsDescribe">
            <el-input
              v-model="form.goodsDescribe"
              autocomplete="off"
              maxlength="30"
              type="textarea"
              rows="2"
            ></el-input>
          </el-form-item>
          <el-form-item label="兑换积分" prop="consumePoints">
            <el-input v-model.number="form.consumePoints" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="库存数量" prop="stockNum">
            <el-input v-model.number="form.stockNum" autocomplete="off"></el-input>
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
import { addGoods, deleteGoods, getGoodsList, updateGoodsInfo, updateGoodsState } from '@/api/integral'

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
      rules: {
        goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goodsDescribe: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
        consumePoints: [
          { required: true, message: '请输入兑换积分', trigger: 'blur' },
          { type: 'number', message: '积分必须为数字值', trigger: ['blur', 'change'] },
        ],
        stockNum: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
          { type: 'number', message: '库存必须为数字值', trigger: ['blur', 'change'] },
        ],
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
              {
                tip: '删除',
                type: 'info',
                icon: 'el-icon-delete',
                click: ({ row }) => this.deleteGoods(row),
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
    onSubmit() {
      this.loading = true
      addGoods({
        ...this.form,
      }).then((res) => {
        if (res.head.status === 0) {
          this.$message.success('新增成功')
          this.dialog = false
          this.getData()
        } else {
          this.$message.error(res.head.msg)
        }
      }).catch((ref) => {
        this.$message.error(ref.message)
      }).finally(() => {
        this.loading = false
      })
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
    onUpdata() {
      this.$confirm('确定修改该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        this.form.goodsState = undefined
        updateGoodsInfo({
          ...this.form,
        }).then((res) => {
          if (res.head.status === 0) {
            this.loading = false
            this.dialog = false
            this.$message.success('修改成功')
            this.getData()
          } else {
            this.loading = false
            this.$message.error(res.head.msg)
          }
        })
      }).catch(() => {})
    },
    // 商品上下架
    putGoods(row) {
      if (row.goodsState === 2) {
        this.$message.error('商品库存不足')
        return false
      }
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
      }).catch(() => {})
    },
    // 删除商品
    deleteGoods(row) {
      this.$confirm('确定删除该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }).then(() => {
        deleteGoods({
          goodsId: row.id,
        }).then((res) => {
          if (res.head.status === 0) {
            this.$message.success('删除商品成功')
            this.getData()
          } else {
            this.$message.success('删除失败，请重试')
          }
        }).catch((ref) => {
          this.$message.success(ref.message)
        })
      }).catch(() => {})
    },
  },
}
</script>

<style scoped>

</style>
