<template>
  <div id="singleTalk">
    <el-row style="height: 100%;">
      <el-col id="friendsList" :span="6">
        <ul>
          <li class="friendListTitle">我的好友</li>
          <li class="friendListItem" :class="{'activeFriend':item.friend_name == activeFriend }" @click="changeFriend(item.friend_name)" v-for="(item,index) in friendList" :key="index">{{item.friend_name}}</li>
        </ul>
      </el-col>
      <el-col :span="18" class="flexBox">
        <div ref="messageView" class="messageView">
          <ul v-for="(it,i) in Object.keys(this.messageList)" :key="i" v-show="activeFriend == it">
            <li v-for="(item,index) in messageList[it]" style="display: block; margin: 3px 0 10px 0" :key="index">
              <div :class="item.sendPeople == userName ?'rightSide':'leftSide' ">
                <img class="userImg" :src="friendimgSrc[activeFriend]" v-if="item.sendPeople != userName"/>
                <span class="messageBox" v-if="item.messageType === 'text'">{{item.value}}</span>
                <span class="message-content-image" v-if="item.messageType === 'img'">
                  <viewer style="display:inline">
                    <img style="width:150px;height:150px" :src="item.value" alt="" />
                  </viewer>
                </span>
                <img class="userImg" :src="imgSrc" v-if="item.sendPeople == userName"/>
              </div>                                                            
              <br>
            </li>
          </ul>
        </div>
        <div id="wangedit"  ref="wangedit" class="sendMes"></div>
        <el-button class="sendButton1" @click="webRtc" type="success">视频通话</el-button>
        <el-button class="sendButton" @click="sendMessage" type="success">发送</el-button>
      </el-col>
    </el-row>
    <div v-if="isShowModal" class="videoModal">
      <div v-if="isShowModalText" class="videoText">
        等待对方回应中
        <el-button @click="cancelVideoButton" type="success">取消</el-button>
      </div>
      <video id="local" class="videoLocal" autoplay playsinline muted></video>
      <video id="remote" class="videoRemove" autoplay playsinline></video>
    </div>
    
  </div>
</template>
<script>
import api from "../network/home"
import E from 'wangeditor'
import { io } from "socket.io-client";
let socket = null;
import 'webrtc-adapter'

