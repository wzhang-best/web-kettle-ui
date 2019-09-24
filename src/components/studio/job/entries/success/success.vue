<template>
  <div class="">
    <el-form ref="success" :model="success" label-width="100px">
      <el-form-item label="作业项名">
        <el-input v-model="success.name"></el-input>
      </el-form-item>
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
export default {
  name: 'success',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      success: {
        name: ''
      },
      temp: {
        name: ''
      }
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.success = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.success.name) {
        this.$emit('savePluginData', this.success);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
     // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['success'].resetFields();
      this.success = Object.assign({}, this.temp);
      this.success.name = stepname;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
