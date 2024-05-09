<template>
  <div class="login">
    <div class="login-form">
      <p>用户登录</p>
      <div class="login-form-inputbox">
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
          type="password"
        >
        </el-input>
      </div>
      <div class="login-form-operatebox">
        <a href="#" class="operatebox-forget">忘记密码?</a>
        <div style="text-align: center; width: 260px">
          <el-button type="primary" round @click="loging">登录</el-button>
        </div>
        <a @click="register" class="operatebox-register">注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from "qs";
export default {
  name: "Login",
  data() {
    return {
      user: {
        username: "",
        password: "123", 
      },
    };
  },
  methods: {
    loging() {
      //登录功能，发起post请求，传入用户名和密码两个参数
      var data = Qs.stringify({
        username: this.user.username,
        password: this.user.password,
      });
      axios
        .post(
          this.BASEURL+'/login',
          data,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            //请求成功
            if (res.data.success == true) {
              //密码正确
              localStorage.setItem("token", res.data.data.token); //localStorage设置token
              localStorage.setItem("user_name", this.user.username); //localStorage设置user_name
              localStorage.setItem("userid", res.data.data.user_id); //localStorage设置user_id
              this.$router.push("/base");
            } else {
              //密码错误
              this.$message({
                message: "账号或者密码错误",
                type: "error",
              });
            }
          }
        });
    },
    register(){
      this.$router.push('./register')
    }
  },
};
</script>

<style lang="scss" scoped>
.login {
  background-image: url("../assets/bgc.jpeg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.login-form {
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
.login-form-inputbox {
  height: 100px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 37px 5px;
  justify-content: space-between;
}
.login-form-operatebox {
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
  cursor: pointer;
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
</style>