export default {
  data() {
    return {
      friendList:[],
      activeFriend:'',
      messageList:{},
      sendid:'',
      userName: localStorage.getItem("user_name"),
      firstIn : true,
      imgSrc:'',
      friendimgSrc:[],
      userid:'',
      editor:{},
      //视频通话
      pc:'',
      isShowModal:false,
      isShowModalText:false,
      hasEmitOffer: false,
      hasEmitAnswer: false,
    };
  },
  created () {
    socket = io(this.SOCKET_BASEURL, {
      reconnectionDelayMax: 10000,
      query: {
        "my-key": localStorage.getItem('user_name')
      },
      cors:true
    });
    socket.connect()

    var self = this
    this.$bus.$on('gotoChat', function(value) {
        self.changeFriend(value.name);
    });
    this.pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.voipbuster.com ',
        },
      ],
    })
  },
  mounted() {
    this.editor = new E('#wangedit')
    let editor = this.editor
    editor.config.menus = [
        'emoticon',
    ]
    editor.config.placeholder = '请输入'  
    editor.create()
    editor.config.uploadImgServer = this.BASEURL + '/uploadmes'
    editor.config.uploadFileName = 'file'
    socket.on('error',res=>{
      this.$message.error(res)
    })
    socket.on('messageSucess',res=>{
      this.messageList[this.activeFriend].push(res)
      this.$forceUpdate()
      this.scrollToBottom()
    })
    socket.on('messageReach',res=>{
      this.messageList[res.sendPeople].push(res)
      this.$forceUpdate()
      this.scrollToBottom()
    })

    // rtc相关

    // 收到offer,创建answer
    socket.on('offer', (data) => {
      console.log("**offer***", data);
      this.createAnswer(data.sdp)
    })
    // 收到answer,设置远端sdp
    socket.on('answer', (data) => {
      console.log("***answer**", data);
      this.addAnswer(data.sdp)
    })

    this.getFriends()
    this.$bus.$on('message-room',function(res){
      socket.emit('messageroom',res)
    })
    socket.on('messageroomReach',res=>{
      this.$bus.$emit('messageroomReach',res)
    }) 
    //监听回车
    this.$refs.wangedit.addEventListener('keyup',e=>{
      if(e.keyCode == "13"){
        this.sendMessage()
      }
    }) 
  },
  methods: {
    changeFriend(name){
      this.activeFriend = name
      this.$forceUpdate()
    },

    //发送消息
    sendMessage(){
      let value ='' ,messageType='text';
      if(this.editor.txt.html()){
        let arr = this.editor.txt.html().match(/src=".*.png/g);
        if(arr?.length ==1){
          value = arr[0].replace('src="','')
          messageType = 'img'
        } else {
          value = this.editor.txt.text()
        }
      }
      if(value == ''){
        this.$message.error('不能发送空消息')
        return
      }
      socket.emit('message',{
        userName:this.userName,
        reciveName:this.activeFriend,
        content:value,
        messageType
      })
      this.editor.txt.html('');
    },
    //获取好友列表
    getFriends(){
      api.getFriends(localStorage.getItem('user_name')).then(res=>{
        this.friendList =  res.data || [];
        this.activeFriend = this.activeFriend || this.friendList[0]?.friend_name
        this.$store.commit('setFriendList',this.friendList)
        if(this.firstIn){
          this.getMessage()
          this.getFriendImg()
          this.userid = localStorage.getItem('userid')
          localStorage.setItem('userid',this.userid +'')
          api.getImg({id:this.userid+''}).then(res=>{
            this.imgSrc = 'data:image/jpg;base64,' + res.data[0] // base64方式，需要手动拼接前缀或者由后端拼好直接显示
            this.$bus.$emit('getImg',{src:this.imgSrc})
          })
          this.firstIn = false;
        }
      })
    },
    //获取消息列表
    getMessage(){
      this.friendList.forEach(item=>{
        this.messageList[item.friend_name] = []
      })
      api.getMessage(localStorage.getItem('userid')).then(res=>{
        res.data.friendsMessage.forEach(item=>{
          if(item.message_sent == this.userName){
            this.messageList[item.message_receive].push({
              sendPeople:item.message_sent,
              value:item.message_value,
              messageType:item.message_type
            })
          } else {
            this.messageList[item.message_sent].push({
              sendPeople:item.message_sent,
              value:item.message_value,
              messageType:item.message_type
            })
          }  
        })
        this.$store.commit('setRoomMessage',res.data.roomMessage) 
        this.$forceUpdate()
      })
    },
    getFriendImg(){
      this.friendList?.forEach((item)=>{
        this.friendimgSrc[item.friend_name] = `${this.BASEURL}/static/userImg/${item.user_img}.png`
      })  
    },

    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageId = res.img_id
      console.log(this.imageId );
      this.imageUrl = window.URL.createObjectURL(file.raw);
    },
    /**
     * 滚动到底部
     */
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messageView.scrollTop = this.$refs.messageView.scrollHeight
      });
    },
    async webRtc(){
      await this.webRtcInit()
      this.createOffer()
    },
    async webRtcInit (){
      this.isShowModal = true
      return new Promise((resolve) =>{
        this.$nextTick(async () =>{
          const pc = this.pc
          // 获取本地端视频标签
          const localVideo = document.getElementById('local')
          // 获取远程端视频标签
          const remoteVideo = document.getElementById('remote')

          // 采集本地媒体流
          const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })
          // 设置本地视频流
          localVideo.srcObject = localStream

          // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
          localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream)
          })

          // 监听远程流：
          const remoteStream = new MediaStream()
          pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
              remoteStream.addTrack(track)
            })
            // 设置远程视频流
            remoteVideo.srcObject = remoteStream
          }
          resolve()
        })
      })
      
      
    },
    async createOffer(){
      const pc = this.pc
      // 创建 offer
      const offer = await pc.createOffer()
      // 设置本地描述
      await pc.setLocalDescription(offer)
      pc.onicecandidate = (event) => {
        if (event.candidate  && !this.hasEmitOffer) {
          console.log("emitoffer");
          socket.emit('offer', {
            userName: this.activeFriend,
            sdp: pc.localDescription,
          })
          this.hasEmitOffer = true
        }
      }
      pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state: ${pc.iceConnectionState}`);
      };
      this.isShowModal = true
    },

    async createAnswer (offer){
      await this.webRtcInit()
      const pc = this.pc
      pc.onicecandidate = async (event) => {
        // Event that fires off when a new answer ICE candidate is created
        if (event.candidate && !this.hasEmitAnswer) {
          socket.emit('answer', {
            userName: this.activeFriend,
            sdp: pc.localDescription,
          })
          this.hasEmitAnswer = true
          this.isShowModalText = false
        }
      }
      await pc.setRemoteDescription(offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
    },
    async addAnswer(answer){
      const pc = this.pc
      if (!pc.currentRemoteDescription) {
        pc.setRemoteDescription(answer)
        this.isShowModalText = false
      }
    },
    cancelVideoButton(){
      console.log("111111");
      this.isShowModal = false
      this.hasEmitOffer = false
      this.hasEmitAnswer = false
      this.isShowModalText = false
      // 获取本地端视频标签
      const localVideo = document.getElementById('local')
      // 获取远程端视频标签
      const remoteVideo = document.getElementById('remote')
      localVideo.srcObj = null
      remoteVideo.srcObj = null
    }
  },
  beforeDestroy () {
    socket.off('messageSucess');
    socket.off('error');
    socket.off('messageReach');
    socket.off('messageroomReach');
    socket.off('offer');
    socket.off('answer');
    socket.disconnect()
    this.$bus.$off("getImg")
    this.$bus.$off("message-room")
  },
};
</script>

<style lang="scss" scoped>

#singleTalk{
  height: 90%;
  margin: 24px;
  border: 1px solid rgb(26, 31, 1);
}
#friendsList{
  border-right: 1px solid rgb(26, 31, 1);
  height: 100%;
  .friendListTitle{
    display: block;
    text-align: center;
    height: 50px;
    line-height: 50px;
    background-color: rgba(14, 170, 175, 0.822);
  }
  .friendListItem{
    display: block;
    text-align: center;
    height: 55px;
    line-height: 55px;
  }
  .friendListItem:hover {
    cursor: pointer;
    background-color: rgba(214, 132, 132, 0.822);
  }
  .activeFriend{
    background-color: rgba(214, 132, 132, 0.822);
    cursor: pointer;
  }
}
.flexBox{
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  .messageView{
    max-height: calc(100vh - 335px);
    overflow-x: hidden;
    overflow-y: auto;
    flex: 5;
    .messageBox{
      position: relative;
      top: -8px;
      padding: 5px 10px;
      background-color: rgb(0, 247, 255);
    } 
  }
  .sendMes{
    // flex: 2;
    height: 193px;
  }
  .sendButton{
    position: absolute;
    width: 75px;
    bottom: 0;
    right: 0;
    z-index: 99999;
  }
  .sendButton1{
    position: absolute;
    width: 120px;
    bottom: 0;
    right: 80px;
    z-index: 99999;
  }
}
.leftSide{
  display: inline-block;
  position: relative;
  left: 2%;
}
.rightSide{
  display: inline-block;
  position: relative;
  left: 100%;
  transform: translateX(-100%);
  padding-right: 10px;
}
.userImg{
  width: 30px;
  height: 30px;
}
</style>
<style lang="scss">
.w-e-text img{
  width: 150px;
  height: auto;
}
.w-e-toolbar{
  z-index: 1 !important;
}
.w-e-text-container{
  height: 150px !important;
  z-index: 1 !important;
}
::-webkit-scrollbar{
  width:0;
  height:6;
}
.w-e-menu .w-e-panel-container{
  top: -302px;
  margin-left:0 !important;
}
.videoModal{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
}
.videoLocal{
  position: absolute;
  top: 0;
  right: 0;
  width: 20vw;
  height: 30vh;
}
.videoRemove{
  width: 60vw;
  height: 70vh;
}
.videoText{
  color: #fff;
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

</style>