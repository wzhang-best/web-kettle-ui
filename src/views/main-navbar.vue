<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-mini" href="javascript:;"><img style="width: 35px;height: 35px" src="~@/assets/img/logo.png"/></a>
        <a class="site-navbar__brand-lg" href="javascript:;">
          <img style="width: 35px;height: 35px;margin-top: -5px" src="~@/assets/img/logo.png"/>
          <!--数据共享交换系统-->
          {{ systemName }}
        </a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item index="99">
          <el-badge>
          <!--  <a v-if="systemOrg === 'gsl'" href="http://172.16.68.35:8080/syml/#/home" target="_blank">基础数据库索引目录</a>-->
            <a v-if="systemOrg === 'gsl'" @click="linkSYML()" target="_blank">基础数据库索引目录</a>
          </el-badge>
        </el-menu-item>
        <el-menu-item index="0">
          <el-badge>
            <a v-if="systemOrg === 'sfb'" href="static/portal/sfb/src/index.html" target="_blank">门户</a>
            <a v-if="systemOrg === 'sfj'" @click="linkHandle()" target="_blank">门户</a>
            <a v-if="systemOrg === 'gsl'" href="static/portal/gsl/src/index.html" target="_blank">数据资源门户</a>
          </el-badge>
        </el-menu-item>
        <el-menu-item index="1">
          <el-badge>
            <a  v-if="systemOrg === 'sfb'"  href="static/page_sfb/zyzxindex.html" target="_blank">大屏</a>
          <!--  <a v-if="systemOrg === 'gsl'" href="http://172.16.69.8:8080/sjmh-frontend/#/ssl" target="_blank">数据应用门户</a>-->
          </el-badge>
        </el-menu-item>
        <el-menu-item index="2" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge ><!--value="new"-->
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>

        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updateUserHandle()">用户信息</el-dropdown-item>
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
    <update-user v-if="updateUserVisible" ref="updateUser"></update-user>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import UpdateUser from './main-navbar-update-user'
  import { clearLoginInfo } from '@/utils'

  export default {
    data () {
      return {

        updatePasswordVisible: false,
        updateUserVisible: false
      }
    },
    components: {
      UpdatePassword,
      UpdateUser
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      systemName: {
        get () { return this.$store.state.user.systemName }
      },
      systemOrg: {
        get () { return this.$store.state.user.systemOrg }
      }
    },
    methods: {
      // 修改密码
      updatePasswordHandle () {
        this.updatePasswordVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassword.init()
        })
      },
      updateUserHandle () {
        this.updateUserVisible = true
        this.$nextTick(() => {
          this.$refs.updateUser.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.mainTabs = []
              this.$cookie.delete('token')
              this.$router.options.isAddDynamicMenuRoutes = false
              clearLoginInfo()
              this.$router.replace({ name: 'login' })
            }
          })
        }).catch(() => {})
      },
      linkHandle () {
        var url = 'http://172.26.50.210:8080/#/loginirc'
        var word = '100032723,' + new Date().getTime() + ',18000000' + ',xxzyzx'
        const CryptoJS = require('crypto-js')
        var key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF')
        var srcs = CryptoJS.enc.Utf8.parse(word)
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
        window.open(url + '?encrypt=' + encrypted)
      },
      linkSYML () {
        var symlUrl = 'http://172.16.68.35:8080/syml/#/loginca?token=' + this.$cookie.get('token')
        window.open(symlUrl)
      }
    }
  }
</script>
