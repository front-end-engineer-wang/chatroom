<template>
  <div style="width: 600px;">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :default-active="activeIndex"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="rgb(44, 148, 189)"
      router
    >
      <el-menu-item index="/base">私聊</el-menu-item>
      <el-menu-item index="/chatroom">聊天室</el-menu-item>
      <el-menu-item index="/addFriend">添加好友</el-menu-item>
      <el-menu-item index="/friendApplication">好友申请</el-menu-item>
      <el-menu-item index="/creatChatroom">新建聊天室</el-menu-item>
      <el-menu-item index="/fiveChess">五子棋</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/base",
      isPc: window.innerWidth >= 767
    };
  },
  methods: {
  },
  created () {
  },
};
</script>

<style lang="scss" scoped>
img {
  border: 1px solid black;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.menu-null {
  width: 200px;
  background-color: rgb(27, 57, 226);
}
.menu-user {
  float: right;
  width: 115px;
}
</style>
