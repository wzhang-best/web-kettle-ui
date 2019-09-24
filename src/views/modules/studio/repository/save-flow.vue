/**
 保存流程时的弹框
 */
<template>
  <div class="">
    <el-form ref="flowForm" :model="flowForm" label-width="80px">
      <el-form-item label="名称" :rules="rules.name" prop="name">
        <el-input v-model="flowForm.name"></el-input>
      </el-form-item>
      <el-form-item label="路径" :rules="rules.path" prop="path">
        <el-select v-model="flowForm.path" placeholder="请选择" :clearable="true" @clear="clearHandle">
          <el-option :value="flowForm.path" style="height: auto">
            <el-tree
              ref="tree"
              :props="defaultProps"
              :load="loadNode"
              @node-click="nodeClick"
              :expand-on-click-node="false"
              :check-on-click-node ="true"
              lazy></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
// @ is an alias to /src
import API from '@/api';
export default {
  name: 'SaveFlow',
  props: {
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      flowForm: {
        name: '',
        path: '',
        validateFlag: false
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请选择路径', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 获取数据=======================
    // 获取目录、转换及作业列表
    listRepository (path) {
      var params = {
        'path': path
      };
      return API.repository.listRepository(params);
    },
    // 异步加载树节点数据
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.listRepository('/').then(res => {
          return resolve(res.data);
        });
      } else {
        this.listRepository(node.data.path).then(res => {
          return resolve(res.data);
        });
      }
    },
    // 选中节点
    nodeClick (data, node) {
      this.flowForm.path = data.path;
    },
    // 清除选择
    clearHandle () {
      this.flowForm.path = '';
    },
    // 表单验证
    validateForm () {
      this.flowForm.validateFlag = false;
      this.$refs['flowForm'].validate((valid) => {
        if (valid) {
          this.flowForm.validateFlag = true;
        }
      });
    },
    // 重置
    reset () {
      this.flowForm.path = '';
      this.flowForm.name = '';
    }
  },
  mounted () {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-col {
    border: 1px;
  }
</style>
