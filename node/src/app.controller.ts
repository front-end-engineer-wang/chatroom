import { Controller, Get, Header, Res, Post, Body, Options, Query ,UploadedFile,Render,UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor,FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { createWriteStream , readFile, readFileSync } from 'fs';
import { join } from 'path';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get()
  @Header('Access-Control-Allow-Origin', '*')
  getHtml() {
    return '<h1>Hello world</h1>';
  }

  async getUserLength(){
    let a = await this.appService.getUserLength()
    return  a
  }

  @Post('upload')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', 'post')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    let id = await this.getUserLength();
    const writeImage = createWriteStream(
      join(__dirname, '..', '../public/userImg', `${id}.png`),
    );
    writeImage.write(file.buffer);
    const data = {
      img_id: id,
    };
    return data;
  }

  @Get('getImg')
  @Header('Access-Control-Allow-Origin', '*')
  async getImg(@Query() id) {
    let list = []
    let keys = Object.keys(id)
    keys.forEach(item=>{
      list.push(readFileSync("../public/userImg/"+id[item]+".png", 'base64'))
    })
    return list
  }

  @Get('getMesImg')
  @Header('Access-Control-Allow-Origin', '*')
  async getMesImg(@Query() id) {
    let list = []
    let keys = Object.keys(id)
    keys.forEach(item=>{
      list.push(readFileSync("../public/mesImg/"+id[item]+".png"),"utf8")
    })

    return list
  }

  @Post('login')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'post')
  async login(@Body() loginInfo) {
    let msg = await this.appService.login(loginInfo)
    let result
    if (!['username or password error','hava no user'].includes(msg+'') && msg) {
      result = {
        data: {
          token: 'token',
          user_id:msg
        },
        success:true,
        status:200,
      }
    }
    else{
      result = {
        data: {
          msg
        },
        success:false,
        status:200,
      }
    }

    return result
  }

  @Post('register')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'post')
  async register(@Body() registerInfo) {
    let msg = await this.appService.register(registerInfo)
    let result ={
      data:{
        msg: msg,
      },
      success:msg === 'success',
    };
    return result
  }

  @Get('getFriends')
  @Header('Access-Control-Allow-Origin', '*')
  async getFriends(@Query() name) {
    let msg = await this.appService.getFriends(name.name)
    return JSON.parse(msg+'')
  }

  @Get('searchFriends')
  @Header('Access-Control-Allow-Origin', '*')
  async searchFriends(@Query() name) {
    let msg = await this.appService.searchFriends(name.name)
    return JSON.parse(msg+'')
  }

  @Get('getFriendRequset')
  @Header('Access-Control-Allow-Origin', '*')
  async getFriendRequset(@Query() name) {
    let msg = await this.appService.getFriendRequset(name.name)
    return JSON.parse(msg+'')
  }

  @Get('acceptFriend')
  @Header('Access-Control-Allow-Origin', '*')
  async acceptFriend(@Query() name) {
    console.log(name);
    
    let msg = await this.appService.acceptFriend(name)
    return msg
  }
  @Get('refuseFriend')
  @Header('Access-Control-Allow-Origin', '*')
  async refuseFriend(@Query() name) {
    console.log(name);
    let msg = await this.appService.refuseFriend(name)
    return msg
  }
  

  @Post('addFriendsRequest')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'post')
  async addFriendsRequest(@Body() requestInfo) {
    let msg = await this.appService.addFriendsRequest(requestInfo)
    let result ={
      msg: msg,
    };
    return result
  }


  @Post('createRoom')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'post')
  async createRoom(@Body() RoomInfo) {
    let msg = await this.appService.createRoom(RoomInfo)
    let result ={
      data:{
        msg: msg,
      },
      success:msg === 'success',
    };
    return result
  }

  @Get('getRoomList')
  @Header('Access-Control-Allow-Origin', '*')
  async getRoomList(@Query() id) {
    let msg = await this.appService.getRoomList(id.id)
    return JSON.parse(msg+'')
  }

  @Get('getMessage')
  @Header('Access-Control-Allow-Origin', '*')
  async getMessage(@Query() id) {
    let msg = await this.appService.getFriendsMessage(id.id)
    let msg1 = await this.appService.getRoomMessage(id.id)
    return {
      friendsMessage:JSON.parse(msg+''),
      roomMessage:JSON.parse(msg1+'')
    }
  }


  @Options('login')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'content-type')
  sussss() {
    return 'ok'
  }

  @Options('upload')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'content-type')
  sussss2() {
    return 'ok'
  }

  @Options('createRoom')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'content-type')
  susssss2() {
    return 'ok'
  }

  @Options('uploadmes')
  @Header('Access-Control-Allow-Origin', '*')
  @Header("Access-Control-Allow-Headers", 'content-type')
  sussssss2() {
    return 'ok'
  }
  
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
        url: `http://192.168.123.88:3000/static/mesImg/${random}.png`,
        alt: "图片文字说明",
        href: "跳转链接"
      }]    
    };

    return data;
  }
}
