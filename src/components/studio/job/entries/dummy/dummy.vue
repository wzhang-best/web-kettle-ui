<template>
  <div class="">
    <el-form ref="step" :model="dummy" label-width="100px">
      <el-form-item label="步骤名称">
        <el-input v-model="dummy.name"></el-input>
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
  name: 'Dummy',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      dummy: {
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
        this.dummy = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.dummy.name) {
        this.$emit('savePluginData', this.dummy);
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
      this.$refs['step'].resetFields();
      this.dummy = Object.assign({}, this.temp);
      this.dummy.name = stepname;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
