<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :default-active="activeIndex"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="rgb(44, 148, 189)"
      @select="changeMenu"
    >
      <el-menu-item v-if="isPc" class="menu-null"></el-menu-item>
      <el-menu-item index="1">私聊</el-menu-item>
      <el-menu-item index="2">聊天室</el-menu-item>
      <el-menu-item index="3">小游戏</el-menu-item>
      <el-menu-item class="menu-user">
        <img :src="img_url" alt="" /><span>{{name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
const pathEunm = {
  '/addFriend':'1',
  '/base':'1',
  '/friendApplication':'1',
  '/chatroom':'2',
  '/creatChatroom':'2',
  '/fiveChess':'3',
  '/myGpt':'3',
}

export default {
  data() {
    return {
      activeIndex: pathEunm[this.$route.path],
      name:localStorage.getItem("user_name"),
      img_url:`${this.BASEURL}/static/userImg/${localStorage.getItem("userid")}.png`,
      isPc: window.innerWidth >= 767
    };
  },
  methods: {
    changeMenu(index) {  //点击模块跳转到对应的菜单
      if (index == 1) {  //模块1菜单
        let menu = [
          {
            index: "/base",
            name: "我的好友",
            icon: "el-icon-s-home",
          },
          {
            index: "/addFriend",
            name: "添加好友",
            icon: "el-icon-user",
          },
          {
            index: "/friendApplication",
            name: "好友申请",
            icon: "el-icon-user",
          },
        ];
        this.$store.commit("changeMenu", {menu});  //通知菜单栏更新对应的菜单
      }
      if (index == 2) {  //模块2菜单
        let menu = [
          {
            index: "/chatroom",
            name: "聊天室",
            icon: "el-icon-s-home",
          },
          {
            index: "/creatChatroom",
            name: "新建聊天室",
            icon: "el-icon-user",
          },
        ];
        this.$store.commit("changeMenu", { menu });
      }
      if (index == 3) {  //模块2菜单
        let menu = [
          {
            index: "/fiveChess",
            name: "五子棋",
            icon: "el-icon-s-home",
          },
          // {
          //   index: "/myGpt",
          //   name: "gpt",
          //   icon: "el-icon-s-home",
          // },
        ];
        this.$store.commit("changeMenu", { menu });
      }
    },
  },
  created () {
    this.changeMenu(pathEunm[this.$route.path])
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
