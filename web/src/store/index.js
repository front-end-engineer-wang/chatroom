import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo:{},
    currentpath:'/base',   //当前的路由路径
    currentmenu:[{
      index:'/base',
      name:'我的好友',
      icon:'el-icon-s-home'
    },{
      index:'/addFriend',
      name:'添加好友',
      icon:'el-icon-user'
    },{
      index: "/friendApplication",
      name: "好友申请",
      icon: "el-icon-user",
    }],
    friendList:[],   //好友列表
    RoomMessage:[],
  },
  mutations: {
    changeMenu(state,payload){
      state.currentmenu=payload.menu
    },
    setUserId(state,payload){
      state.userinfo=payload.userinfo
    },
    setFriendList(state,payload){
      state.friendList=payload
    },
    setRoomMessage(state,payload){
      state.RoomMessage=payload
    },
  },
  actions: {
  },
  modules: {
  }
})
