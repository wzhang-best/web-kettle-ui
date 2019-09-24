<template>
  <div class="">
    <el-form ref="step" :model="step" label-width="100px">
      <el-form-item label="步骤名称">
        <el-input v-model="step.name"></el-input>
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
      step: {
        name: ''
      }
    };
  },
  methods: {
    handleOk () {
      console.log(JSON.stringify(this.step));
    },
    loadData (data) {
      if (data) {
        console.log(data);
        this.$forceUpdate();
        this.step = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      console.log(JSON.stringify(this.step));
      this.$emit('savePluginData', this.step);
    },
    cancel () {
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
     // 重置表单数据
    resetFormData () {
      this.$refs['step'].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
