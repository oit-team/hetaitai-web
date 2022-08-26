<template>
  <el-container class="page-container" direction="vertical">
    <VcHeader @menu-loaded="menuLoaded = true" />
    <el-container v-if="menuLoaded" class="overflow-hidden">
      <!-- <VcAside /> -->
      <VcMain class="scrollbar" />
    </el-container>
  </el-container>
</template>

<script>
import VcHeader from './Header'
// import VcAside from './Aside'
import VcMain from './Main'

export default {
  name: 'VcLayout',

  components: {
    VcMain,
    // VcAside,
    VcHeader,
  },

  data: () => ({
    menuLoaded: false,
  }),
}
</script>

<style lang="scss" scoped>
.page-container {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
</style>
