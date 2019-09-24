<template>
  <div class="datavLayout">
    <el-form class="login-main" :model="dataForm" :rules="dataRule" ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             status-icon>
      <div style="width: 458px; height: 100px;">
        <div class="log">
          <span class="title">系统登录</span>
        </div>
      </div>

      <el-form-item prop="userName">
        <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input v-model="dataForm.captcha" placeholder="验证码">
            </el-input>
          </el-col>
          <el-col :span="10" class="login-captcha">
            <img :src="captchaPath" @click="getCaptcha()" height="40px;" alt="">
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getUUID} from '@/utils'

  export default {
    beforeCreate: function () {
      document.getElementsByTagName('body')[0].className = 'container'
    },
    beforeDestroy: function () {
      document.body.removeAttribute('class', 'container')
    },
    data () {
      return {
        margin: '200px auto',
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      // this.margin = (document.documentElement.clientHeight - 360) / 2 + 'px auto'
      // this.$refs.dataForm.style = 'margin: ' + this.margin
      this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.encrypt(this.dataForm.password),
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token, {expires: `${data.expire || 0}s`})
                this.$router.replace({name: 'home'})
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      },
      encrypt (word) {
        const CryptoJS = require('crypto-js')
        var key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF')
        var srcs = CryptoJS.enc.Utf8.parse(word)
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
        return encrypted.toString()
      }
    }
  }
</script>

<style lang="scss">
  .datavLayout {
    width:100%;
    height:100%;
    background-size:100% 100%;
    position:absolute;
    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='bg-login.png',sizingMethod='scale');
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgb(22, 26, 52);
    // background-image: url(~@/assets/img/bg1.png)
    // width: 1920px;
    // height: 1080px;
    // transform: scale(0.646875);
    //transform-origin: left top 0px;
  }

  .datavLayout .el-input__inner {
    background-color: rgba(255, 255, 255, 0);
    box-shadow: 0 0 25px #cac6c6;
  }

  .login-main {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    height: 410px;
    width: 530px;
    padding: 35px 35px 15px 35px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .log {
    width: 100%;
    height: 100%;
    opacity: 1;
    background-image: url(~@/assets/img/log-bg.gif);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    text-align: center;
  }

  .title {
    margin: 0px auto;
    text-align: center;
    color: #3e8ef7;
    font-size: 18px;
  }

  .login-btn-submit {
    margin-top: 20px;
    width: 120px;
    opacity: 0.8;
  }
</style>
