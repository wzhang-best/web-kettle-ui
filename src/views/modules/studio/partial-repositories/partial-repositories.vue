<template>
  <div id="repositoryClass"
    v-loading.lock="loading"
    element-loading-text="加载中">
    <div style="padding: 15px;">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" ref="breadcrumb">
        <el-breadcrumb-item>
          <el-button @click="pathSkip()" type="text">/</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="bread in navigation.breadList" v-bind:key="bread.ID">
          <el-button @click="pathSkip(bread)" type="text"> {{ bread.name }}</el-button>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-table
        :data="repository.data"
        stripe
        border
        tooltip-effect="dark"
        style="100%"
        @row-dblclick="rowDbclick">
        <el-table-column v-if="(repository.index!==false)"
          fixed
          type="index"
          width="50"
          header-align="center"
          align="center">
        </el-table-column>
        <template v-for="(column, index) in repository.columns">
          <el-table-column
            v-if="column.prop === 'name'"
            :prop="column.prop"
            :label="column.label"
            :key="index">
            <template slot-scope="scope">
              <img :src="`${trans.image}`" v-if="scope.row.type === `${trans.type}`"/>
              <img :src="`${job.image}`" v-if="scope.row.type === `${job.type}`"/>
              <img :src="`${directory.image}`" v-if="scope.row.type === `${directory.type}`"/>
              <a href="javascript:void(0)" @click="addPath(scope.row)" v-if="scope.row.type === 'directory'">{{scope.row[column.prop]}}</a>
              <span v-else-if="scope.row.type !== 'directory'">{{scope.row[column.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column v-else-if="((!column.type || column.type==='normal') && (column.visible!==false))"
            :key="index"
            :prop="column.prop"
            :label="column.label">
          </el-table-column>
        </template>
      </el-table>
    </div>

  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
// @ is an alias to /src
import API from '@/api';
// 全局常量
import * as global from '@/views/modules/studio/common/common.js';
export default {
  name: 'PartialRepositories',
  props: {
  },
  data () {
    return {
      type: '',
      // 资源列表
      repository: {
        index: true,
        columns: [
          { type: 'normal', visible: false, prop: 'id', label: 'ID' },
          { type: 'normal', prop: 'name', label: '名称' },
          { type: 'normal', prop: 'type', label: '类型' },
          { type: 'normal', prop: 'path', label: '路径' }
        ],
        data: []
      },
      // 路径导航
      navigation: {
        path: '', // 记录路径
        parentPath: '',
        breadList: [], // 存放路径数据
        flag: false
      },
      // 弹框
      dialog: {
        visible: false,
        title: ''
      },
      // 表单
      form: {
        name: '',
        flag: '', // 保存表单操作行为 add edit
        type: '' // 保存资源类型
      },
      loading: false,
      trans: {
        type: global.TRANS_MODEL,
        image: global.TRANS_IMAGE_PATH
      },
      job: {
        type: global.JOB_MODEL,
        image: global.JOB_IMAGE_PATH
      },
      directory: {
        type: global.DIRECTORY_MODEL,
        image: global.DIRECTORY_IMAGE_PATH
      }
    };
  },
  methods: {
    // =======================路径跳转操作==========================
    // 路径跳转
    async pathSkip (row) {
      if (row) {
         // 重新组织路径数据
        await this.putBreadData(row);
        // 根据路径获取列表数据
        await this.listRepository(row.path, this.type);
        this.navigation.parentPath = row.path;
      } else {
        // 点击根路径
        this.navigation.breadList = [];
        this.listRepository('/', this.type);
        this.navigation.parentPath = '/';
      }
    },
    // 点击超链接跳转
    async addPath (row) {
      for (let i = 0; i < this.navigation.breadList.length; i++) {
        if (row.id === this.navigation.breadList[i].id) {
          return;
        }
      }
      this.navigation.breadList.push(row);
      // 获取路径
      // const path = await this.getPath(this.navigation.breadList);
      // 根据路径获取列表数据
      this.navigation.parentPath = row.path;
      await this.listRepository(row.path, this.type);
    },
    // 组织路径数据
    putBreadData (bread) {
      this.navigation.flag = false;
      if (bread && bread !== '/') {
        for (let i = 0; i < this.navigation.breadList.length; i++) {
          if (bread.id === this.navigation.breadList[i].id) {
            // 当前节点为数组中最后一个节点时 不操作
            if (i === this.navigation.breadList.length - 1) {
              return;
            } else {
              this.navigation.flag = true;
            }
          }
          // 当前节点不是最后一个节点时，去掉后面多余节点
          if (this.navigation.flag) {
            this.navigation.breadList.pop();
          }
        }
      } else {
        // 点击根目录
        this.navigation.breadList = [];
      }
    },
    async rowDbclick (row) {
      if (row.type === 'directory') {
        this.addPath(row);
      } else {
        this.$emit('setFilePath', row);
      }
    },
    // 获取数据=======================
    // 获取目录、转换及作业列表
    listRepository (path, type) {
      var params = {
        'path': path,
        'type': type
      };
      API.repository.list(params)
      .then(res => {
        this.repository.data = res.data;
      })
      .catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    }
  },
  mounted () {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
