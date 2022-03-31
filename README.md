# 前端代码在web目录下执行npm install 命令，然后执行npm run serve
# 后端代码在node目录下执行npm install 命令，然后执行npm run start:dev
# 需要安装node  （最好是12版本的）

# 数据库需要mysql    需要修改连接的用户名和密码
# 创建"聊天系统" 数据库，然后再该数据库下执行sql文件
# 注意要是utf8mb4格式的数据库

# 由于地址不一样，所以要手动修改一下地址
# 目录：
# 前端：src\network\config.js 
# 将地址换掉，端口不变。
# const BASEURL = 'http://192.168.123.88:3000'
# const SOCKET_BASEURL = 'http://192.168.123.88:3030'


# 后端：src\app.controller.ts
@Post('uploadmes')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', 'post')
  @UseInterceptors(FileInterceptor('file'))
  async uploadmesFile(@UploadedFile() file: Express.Multer.File) {
    const random = Date.now()
    const writeImage = createWriteStream(
      join(__dirname, '..', '../public/mesImg', `${random}.png`),
    );
    writeImage.write(file.buffer);
    const data = {
      errno: 0,
      data:[{
#         url: `http://192.168.123.88:3000/static/mesImg/${random}.png`,     这里也要换掉
        alt: "图片文字说明",
        href: "跳转链接"
      }]    
    };

    return data;
  }