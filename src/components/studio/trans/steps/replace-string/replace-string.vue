<template>
  <div class="">
    <el-form ref="replaceString" :model="replaceString" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="replaceString.name"></el-input>
      </el-form-item>
      <div class="box" title="字段" style="margin-top:20px;"> 
        <el-row> 
          <template>
            <u-table ref="tableField" :tableData="replaceString.fields" :tableHeader="cloumns" @removeObj="removeObj" @getStreamFieldOptions="getStreamFieldOptions"></u-table>
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
  name: 'replaceString',
  props: {
    name: String
  },
  components: {
    'u-table': TableFileds
  },
  data () {
    return {
      graph: null,
      replaceString: {
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
        { type: 'select', prop: 'use_regex', label: '使用正则表达式' },
        { type: 'input', prop: 'replace_string', label: '搜索' },
        { type: 'input', prop: 'replace_by_string', label: '使用...替换' },
        { type: 'select', prop: 'set_empty_string', label: '设置为空串?' },
        { type: 'select', prop: 'replace_field_by_string', label: '使用字段值替换' },
        { type: 'select', prop: 'whole_word', label: '整个单词匹配' },
        { type: 'select', prop: 'case_sensitive', label: '大小写敏感' }
      ]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.replaceString = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.replaceString);
      this.replaceString = Object.assign({}, this.temp);
    },
    cancel () {
      this.$emit('cancel');
      this.replaceString = Object.assign({}, this.temp);
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.replaceString.name = stepname;
    },
    setGraph (val) {
      this.graph = val;
    },
    addObj () {
      this.replaceString.fields.push({});
    },
    removeObj (index) {
      this.replaceString.fields.splice(index, 1);
    },
    async getField () {
      const self = this;
      let streamFields = await this.getStreamField();
      var tempFileds = [];
      streamFields.data.forEach(element => {
        let obj = {};
        obj['in_stream_name'] = element.name;
        obj['set_empty_string'] = 'N';
        obj['whole_word'] = 'N';
        obj['case_sensitive'] = 'N';
        obj['use_regex'] = 'N';
        tempFileds.push(obj);
      });
      self.$set(self.replaceString, 'fields', tempFileds);
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.replaceString.name) {
        return API.trans.inputFields(value, {'stepName': this.replaceString.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.replaceString);
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
