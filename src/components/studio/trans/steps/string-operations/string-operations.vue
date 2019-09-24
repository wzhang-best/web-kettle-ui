<template>
  <div class="">
    <el-form ref="stringOperations" :model="stringOperations" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="stringOperations.name"></el-input>
      </el-form-item>
      <div class="box" title="字段" style="margin-top:20px;">  
        <el-row>
          <template>
            <u-table ref="tableField" :tableData="stringOperations.fields" :tableHeader="cloumns" @removeObj="removeObj" @getStreamFieldOptions="getStreamFieldOptions"></u-table>
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
        <el-button type="info" @click="getField">获取字段</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
import API from '@/api';
import TableFileds from '@/views/modules/studio/table/table-fields.vue';
import mxgraph from '@/views/modules/studio/graph/index.js';
/* eslint-disable no-undef */
/* eslint-disable no-new-object */
/* eslint-disable no-new */
/* eslint-disable new-cap */
const {
  mxUtils,
  mxCodec
} = mxgraph;
export default {
  name: 'stringOperations',
  props: {
    name: String
  },
  components: {
    'u-table': TableFileds
  },
  data () {
    return {
      graph: null,
      stringOperations: {
        name: '',
        fields: []
      },
      temp: {
        name: '',
        fields: []
      },
      cloumns: [
        { type: 'select', prop: 'in_stream_name', label: '输入流字段' },
        { type: 'input', prop: 'out_stream_name', label: '输出流字段' },
        { type: 'select', prop: 'trim_type', label: '去除空格类型' },
        { type: 'select', prop: 'lower_upper', label: '小写/大写' },
        { type: 'select', prop: 'padding_type', label: '填充' },
        { type: 'input', prop: 'pad_char', label: '填充字符' },
        { type: 'input', prop: 'pad_len', label: '填充长度' },
        { type: 'select', prop: 'init_cap', label: '首字母大写' },
        { type: 'select', prop: 'escape', label: '解析' },
        { type: 'select', prop: 'digits', label: '数值' },
        { type: 'select', prop: 'remove_special_character', label: '移除特殊字符' }
      ]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.stringOperations = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.stringOperations);
      this.stringOperations = Object.assign({}, this.temp);
    },
    cancel () {
      this.$emit('cancel');
      this.stringOperations = Object.assign({}, this.temp);
    },
    setGraph (val) {
      this.graph = val;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.stringOperations.name = stepname;
    },
    addObj () {
      this.stringOperations.fields.push({});
    },
    removeObj (index) {
      this.stringOperations.fields.splice(index, 1);
    },
    async getField () {
      const self = this;
      let streamFields = await this.getStreamField();
      var tempFileds = [];
      streamFields.data.forEach(element => {
        let obj = {};
        obj.in_stream_name = element.name;
        obj.out_stream_name = element.name;
        tempFileds.push(obj);
      });
      self.$set(self.stringOperations, 'fields', tempFileds);
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.stringOperations.name) {
        return API.trans.inputFields(value, {'stepName': this.stringOperations.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.stringOperations);
      const graph = this.graph;
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(graph.getModel());
      const value = mxUtils.getPrettyXml(node);
      return value;
    },
    async getStreamFieldOptions () {
      const result = this.getStreamField();
      this.$refs['tableField'].setOptions(result);
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
