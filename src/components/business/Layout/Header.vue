<template>
  <el-header>
    <div class="system">
      <el-avatar class="logo-box" />
      <span class="system-name">禾太太管理系统</span>
    </div>

    <el-menu class="scrollbar" :default-active="activeIndex" mode="horizontal" router @select="activeIndex = $event">
      <el-menu-item
        v-for="(item, index) in menuList"
        :key="index"
        :index="item.menuId"
        :route="item.menuUrl"
      >
        {{ item.menuName }}
      </el-menu-item>
    </el-menu>

    <div class="account">
      <el-dropdown @command="handleCommand">
        <span class="account-name">
          {{ $store.state.userInfo.nickName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="dropdown-item--danger" command="out">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { getTreeMenuList } from '@/api/common'

export default {
  name: 'VcHeader',
  data: () => ({
    activeIndex: '1',
    menuList: [],
  }),
  watch: {
    menuList(newData) {
      const MenuStatus = {}
      newData.forEach((item, i) => {
        MenuStatus[item.menuCode] = ''
      })
      sessionStorage.MenuStatus = JSON.stringify(MenuStatus)
      const current = this.menuList.find(item => item.menuUrl === this.$route.path) ?? this.menuList[0]
      this.setTab(current)
    },
    $route() {
      this.setCurrentTab()
    },
  },
  created() {
    this.getTreeMenuList()
  },
  mounted() {
    this.getTreeMenuList()
  },
  methods: {
    // 退出登录
    handleCommand(command) {
      if (command === 'out') {
        localStorage.clear()
        this.$router.push({
          name: 'Login',
        })
      }
    },
    async getTreeMenuList() {
      const res = await getTreeMenuList()
      this.menuList = res.body.resultList
      this.setCurrentTab()
      this.$emit('menu-loaded')
    },
    setCurrentTab() {
      const current = this.menuList.find(item => item.menuUrl.toLowerCase() === this.$route.path.toLowerCase())
      this.setTab(current)
    },
    setTab(item) {
      if (item?.menuId) {
        this.activeIndex = item.menuId
        sessionStorage.setItem('headTitString', item.fieldDes)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/styles/element-variables";

.el-header {
  padding: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  border-bottom: solid 1px #e6e6e6;
}

.system {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  padding-right: 20px;
  user-select: none;

  .system-name {
    font-weight: bold;
    line-height: 0;
    padding-left: 12px;
  }
  .logo-box{
    width: 35px;
    height: 35px;
    background:url('~@/assets/logo.svg') 0 center no-repeat ;
    background-size: 35px;
  }
}

.collapse-btn {
  font-size: 24px;
  padding-left: 27px;
  cursor: pointer;
}

.account {
  margin-left: auto;
  padding-right: 20px;

  .account-name {
    cursor: pointer;
  }
}

.dropdown-item--danger {
  color: $--color-danger;

  &:focus,
  &:not(.is-disabled):hover {
    color: $--color-danger;
    background-color: transparentize($--color-danger, 0.9);
  }
}
</style>
