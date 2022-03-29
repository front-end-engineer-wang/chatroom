<template>
  <div class="home">
    <el-container class="elcontainer">
      <el-header class="elheder">
        <Nav-bar></Nav-bar>
      </el-header>
      <el-container>
        <el-aside width="auto" class="elaside">
          <Common-aside></Common-aside>
        </el-aside>
        <el-main class="elmain">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>    
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import CommonAside from "../components/CommonAside.vue";
export default {
  name: "Home",
  created() {
    // localStorage里面没有token就跳到登录页
    if (localStorage.getItem('token') == "") {
      this.$router.push("/login");
    }
    
  },
  components: {
    NavBar,
    CommonAside,
  },
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
}
.elmain {
  padding: 0 !important;
}
.elcontainer {
  height: 100%;
}
.elaside {
  height: 100%;
}
.elheder {
  padding: 0;
}
</style>
