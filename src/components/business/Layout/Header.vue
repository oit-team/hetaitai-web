<template>
  <el-header>
    <div class="system">
      <el-avatar style="width: 40px; height: 40px" src="https://picsum.photos/40" />
      <span class="system-name">禾太太管理系统</span>
      <!-- <i
        class="collapse-btn"
        :class="$store.state.aside.collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="$store.commit('aside/switchCollapse')"
      ></i> -->
    </div>

    <el-menu class="scrollbar" :default-active="activeIndex" mode="horizontal" router>
      <el-menu-item
        v-for="(item, index) in menuList"
        :key="index"
        :index="item.menuId"
        :route="item.menuUrl"
        @click="pushTo(item)"
      >
        {{ item.menuName }}
      </el-menu-item>
      <!-- <el-menu-item index="4" route="user/userList">
        用户管理
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          我的工作台
        </template>
        <el-menu-item index="2-1">
          选项1
        </el-menu-item>
        <el-menu-item index="2-2">
          选项2
        </el-menu-item>
        <el-menu-item index="2-3">
          选项3
        </el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">
            选项4
          </template>
          <el-menu-item index="2-4-1">
            选项1
          </el-menu-item>
          <el-menu-item index="2-4-2">
            选项2
          </el-menu-item>
          <el-menu-item index="2-4-3">
            选项3
          </el-menu-item>
        </el-submenu>
      </el-submenu> -->
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
import axios from 'axios'

export default {
  name: 'VcHeader',
  data: () => ({
    activeIndex: '1',
    menuList: [],
    // pageTo: '',
  }),
  watch: {
    menuList(newData) {
      const MenuStatus = {}
      newData.forEach((item, i) => {
        MenuStatus[item.menuCode] = ''
      })
      sessionStorage.MenuStatus = JSON.stringify(MenuStatus)
      this.activeIndex = `${newData[0].menuId}`
    },
  },
  created() {
    this.getEmnu()
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
    async getEmnu() {
      await axios({
        url: '/api/system/menu/getTreeMenuList',
        method: 'post',
        data: {
          head: {
            aid: localStorage.getItem('userId'),
            ver: '1.0',
            ln: 'cn',
            cmd: 10008,
            mod: 'app',
            de: '2019-10-16',
            sync: 1,
            chcode: 'ef19843298ae8f2134f',
          },
          con: {},
        },
      }).then((res) => {
        this.menuList = res.data.body.resultList
        this.pushTo(this.menuList[0])
        this.$emit('menu-loaded')
      })
    },
    // async getEmnu() {

    // },
    pushTo(item) {
      if (item.fieldDes) {
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
