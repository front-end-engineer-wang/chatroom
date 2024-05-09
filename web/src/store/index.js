import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo:{},
    currentmenu:[],
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
