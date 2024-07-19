<template>
  <div id="roomTalk" :class="isPc ? 'singleTalkPc' : 'singleTalkPhone'"> 
    <el-row style="height: 100%">
      <el-col id="roomList" :span="6">
        <ul>
          <li class="roomListTitle">聊天室列表</li>
          <li class="roomListItem" :class="{ activeroom: item.room_id == activeroomid }"
            @click="changeroom(item.room_id)" v-for="(item, index) in roomList" :key="index">
            {{ item.room_name }}
          </li>
        </ul>
      </el-col>
      <el-col :span="18" class="flexBox">
        <div class="messageView" ref="messageView">
          <ul v-for="(it, i) in Object.keys(this.messageList) || []" :key="i" v-show="activeroomid == it">
            <li v-for="(item, index) in messageList[it]" style="display: block; margin: 8px 0 10px 0; height: 28px"
              :key="index">
              <div :class="item.sendPeople == userName ? 'rightSide' : 'leftSide'">
                <span v-if="item.sendPeople != userName">{{ item.sendPeople }}</span>
                <span class="messageBox" v-if="item.messageType === 'text'">{{ item.value }}</span>
                <span class="message-content-image" v-if="item.messageType === 'img'">
                  <viewer style="display: inline">
                    <img style="width: 150px; height: 150px" :src="item.value" alt="" />
                  </viewer>
                </span>
                <span v-if="item.sendPeople == userName">{{ item.sendPeople }}</span>
              </div>
              <br />
            </li>
          </ul>
        </div>
        <div id="wangedit" ref="wangedit" class="sendMes"></div>
        <el-button class="sendButton" @click="sendMessage" type="success">发送</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "../network/home";
import E from "wangeditor";

export default {
  data() {
    return {
      roomList: [],
      activeroomid: "",
      inputMes: "你好",
      messageList: {},
      sendid: "",
      userName: localStorage.getItem("user_name"),
      firstIn: true,
      imgSrc: "",
      roomimgSrc: [],
      userid: "",
      isPc: window.innerWidth >= 767
    };
  },
  methods: {
    getRoomList() {
      api.getRoomList(localStorage.getItem("userid")).then((res) => {
        this.roomList = res.data;
        this.activeroomid = this.roomList[0]?.room_id;
        this.getMessage();
      });
    },
    //获取消息列表
    getMessage() {
      let self = this;
      this.roomList.forEach((item) => {
        this.messageList[item.room_id] = [];
      });
      this.$store.state.RoomMessage.forEach((item) => {
        self.messageList[item.message_receive].push({
          sendPeople: item.message_sent,
          value: item.message_value,
          messageType: item.message_type,
        });
      });
    },
    changeroom(id) {
      this.activeroomid = id;
    },
    //发送消息
    sendMessage() {
      let value = "",
        messageType = "text";
      if (this.editor.txt.html()) {
        let arr = this.editor.txt.html().match(/src=".*.png/g);
        if (arr?.length == 1) {
          value = arr[0].replace('src="', "");
          messageType = "img";
        } else {
          value = this.editor.txt.text();
        }
      }
      if (value == "") {
        this.$message.error("不能发送空消息");
        return;
      }
      this.$bus.$emit("message-room", {
        userName: this.userName,
        reciveRoom: this.activeroomid,
        content: value,
        messageType,
      });
      this.editor.txt.html("");
    },
    /**
     * 滚动到底部
     */
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messageView.scrollTop = this.$refs.messageView.scrollHeight;
      });
    },
  },
  mounted() {
    this.getRoomList();
    let self = this;
    this.$bus.$on("messageroomReach", function (res) {
      self.messageList[+res.roomid]?.push(res);
      self.$forceUpdate();
      self.scrollToBottom();
    });
    this.editor = new E("#wangedit");
    let editor = this.editor;
    editor.config.menus = ["emoticon"];
    editor.config.placeholder = "请输入";
    editor.create();
    editor.config.uploadImgServer = this.BASEURL + "/uploadmes";
    editor.config.uploadFileName = "file";

    //监听回车
    this.$refs.wangedit.addEventListener("keyup", (e) => {
      if (e.keyCode == "13") {
        this.sendMessage();
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("messageroomReach");
    this.$bus.$off("getroommes");
  },
};
</script>

<style lang="scss" scoped>
.singleTalkPhone{
  height: 99%;
  border: 1px solid rgb(26, 31, 1);
}
.singleTalkPc{
  height: 90%;
  margin: 24px;
  margin-bottom: 0;
  border: 1px solid rgb(26, 31, 1);
}
#roomList {
  border-right: 1px solid rgb(26, 31, 1);
  height: 100%;

  .roomListTitle {
    display: block;
    text-align: center;
    height: 50px;
    line-height: 50px;
    background-color: rgba(14, 170, 175, 0.822);
  }

  .roomListItem {
    display: block;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 55px;
    line-height: 55px;
  }

  .roomListItem:hover {
    background-color: rgba(214, 132, 132, 0.822);
    cursor: pointer;
  }

  .activeroom {
    background-color: rgba(214, 132, 132, 0.822);
    cursor: pointer;
  }
}

.flexBox {
  display: flex;
  height: 100%;
  flex-direction: column;

  .messageView {
    max-height: 380px;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 5;

    .messageBox {
      position: relative;
      top: 2px;
      padding: 5px 10px;
      background-color: rgb(0, 247, 255);
    }
  }

  .sendMes {
    position: absolute;
    width: 75%;
    bottom: 0;
    right: 0;
    height: 193px;
  }

  .sendButton {
    position: absolute;
    width: 75px;
    bottom: 0;
    right: 0;
    z-index: 99999;
  }
}

.leftSide {
  display: inline-block;
  position: relative;
  left: 2%;
}

.rightSide {
  display: inline-block;
  position: relative;
  left: 100%;
  transform: translateX(-100%);
  padding-right: 10px;
}

::v-deep .w-e-text img{
  width: 150px;
  height: auto;
}
::v-deep .w-e-toolbar{
  z-index: 1 !important;
}
::v-deep .w-e-text-container{
  height: 150px !important;
  z-index: 1 !important;
}
::-webkit-scrollbar{
  width:0;
  height:6;
}
::v-deep .w-e-menu .w-e-panel-container{
  top: -302px;
  margin-left:0 !important;
}
</style>