<template>
  <div class="">
    <el-form ref="start" :model="start" label-width="160px">
      <el-form-item label="步骤名称">
        <el-input v-model="stepName"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="重复?" prop="repeat">
        <el-checkbox v-model="start.repeat" disabled true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <el-form-item label="类型" prop="schedulerType">
        <el-select v-model="start.schedulerType" placeholder="请选择">
          <el-option
            v-for="item in Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="以秒计算的时间间隔" prop="intervalSeconds">
        <el-input-number v-model="start.intervalSeconds" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="以分钟计算的时间间隔" prop="intervalMinutes">
        <el-input-number v-model="start.intervalMinutes" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="每天">
        <el-input-number v-model="start.hour" :min="0" :max="23"></el-input-number>
        <el-input-number v-model="start.minutes" :min="0" :max="59"></el-input-number>
      </el-form-item>
      <el-form-item label="每周" prop="weekDay">
        <el-select v-model="start.weekDay" placeholder="请选择">
          <el-option
            v-for="item in Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="每月" prop="DayOfMonth">
        <el-select v-model="start.DayOfMonth" placeholder="请选择">
          <el-option
            v-for="item in Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
      </el-form-item>
      -->
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
  name: 'start',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      stepName: '开始',
      start: {
        repeat: 'N'
      },
      Options: []
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.start = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.start);
      this.$emit('cancel');
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
      this.$refs['start'].resetFields();
      this.start = Object.assign({}, this.temp);
      this.start.name = stepname;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
