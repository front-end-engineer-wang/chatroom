import { Injectable } from '@nestjs/common';
//连接数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '888',
  database: 'chatroom'
});
connection.connect();

//连接socket
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{cors:true});
const socketList = {}  //连接池
let usernameMap = {}
connection.query('select user_id,user_name from user',(err,res)=>{
  if(res){
    usernameMap = {}
    res.forEach(item=>{
      usernameMap[item.user_id] = item.user_name
    })
    console.log(res);
  }
})
io.on('connection', (socket) => {
  console.log(Object.keys(socketList).length, "******");
  
  let key = socket.handshake.query['my-key']   //连接的参数--用户名
  socketList[key] = socket
  socket.on('message', (msg) => {
    console.log(msg);
    //发送给对方
    if(socketList[msg.reciveName]){
      socketList[msg.reciveName].emit('messageReach',{
        value: msg.content,
        sendPeople: msg.userName,
        messageType:msg.messageType,
      }) 
    } else {
      socket.emit('error','your friend is not inline')
    }
    let id1 = Object.keys(usernameMap).find(item=>{
      return usernameMap[item] == msg.userName
    })
    let id2 = Object.keys(usernameMap).find(item=>{
      return usernameMap[item] == msg.reciveName
    })
    connection.query(`INSERT INTO message_friends (message_sent,message_receive,message_value,message_type) VALUES (${id1},${id2},'${msg.content}','${msg.messageType}')`)
    //显示自己的消息
    socket.emit('messageSucess',{
      value: msg.content,
      sendPeople: msg.userName,
      messageType:msg.messageType,
    })
    
  });
  socket.on('disconnect',()=>{
    console.log('disconnect');
    socketList[key] = null
  });
  socket.on('messageroom', (msg) => {
    //聊天室用户名字
    console.log(msg);
    let str=`SELECT user_name FROM (SELECT user_id FROM roomuser WHERE room_id = ${msg.reciveRoom}) as roomuser INNER JOIN user ON roomuser.user_id = user.user_id`
    connection.query(str, (error, results, fields) => {   
      results?.forEach(item=>{
        if(socketList[item.user_name]){
          console.log(item.user_name + msg.content);
          socketList[item.user_name].emit('messageroomReach',{
            value: msg.content,
            sendPeople: msg.userName,
            roomid: msg.reciveRoom,
            messageType: msg.messageType
          }) 
        }
      })
    })
    let id = Object.keys(usernameMap).find(item=>{
      return usernameMap[item] == msg.userName
    })
    //存入数据库
    connection.query(`INSERT INTO message_room (message_sent,message_receive,message_value,message_type) VALUES (${id},${msg.reciveRoom},'${msg.content}','${msg.messageType}')`)
  })
  // webrtc相关
  socket.on('offer', (data) => {
    console.log('offer');
    if(!socketList[data.userName]) {
      return
    }
    socketList[data.userName].emit('offer', data)
  })
  // 用户发送 answer
  socket.on('answer', (data) => {
    console.log('answer');
    if(!socketList[data.userName]) {
      return
    }
    socketList[data.userName].emit('answer', data)
  })
});
server.listen(3030, () => {
});


