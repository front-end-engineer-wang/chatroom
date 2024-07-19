# 项目简介：
  一个简易的聊天系统，可以单聊，也可以创建多人聊天室，可以添加好友，支持视频通话
  项目已经部署在线上了： 地址： https://8.138.112.46
  可以注册也可以用 用户: user 密码：123
# 技术选型
  vue2 + nest.js + mysql + socket.io + webSocket + webRTC
# 前端代码运行
  在web目录下执行npm install 命令，然后执行npm run serve
# 后端代码运行
  在node目录下执行npm install 命令，然后执行npm run start:dev

# mysql修改点
  创建 "chatroom" 数据库，然后再该数据库下执行.sql文件初始化数据库（source命令）
  node/src/app.service 下修改连接的用户名和密码

# 修改请求地址 由于地址不一样，所以要手动修改一下地址
  目录：
  web\src\network\config.js 
