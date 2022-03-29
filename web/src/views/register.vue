<template>
  <div class="register">
    <div class="register-form">
      <p>用户注册</p>
      <div class="register-form-inputbox">
        <el-input
          placeholder="用户名"
          prefix-icon="el-icon-user-solid"
          v-model="user.username"
        >
        </el-input>
        <el-input
          placeholder="密码"
          prefix-icon="el-icon-lock"
          v-model="user.password"
        >
        </el-input>
        <el-input
          placeholder="确认密码"
          prefix-icon="el-icon-lock"
          v-model="user.confirmPassword"
        >
        </el-input>
        <span class="imgText">上传图片</span>
        <el-upload
          class="avatar-uploader"
          :action="uploadurl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img id="userimg" v-show="imageUrl" :src="imageUrl" class="avatar" />
          <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="register-form-operatebox">
        <div style="text-align: center; width: 260px">
          <el-button type="primary" round @click="register">注册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from "qs";
export default {
  name: "register",
  data() {
    return {
      user: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      imageUrl: "",
      imageId: "",
      headers: {
        "Access-Control-Request-Method": "post",
        "Access-Control-Request-Headers ": "Content-Type",
      },
    };
  },
  computed: {
    uploadurl() {
      return this.BASEURL+'/upload'
    },
    registerUrl() {
      return this.BASEURL+'/register'
    }
  },
  methods: {
    register() {
      let user = this.user;
      if (user.username == "") {
        this.$message("请输入用户名");
        return;
      }
      if (user.password == "") {
        this.$message("请输入密码");
        return;
      }
      if (user.password !== user.confirmPassword) {
        this.$message("2次输入的密码要相同");
        return;
      }
      if(this.imageId == ''){
          this.$message('请上传图片')
          return
      }
      this.register2();
    },
    register2() {
      //发起post请求，传入用户名和密码两个参数
      var data = Qs.stringify({
        username: this.user.username,
        password: this.user.password,
        user_img : this.imageId,
      });
      axios
        .post(this.registerUrl, data, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then((res) => {
          console.log(res);
          if (res.status == 200 || res.status == 201) {
            //请求成功
            if (res.data.success == true) {
              //密码正确
              this.$message("注册成功");
              localStorage.setItem("token", 'token'); //localStorage设置token
              sessionStorage.setItem("user_name", this.user.username); //sessionStorage设置user_name
              sessionStorage.setItem("userid", this.imageId); //sessionStorage设置user_id
              this.$router.push("/base");
            } else {
              this.$message({
                message: "错误，请重试",
                type: "error",
              });
            }
          }
        });
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      this.imageId = res.img_id
      this.imageUrl = window.URL.createObjectURL(file.raw);
    },
  },
  mounted () {
  },
};
</script>

<style lang="scss" >
.register {
  background-image: url("../assets/bgc.jpeg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.register-form {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;
  width: 260px;
  height: 400px;
  padding: 0 43px;
  p {
    text-align: center;
    padding: 20px;
    // box-shadow: 0px 15px 1px -15px #000;
    border-bottom: 1px solid rgba(145, 141, 141, 0.144);
  }
}
.register-form-inputbox {
  height: 270px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 5px;
  justify-content: space-between;
  .imgText {
    font-size: 14px;
  }
}
.register-form-operatebox {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}
.operatebox-forget {
  color: rgb(119, 115, 115);
  text-decoration: none;
}
.operatebox-register {
  color: rgb(11, 162, 207);
}
::v-deep .el-input__inner {
  border-radius: 50px;
  padding-left: 50px;
  height: 45px;
}
::v-deep .el-input__icon {
  font-size: 20px;
  padding: 0 10px;
}
.el-button {
  width: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #a70303;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>