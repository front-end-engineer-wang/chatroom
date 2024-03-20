<template>
  <div id="addFriend">
    <div class="searchList">
      <span>用户名:</span>
      <el-input
        v-model="friendName"
        style="width: 70%"
        placeholder="请输入用户名"
      ></el-input>
      <el-button @click="search" icon="el-icon-search" circle></el-button>
    </div>
    <div class="resultList">
      <div class="hasnoData" v-if="resultList.length == 0">暂无数据</div>
      <div class="resultListItem" v-for="(item, index) in resultList" :key="index">
        {{ item.user_name }}
        <el-button v-if="friendList.includes(item.user_name)" icon="el-icon-chat-dot-round" @click="goto(item.user_name)" type="primary">去聊天</el-button>
        <el-button v-else icon="el-icon-circle-plus-outline" @click="sentRequest(item.user_name)" type="primary">发送添加申请</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../network/home";

export default {
  data() {
    return {
      friendName: "",
      resultList: [],
    };
  },
  computed: {
      friendList() {
          let arr = []
          this.$store.state.friendList.forEach(item=>{
              arr.push(item.friend_name)
          })
          return arr || []; 
      }
  },
  methods: {
    //查找用户
    search() {
      this.friendName &&
        api.searchFriends(this.friendName).then((res) => {
          this.resultList = res.data.filter(item=>{  //排除自己
              return item.user_name != localStorage.getItem("user_name")
          });
        });
    },
    //添加请求
    sentRequest(name){
        let params = {
            request_send: localStorage.getItem("user_name"),
            request_accept:name,
        }
        api.sentRequest(params).then(res=>{
            if(res.data.msg == 'success'){
                this.$message.success('发送请求成功，请等待对方同意')
            } else {
                this.$message.error(res.data.msg)
            }
        })
    },
    //去到聊天页面
    goto(name){
        this.$router.push('/base')
        this.$bus.$emit('gotoChat',{name:name})
    }
  },
  beforeDestroy(){
    this.$bus.$off("gotoChat")
  }
};
</script>

<style lang="scss" scoped>
#addFriend {
  width: 500px;
  height: 500px;
  border: 1px solid rgb(1, 228, 197);
  position: relative;
  left: 50px;
  top: 50px;
}
.searchList {
  box-sizing: border-box;
  line-height: 40px;
  width: 500px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid rgb(212, 202, 202);
}
.resultListItem{
    display: flex;
    justify-content: space-between;
    padding: 10px;
}
.hasnoData {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: rgb(212, 202, 202);
}
.spanButton {
  cursor: pointer;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  border: 1px solid rgb(9, 190, 181);
  border-radius: 50%;
}
</style>