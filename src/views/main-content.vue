<template>
  <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
    <!-- 主入口标签页 s -->
    <el-tabs
      v-if="$route.meta.isTab"
      v-model="mainTabsActiveName"
      :closable="true"
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle">
      <el-dropdown class="site-tabs__tools" :show-timeout="0">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsRefreshCurrentHandle">刷新当前标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name">
        <el-scrollbar :style="siteContentScrollHeight" >
          <el-card :body-style="siteContentViewHeight"  class="main-body">
            <iframe
              v-if="item.type === 'iframe'"
              :src="item.iframeUrl"
              width="100%" :style="siteContentViewHeight" frameborder="0" scrolling="no">
            </iframe>
            <keep-alive v-else>
              <router-view v-if="item.name === mainTabsActiveName" />
            </keep-alive>
          </el-card>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-scrollbar v-else :style="siteContentScrollHeight" class="scrollbar">
      <el-card :body-style="siteContentViewHeight" class="main-body">
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-card>
    </el-scrollbar>
  </main>
</template>

<script>
  import { isURL } from '@/utils/validate'
  export default {
    data () {
      return {
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      },
      siteContentScrollHeight () {
        var height = this.documentClientHeight - 110
        if (this.$route.meta.isTab) {
          height -= 10
          return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { height: height + 'px' }
        }
        height += 30
        return { height: height + 'px' }
      },
      siteContentViewHeight () {
        var height = this.documentClientHeight - 110 - 2
        if (this.$route.meta.isTab) {
          height -= 10
          return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
        }
        return { minHeight: height + 'px' }
      }
    },
    methods: {
      // tabs, 选中tab
      selectedTabHandle (tab) {
        tab = this.mainTabs.filter(item => item.name === tab.name)
        if (tab.length >= 1) {
          this.$router.push({ name: tab[0].name })
        }
      },
      // tabs, 删除tab
      removeTabHandle (tabName) {
        var newTabs = this.mainTabs.filter(item => item.name !== tabName)
        if (newTabs.length >= 1) {
          // 当前选中tab被删除
          if (tabName === this.mainTabsActiveName) {
            this.$router.push({ name: newTabs[newTabs.length - 1].name }, () => {
              this.mainTabsActiveName = this.$route.name
            })
          }
          this.mainTabs = newTabs
        } else {
          this.menuActiveName = ''
          this.$router.push({ name: 'home' })
        }
      },
      // tabs, 关闭当前
      tabsCloseCurrentHandle () {
        this.removeTabHandle(this.mainTabsActiveName)
      },
      // tabs, 关闭其它
      tabsCloseOtherHandle () {
        this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
      },
      // tabs, 关闭全部
      tabsCloseAllHandle () {
        this.mainTabs = []
        this.menuActiveName = ''
        this.$router.push({ name: 'home' })
      },
      // tabs, 刷新当前
      tabsRefreshCurrentHandle () {
        var tempTabName = this.mainTabsActiveName
        this.removeTabHandle(tempTabName)
        this.$nextTick(() => {
          this.$router.push({ name: tempTabName })
        })
      }
    }
  }
</script>

<style>
  .scrollbar{
    scrollbar-width: none;
    overflow: hidden;
    position: relative;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-bottom: -17px;
    margin-right: -17px;
  }
  .el-dialog__body {
    overflow: auto;
    padding: 5px 20px;
  }
  .dialog {
    display: flex;
    flex-direction: column;
    margin-top: 0px !important;
    position: absolute;
    width: calc(100% - 260px) !important;
    height: calc(100% - 130px) !important;
    left: 245px;
    top: 110px;
  }
  .el-card__body{
    padding: 10px;
  }
</style>
