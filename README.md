# 技术选型
  vue2 + nest.js + mysql + socket.io
# 前端代码运行
  在web目录下执行npm install 命令，然后执行npm run serve
# 后端代码运行
  在node目录下执行npm install 命令，然后执行npm run start:dev

# mysql修改点
  创建 "chatroom" 数据库，然后再该数据库下执行.sql文件初始化数据库（source命令）
  node/src/app.service 下修改连接的用户名和密码
  注意要是utf8mb4格式的数据库

# 修改请求地址 由于地址不一样，所以要手动修改一下地址
  目录：
  web\src\network\config.js 
  将地址换成自己的，端口不变。
  const BASEURL = 'http://192.168.123.88:3000'
  const SOCKET_BASEURL = 'http://192.168.123.88:3030'
