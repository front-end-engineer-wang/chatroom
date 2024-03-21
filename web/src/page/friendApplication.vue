<template>
  <!-- 好友申请页面 -->
  <div id="addFriendsRequest">
    <div class="requestList">
      <div class="hasnoData" v-if="requestList.length == 0">暂无数据</div>
      <div class="requestListItem" v-for="(item, index) in requestList" :key="index">
        {{ item.request_send }}
        <el-button icon="el-icon-check" v-if="item.request_status ==1" @click="acceptFriend(item.request_send)" type="success">同意申请</el-button>
        <el-button icon="el-icon-delete" v-if="item.request_status ==1"  @click="refuseFriend(item.request_send)" type="danger">拒绝申请</el-button>
        <el-button icon="el-icon-check" v-if="item.request_status ==2" disabled type="success">已同意</el-button>
        <el-button icon="el-icon-delete" v-if="item.request_status ==3" type="danger">已拒绝</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../network/home";

export default {
  data() {
    return {
      requestList: [],
    };
  },
  mounted () {
    this.getFriendRequset();
  },
  methods: {
      //获取添加申请
    getFriendRequset(){
      api.getFriendRequset(localStorage.getItem("user_name")).then(res=>{
        this.requestList = res.data
        console.log(this.requestList );
        this.$forceUpdate()
      })
    },
    //同意好友
    acceptFriend(name){
      api.acceptFriend({
        request_accept:localStorage.getItem("user_name"),
        request_send:name
      }).then(()=>{
        this.$message.success('添加成功')
        setTimeout(()=>{
          this.getFriendRequset()
        },2000 )
      })
    },
    //拒绝好友
    refuseFriend(name){
      api.refuseFriend({
        request_accept:localStorage.getItem("user_name"),
        request_send:name
      }).then(this.getFriendRequset)
    },
  },
  activated (){
    this.getFriendRequset();
  }
};
</script>

<style lang="scss" scoped>
#addFriendsRequest {
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
.requestListItem{
    padding: 10px 30px;
    border-bottom: 1px solid rgb(212, 202, 202);
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