<template>
  <div class="">
    <el-form ref="fieldSplitter" :model="fieldSplitter" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="fieldSplitter.name"></el-input>
      </el-form-item>
      <el-form-item label="需要拆分字段" prop="splitfield">
        <el-select v-model="fieldSplitter.splitfield" style="width:100%;" placeholder="请选择" @focus="getStreamField">
          <el-option
            v-for="item in streamFields"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="分隔符" prop="delimiter">
         <el-input v-model="fieldSplitter.delimiter"></el-input>
      </el-form-item>
      <el-form-item label="封闭符" prop="enclosure">
        <el-input v-model="fieldSplitter.enclosure"></el-input>
      </el-form-item>
      <div class="box" title="字段" style="margin-top:20px;"> 
        <el-row> 
          <template>
            <u-table :tableData="fieldSplitter.fields" :tableHeader="cloumns" @removeObj="removeObj"></u-table>
            <el-col :span=24>
              <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
            </el-col>
          </template>
        </el-row>
      </div>
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
import API from '@/api';
import mxgraph from '@/views/modules/studio/graph/index.js';
import TableFileds from '@/views/modules/studio/table/table-fields.vue';
/* eslint-disable no-undef */
/* eslint-disable no-new-object */
/* eslint-disable no-new */
/* eslint-disable new-cap */
const {
  mxUtils,
  mxCodec
} = mxgraph;
export default {
  name: 'fieldSplitter',
  props: {
    name: String
  },
  components: {
    'u-table': TableFileds
  },
  data () {
    return {
      fieldSplitter: {
        name: '',
        splitfield: '',
        delimiter: '',
        enclosure: '',
        fields: []
      },
      temp: {
        name: '',
        splitfield: '',
        fields: []
      },
      streamFields: [],
      resultTypeOptions: [],
      cloumns: [
        { type: 'input', prop: 'name', label: '新字段' },
        { type: 'input', prop: 'id', label: '标识符' },
        { type: 'select', prop: 'idrem', label: '移除标识符' },
        { type: 'select', prop: 'type', label: '类型' },
        { type: 'input', prop: 'length', label: '长度' },
        { type: 'input', prop: 'precision', label: '精度' },
        { type: 'select', prop: 'format', label: '格式' },
        { type: 'input', prop: 'group', label: '分组符号' },
        { type: 'input', prop: 'decimal', label: '小数点符号' },
        { type: 'input', prop: 'currency', label: '货币符号' },
        { type: 'input', prop: 'nullif', label: '满足条件时置空' },
        { type: 'input', prop: 'ifnull', label: '缺省' },
        { type: 'select', prop: 'trimtype', label: '去除空格类型' }
      ]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.fieldSplitter = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.fieldSplitter);
      this.fieldSplitter = Object.assign({}, this.temp);
    },
    cancel () {
      this.$emit('cancel');
      this.fieldSplitter = Object.assign({}, this.temp);
    },
    setGraph (val) {
      this.graph = val;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['fieldSplitter'].resetFields();
      this.fieldSplitter.name = stepname;
    },
    addObj () {
      this.fieldSplitter.fields.push({});
    },
    removeObj (data) {
      this.fieldSplitter.fields.splice(data, 1);
    },
    async getStreamField () {
      const value = await this.getXml();
      await API.trans.inputFields(value, {'stepName': this.fieldSplitter.name}).then(res => {
        this.$set(this, 'streamFields', res.data);
      });
    },
    getXml () {
      this.saveTempPluginData(this.fieldSplitter);
      const graph = this.graph;
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(graph.getModel());
      const value = mxUtils.getPrettyXml(node);
      return value;
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 10px !important;
}
.el-table-add-row {
  margin-top:10px ;
  width: 100%;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}
.box{
    position:relative;
    border:1px solid #dcdfe6;
    padding:30px 5px 10px 5px; 
}
.box::before{
    content:attr(title);
    position:absolute;
    top: 0%;
    left:10%;
    transform:translateX(-50%);
    -webkit-transform:translate(-50%,-50%);
    padding:0px 10px;
    background-color:#fff;
}
</style>
