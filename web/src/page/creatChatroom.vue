<template>
  <!-- 新建聊天室页面 -->
  <div id="addChatRoom">
    <div class="friendList">
      <div class="hasnoData" v-if="friendList.length == 0">暂无数据</div>
      <div style="padding-top:10px">
        <span style="padding-left: 20px">聊天室名称：</span>
        <el-input v-model="chatRoomName"> </el-input>   
      </div>
      <div>
        <div style="padding: 10px 0 0 20px">选择好友：</div>
        <div class="selectFriends"> 
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item,i) in friendList" :key="i" :label="item.friend_name"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="createbut">
          <el-button type="primary" round @click="createRoom">创建聊天室</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../network/home";

export default {
  data() {
    return {
      friendList: this.$store.state.friendList || [],
      optionList: {},
      checkList:[],//选中的好友
      chatRoomName:'', //聊天室名称
    };
  },
  mounted () {
    this.friendList.forEach(item=>{
      this.optionList[item.friend_name] = item.user_friend
    })
    console.log(this.optionList);
  },
  methods: {
    //创建聊天室
    createRoom(){
      if(!this.chatRoomName){
        this.$message.error('请补充聊天室名称')
        return
      }
      if(this.checkList.length > 1){
        let userList = []
        this.checkList.forEach(item =>{
          userList.push(this.optionList[item])
        })
        let data = {
          room_name: this.chatRoomName,
          room_creat:localStorage.getItem('userid'),
          userList:userList,
        }
        api.createRoom(data).then(res=>{
          if(res.data?.data?.msg){
            this.$message.success('创建聊天室成功')
            this.checkList = [];
            this.chatRoomName = '';
          }
        })
      } else{
        this.$message.error('请至少选择2位好友')
        return
      }
       
      
    }
  },
};
</script>

<style lang="scss" scoped>
#addChatRoom {
  width: 500px;
  height: 500px;
  border: 1px solid rgb(1, 228, 197);
  position: relative;
  left: 50px;
  top: 50px;
}
.el-input{
  width: 300px;
}
.hasnoData {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: rgb(212, 202, 202);
}

.selectFriends{
  padding: 20px;
}
.createbut{
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%);
}
</style>