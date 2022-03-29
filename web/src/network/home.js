import {require} from './request'
import Qs from "qs";

export default {
    //好友列表
    getFriends(name){
        return require({
            url:`/getFriends?name=${name}`,
        })
    },
    // 查找用户
    searchFriends(name){
        return require({
            url:`/searchFriends?name=${name}`,
        })
    },
    //添加申请
    sentRequest(params){
        return require({
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            url:"/addFriendsRequest",
            data: Qs.stringify(params)
        })
    },
    // 申请列表
    getFriendRequset(name){
        return require({
            url:`/getFriendRequset?name=${name}`,
        })
    },
    //同意申请
    acceptFriend(acceptInfo){
        return require({
            url:`/acceptFriend?request_accept=${acceptInfo.request_accept}&&request_send=${acceptInfo.request_send}`,
        })
    },
    //拒绝申请
    refuseFriend(acceptInfo){
        return require({
            url:`/refuseFriend?request_accept=${acceptInfo.request_accept}&&request_send=${acceptInfo.request_send}`,
        })
    },
    //获取图片
    getImg(params){
        return require({
            url:`/getImg?${Qs.stringify(params)}`,
        })
    },
    //创建聊天室
    createRoom(params){
        return require({
            method: 'post',
            headers: { "Content-Type": "application/json" },
            url:"/createRoom",
            data: params
        })
    },
    // 获取聊天室列表
    getRoomList(id){
        return require({
            url:`/getRoomList?id=${id}`,
        })
    },
    // 获取聊天记录
    getMessage(id){
        return require({
            url:`/getMessage?id=${id}`,
        })
    },
}