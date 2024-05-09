<template>
    <el-menu
      :default-active="path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="issmall"
      router
    >
      <el-menu-item class="title" index="">
        <span>在线聊天系统</span>
        <i class="el-icon-menu" @click="small"></i>
      </el-menu-item>

      <el-menu-item v-for="(item,index) in menu" :index="item.index" :key="item.name">
        <i :class='item.icon'></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
      <el-menu-item class="title" index="">
        <span @click="loginout"> 退出登录</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
export default {
  data() {
    return {
      issmall: false,
    };
  },
  computed: {
    path() {   //当前的路由
      return this.$route.path
    },
    menu(){    //当前模块的菜单
      return this.$store.state.currentmenu
    }
  },
  methods: {
    small() {    //菜单栏缩小
      this.issmall = !this.issmall;
    },
    loginout() {   //退出登录清除token并跳掉登录页
      localStorage.removeItem('token')
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.title {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.issmall {
  width: 100%;
  overflow: hidden;
}
</style>
