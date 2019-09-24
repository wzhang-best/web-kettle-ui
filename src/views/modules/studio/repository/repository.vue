/**
  打开资源库
 */
<template>
  <div
    id="repositoryClass"
    class="repositoryClass"
    v-loading.lock="loading"
    element-loading-text="加载中，请耐心等待">
    <div>
      <!--
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>根目录</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-button type="primary" size="small" @click="createDirectory">创建目录</el-button>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" ref="breadcrumb">
        <el-breadcrumb-item>
          <el-button @click="pathSkip()" type="text">根目录</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="bread in navigation.breadList" v-bind:key="bread.ID">
          <el-button @click="pathSkip(bread)" type="text"> {{ bread.name }}</el-button>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-table
        class="u-table"
        :data="repository.data"
        stripe
        border
        tooltip-effect="dark"
        style="100%"
        height="393"
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
            :key="index"
            min-width="160"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <img :src="`${trans.image}`" v-if="scope.row.type === `${trans.type}`"/>
              <img :src="`${job.image}`" v-if="scope.row.type === `${job.type}`"/>
              <img :src="`${directory.image}`" v-if="scope.row.type === `${directory.type}`"/>
              <a href="javascript:void(0)" @click="addPath(scope.row)" v-if="scope.row.type === 'directory'">{{scope.row[column.prop]}}</a>
              <span v-else-if="scope.row.type !== 'directory'">{{scope.row[column.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column v-else-if="column.prop === 'type'"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            width="120"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column v-else-if="((!column.type || column.type==='normal') && (column.visible!==false))"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            min-width="160"
            :show-overflow-tooltip="true">
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
          width="100">
          <template slot-scope="scope">
            <!-- <el-button v-if="(scope.row['type'] === '目录')" type="text" size="small" @click="pathSkip(scope.row)">进入</el-button>
            <el-button type="text" size="small" @click="openRepository(scope.row)">打开</el-button> -->
            <el-button type="text" size="small" @click="handlerRename(scope.row)">重命名</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建/编辑弹框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="30%"
      top="15%">
      <el-form ref="form" :model="form" @keyup.enter.native="handleSubmit()">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" v-focus id="directoryNameInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="dialog.visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
// @ is an alias to /src
import API from '@/api';
// 全局常量
import * as global from '@/views/modules/studio/common/common.js';
// 公共方法
import * as studio from '@/views/modules/studio/js/studio-handler.js';
export default {
  name: 'Repository',
  props: {
  },
  data () {
    return {
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
      loading: false, // 加载数据时显示动效的控制
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
  components: {
  },
  computed: {
  },
  methods: {
    // =======================路径跳转操作==========================
    // 路径跳转
    async pathSkip (row) {
      if (row) {
         // 重新组织路径数据
        await this.putBreadData(row);
        // 根据路径获取列表数据
        await this.listRepository(row.path);
        this.navigation.parentPath = row.path;
      } else {
        // 点击根路径
        this.navigation.breadList = [];
        this.listRepository('/');
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
      await this.listRepository(row.path);
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
    // =======================列表操作==============================
    // 删除==================
    async handleDelete (row) {
      const parent = row.parent;
      var params = {
        'path': row.path
      };
      if (row.type === 'directory') {
        this.deleteDirectory(params, parent);
      } else if (row.type === 'transformation') {
        this.deleteTrans(params, parent);
      } else if (row.type === 'job') {
        this.deleteJobs(params, parent);
      }
    },
    // 删除目录
    deleteDirectory (params, parent) {
      this.$confirm('确定删除该目录及其子目录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.repository.delDirectories(params)
        .then(res => {
          this.listRepository(parent);
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        })
        .catch(error => {
          this.$message({
            message: error.data.error.message,
            type: 'warning'
          });
        });
      });
    },
    // 删除转换
    deleteTrans (params, parent) {
      this.$confirm('确定删除该转换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.repository.delTrans(params)
        .then(res => {
          this.listRepository(parent);
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        })
        .catch(error => {
          this.$message({
            message: error.data.error.message,
            type: 'warning'
          });
        });
      });
    },
    // 删除作业
    deleteJobs (params, parent) {
      this.$confirm('确定删除该作业?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.repository.delJobs(params)
        .then(res => {
          this.listRepository(parent);
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        })
        .catch(error => {
          this.$message({
            message: error.data.error.message,
            type: 'warning'
          });
        });
      });
    },
    // 创建 修改====================
    // 创建目录
    createDirectory () {
      this.dialog.visible = true;
      this.dialog.title = '创建目录';
      this.form.flag = 'add';
      this.form.name = '';
    },
    // 修改名称
    handlerRename (row) {
      this.dialog.visible = true;
      this.dialog.title = '重命名';
      this.form.name = row.name;
      this.form.flag = 'edit';
      this.form.type = row.type;
      this.navigation.path = row.path;
    },
    // 提交
    handleSubmit () {
      if (this.form.flag === 'add') {
        this.addSubmit();
      } else if (this.form.flag === 'edit') {
        this.editSubmit();
      }
    },
    // 新增提交
    async addSubmit () {
      var params = {
        'parent': this.navigation.parentPath,
        'name': this.form.name
      };
      API.repository.create(params)
      .then(res => {
        this.dialog.visible = false;
        this.listRepository(this.navigation.parentPath);
        this.$message({
          message: '创建成功',
          type: 'success'
        });
      })
      .catch(error => {
        this.$message({
          message: error.data.error.message,
          type: 'warning'
        });
      });
    },
    // 修改提交
    async editSubmit () {
      var params = {
        'path': this.navigation.path,
        'name': this.form.name
      };
      if (this.form.type === 'directory') {
        this.editDirectorySubmit(params);
      } else if (this.form.type === 'transformation') {
        this.editTransSubmit(params);
      } else if (this.form.type === 'job') {
        this.editJobSubmit(params);
      }
    },
    // 修改目录提交
    editDirectorySubmit (params) {
      API.repository.renameDirectory(params)
      .then(res => {
        this.dialog.visible = false;
        this.listRepository(this.navigation.parentPath);
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      })
      .catch(error => {
        this.$message({
          message: error.data.error.message,
          type: 'warning'
        });
      });
    },
    // 修改转换提交
    editTransSubmit (params) {
      API.repository.renameTrans(params)
      .then(res => {
        this.dialog.visible = false;
        this.listRepository(this.navigation.parentPath);
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      })
      .catch(error => {
        this.$message({
          message: error.data.error.message,
          type: 'warning'
        });
      });
    },
    // 修改作业提交
    editJobSubmit (params) {
      API.repository.renameJobs(params)
      .then(res => {
        this.dialog.visible = false;
        this.listRepository(this.navigation.parentPath);
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      })
      .catch(error => {
        this.$message({
          message: error.data.error.message,
          type: 'warning'
        });
      });
    },
    // 打开资源=======================
    // 双击行打开资源
    async rowDbclick (row) {
      if (row.type === 'directory') {
        this.addPath(row);
      } else {
        // 打开加载动画
        this.loading = true;
        // 获取xml
        let result = null;
        if (row.type === 'transformation') {
          result = await studio.getTransXml(row.path, row.name);
        } else if (row.type === 'job') {
          result = await studio.getJobXml(row.path, row.name);
        }
        if (result.data) {
          // 根据xml加载数据
          this.openRepository(result.data, row.type, row.path);
          // 关闭加载动画
          this.loading = false;
        }
      }
    },
    // 打开资源
    openRepository (xml, type, path) {
      this.$emit('openRepository', xml, type, path);
    },
    // 获取数据=======================
    // 获取目录、转换及作业列表
    listRepository (path) {
      var params = {
        'path': path
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
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('#directoryNameInput').focus();
      },
      update: function (el) {
        el.querySelector('#directoryNameInput').focus();
      }
    }
  },
  mounted () {
    this.listRepository('/');
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.repositoryClass {
  .u-table {
    margin-bottom: 15px;
  }
}

</style>