@Injectable()
export class AppService {
  //登录
  login(loginInfo) {
    return new Promise((resolve, rej) => {
      let str = `SELECT * from user where user_name='${loginInfo.username}'`    
      connection.query(str, (error, results, fields) => {
        if (results?.length === 1) {
          let id = Object.keys(usernameMap).find(item=>{
            return usernameMap[item] == loginInfo.username
          })
          if (results[0].user_password === loginInfo.password) resolve(id)
          else resolve('username or password error')
        }
        else resolve('hava no user')
      })
    })
  }
  //好友列表
  getFriends(name) {    
    let str = `SELECT friend.friend_name,friend.user_friend,user.user_img, friend.user_id FROM (SELECT * FROM friend WHERE user_name= '${name}') as friend INNER JOIN user WHERE friend.user_friend = user.user_id`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {  
        let res = JSON.stringify(results)
        resolve(res)
      })
    })
  }
  //获取私聊聊天记录
  getFriendsMessage(id){
    let str = `SELECT * from message_friends where message_sent = ${id} or message_receive = ${id}`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {  
        results?.forEach(item=>{
          item.message_sent = usernameMap[item.message_sent]
          item.message_receive = usernameMap[item.message_receive]
        })
        let res = JSON.stringify(results|| {})
        resolve(res)
      })
    })
  }
   //获取聊天室聊天记录
  getRoomMessage(roomList){
    const ids =  roomList.map(item=> item.room_id ).join(",") || -1
    let str = `SELECT * from message_room where message_receive in (${ids})`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {  
        results?.forEach(item=>{
          item.message_sent = usernameMap[item.message_sent]
        })
        let res = JSON.stringify(results|| {})
        resolve(res)
      })
    })
  }
  //注册
  register(registerInfo){
    return new Promise((resolve, rej) => {
      let str2 = `SELECT * FROM friend WHERE user_name= '${registerInfo.username}'`
      connection.query(str2, (error, results) => {
        if(error){
          console.log(error);
          resolve('error,code')
        } else if(results.length != 0){
          resolve('user_name has benn used')
        } else{
          let str =`INSERT INTO user (user_name,user_password,user_img) VALUES ('${registerInfo.username}', '${registerInfo.password}','${registerInfo.user_img}')`
          connection.query(str, (error, results) => {
            if(error){
              resolve('error,code')
            } else {
              this.getusernameMap()
              resolve('success')
            }
          })
        }
      })
      
    })
  }
  //查找用户
  searchFriends(name) {    
    let str=`SELECT user_name , user_id FROM user WHERE user_name like '%${name}%'`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {    
        console.log(error);
            
        let res = JSON.stringify(results)
        resolve(res)
      })
    })
  }
  //添加好友请求
  addFriendsRequest(requestInfo){
    return new Promise((resolve, rej) => {
      let str2 =`SELECT * FROM request where request_send = '${requestInfo.request_send}' && request_accept = '${requestInfo.request_accept}'`;
      connection.query(str2, (error, results) => {
        if(error){
          resolve('error,code')
        } else {
          if(results.length == 0){
            let str =`INSERT INTO request (request_send,request_accept,request_status) VALUES ('${requestInfo.request_send}', '${requestInfo.request_accept}',1)`
            connection.query(str, (error, results) => {
              if(error){
                resolve('error,code')
              } else {
                resolve('success')
              }
            })
          } else {
            resolve('已发送申请，请不要重复申请')
          }
        }
      })
      
    })
  }
  //获取添加申请
  getFriendRequset(name) {    
    let str=`SELECT request_send , request_status FROM request WHERE request_accept = '${name}'`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {    
        let res = JSON.stringify(results)
        resolve(res)
      })
    })
  }
  //同意申请
  async acceptFriend(info){
    let id1 = await this.getuserid(info.request_accept)
    let id2 = await this.getuserid(info.request_send)
    let str= `INSERT INTO friend (user_name,friend_name,user_id,user_friend) VALUES ('${info.request_send}','${info.request_accept}',${id2},${id1}),('${info.request_accept}','${info.request_send}',${id1},${id2})`
    connection.query(str, (error, results, fields) => {    
      console.log(error);
      console.log(results);
      let str2=`UPDATE request SET request_status=2 WHERE request_accept = '${info.request_accept}' && request_send = '${info.request_send}' `
      return new Promise((resolve, rej) => {
        connection.query(str2, (error, results, fields) => {     
          resolve(results)
        })
    })
    })
    
  }
  //拒绝申请
  async refuseFriend(info){
      let str2=`UPDATE request SET request_status=3 WHERE request_accept = '${info.request_accept}' && request_send = '${info.request_send}' `
      return new Promise((resolve, rej) => {
        connection.query(str2, (error, results, fields) => { 
          resolve(results)
        })
    })
    
  }
  //新建聊天室
  createRoom(RoomInfo){
    return new Promise((resolve, rej) => {
      let str2 =`INSERT INTO chatroom (room_name,room_creat) VALUES ('${RoomInfo.room_name}','${RoomInfo.room_creat}')`
      connection.query(str2, (error, results) => {
        if(error){
          console.log(error);
          resolve('error,code')
        } else{
          let str =`INSERT INTO roomuser (room_id,user_id) VALUES (${results.insertId}, ${RoomInfo.room_creat})`
          RoomInfo.userList.forEach(item=>{
            str += `,(${results.insertId},${item})`
          })
          console.log(str);
          
          connection.query(str, (error, results) => {
            if(error){
              resolve('error,code')
            } else {
              resolve('success')
            }
          })
        }
      })
      
    })
  }
  //聊天室列表
  getRoomList(id){
    let str=`SELECT * FROM (SELECT * FROM roomuser WHERE user_id = ${id}) as roomuser INNER JOIN chatroom ON chatroom.room_id = roomuser.room_id`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {    
        let res = JSON.stringify(results)
        resolve(res)
      })
    })
  }
  //聊天室用户名字
  getRoomUserName(room_id){
    let str=`SELECT user_name FROM (SELECT user_id FROM roomuser WHERE room_id = ${room_id}) as roomuser INNER JOIN user ON roomuser.user_id = user.user_id`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {    
        let res = JSON.stringify(results)
        resolve(res)
      })
    })
  }














  // 生成图片id
  async getUserLength(){
    let str = 'select max(user_img) as id from user'
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results) => { 
        let a = +results[0].id
        resolve(Number(a+1))        
      })
  })
  }
  //获取用户id
  getuserid(name){
    let str=`SELECT user_id FROM user WHERE user_name= '${name}'`
    return new Promise((resolve, rej) => {
      connection.query(str, (error, results, fields) => {        
        let res = results
        resolve(res[0]?.['user_id'])
      })
    })
  }
  //映射表
  getusernameMap(){
    connection.query('select user_id,user_name from user',(err,res)=>{
      if(res){
        usernameMap = {}
        res.forEach(item=>{
          usernameMap[item.user_id] = item.user_name
        })
        console.log(res);
      }
    })
  }
  
}

