<template>
  <div class="">
    <el-form ref="csvInput" :model="csvInput" label-width="170px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="csvInput.name"></el-input>
      </el-form-item>
      <el-form-item label="文件名" prop="filename">
        <el-input v-model="csvInput.filename" style="width:80%" clearable @change="cleanFileList"></el-input>
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/"
          :http-request="Upload"
          :show-file-list="false"
          accept=".csv"
          :limit="1">
          <el-button type="primary" class="button">浏览</el-button>
        </el-upload>
      </el-form-item> 
      <el-form-item label="列分隔符" prop="separator">
        <el-input id="separatorInput" v-model="csvInput.separator" style="width:80%"></el-input>
        <el-button type="primary" @click="insertTab" style="float:right" class="button">插入制表符</el-button>
      </el-form-item> 
      <el-form-item label="封闭符" prop="enclosure">
        <el-input v-model="csvInput.enclosure"></el-input>
      </el-form-item>
       <el-form-item label="NIO缓存大小" prop="buffer_size">
        <el-input v-model="csvInput.buffer_size"></el-input>
       </el-form-item>
        <el-form-item label="简易转换?" prop="lazy_conversion">
         <el-checkbox v-model="csvInput.lazy_conversion" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
       <el-form-item label="包含列头行" prop="header">
         <el-checkbox v-model="csvInput.header" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
       <el-form-item label="将文件添加到结果文件中" prop="add_filename_result">
         <el-checkbox v-model="csvInput.add_filename_result" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
       <el-form-item label="行号字段(可选)" prop="rownum_field">
        <el-input v-model="csvInput.rownum_field"></el-input>
       </el-form-item>
       <el-form-item label="并发运行?" prop="parallel">
         <el-checkbox v-model="csvInput.parallel" true-label="Y" false-label= "N" :disabled="parallel"></el-checkbox>
      </el-form-item>
       <el-form-item label="字段中有回车换行?" prop="newline_possible">
         <el-checkbox v-model="csvInput.newline_possible" true-label="Y" false-label= "N" @change="enter_change"></el-checkbox>
      </el-form-item>
      <el-form-item label="文件编码" prop="encoding">
        <el-select v-model="csvInput.encoding" placeholder="请选择" @focus="getEncodings" style="width:100%">
          <el-option
            v-for="item in encodingoptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <div>
        <template>
            <u-table ref="tableField" :tableData="csvInput.fields" :tableHeader="cloumns" @removeObj="removeObj" @getStreamFieldOptions="getStreamFieldOptions"></u-table>
            <el-col :span=24>
              <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
            </el-col>
        </template>
      </div>
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button type="primary" class="button" @click="handleSaveData">确定</el-button>
        <el-button type="info" @click="getField" class="button">获取字段</el-button>
        <el-button type="info" class="button">预览</el-button>
        <el-button @click="cancel" class="button">取消</el-button>
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
  name: 'csvInput',
  props: {
    name: String
  },
  components: {
    'u-table': TableFileds
  },
  data () {
    return {
      parallel: false,
      graph: null,
      csvInput: {
        name: '',
        resultfieldName: 'N',
        header: 'N',
        add_filename_result: 'N',
        parallel: 'N',
        separator: ',',
        enclosure: '"',
        buffer_size: 5000,
        encoding: '',
        fields: []
      },
      tempCsvInput: null,
      temp: {
        name: '',
        resultfieldName: 'N',
        header: 'N',
        add_filename_result: 'N',
        parallel: 'N',
        separator: ',',
        enclosure: '"',
        buffer_size: 5000,
        encoding: '',
        fields: []
      },
      encodingoptions: [],
      cloumns: [
        { prop: 'name', label: '名称', type: 'input' },
        { prop: 'type', label: '类型', type: 'select' },
        { prop: 'format', label: '格式', type: 'select' },
        { prop: 'length', label: '长度', type: 'input' },
        { prop: 'precision', label: '精度', type: 'input' },
        { prop: 'currency', label: '货币符号', type: 'input' },
        { prop: 'decimal', label: '小数点符号', type: 'input' },
        { prop: 'group', label: '分组符号', type: 'input' },
        { prop: 'trim_type', label: '去除空格类型', type: 'select' }
      ]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.csvInput = Object.assign({}, data);
        this.tempCsvInput = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.csvInput.name) {
        this.$emit('savePluginData', this.csvInput);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      if (this.tempCsvInput) {
        this.saveTempPluginData(this.tempCsvInput);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.csvInput.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    Upload (param) {
      this.$set(this.csvInput, 'filename', param.file.name);
    },
    cleanFileList (val) {
      if (!val) {
        this.tempFiles = {};
        this.$refs.upload.clearFiles();
      }
    },
    insertTab () {
      var elInput = document.getElementById('separatorInput');
      var startPos = elInput.selectionStart;
      var endPos = elInput.selectionEnd;
      if (startPos === undefined || endPos === undefined) return;
      var result = elInput.value.substring(0, startPos) + '\t' + elInput.value.substring(endPos);
      elInput.value = result;
      elInput.focus();
      elInput.selectionStart = startPos + '\t'.length;
      elInput.selectionEnd = startPos + '\t'.length;
      this.csvInput.separator = result;
    },
    enter_change (val) {
      val = val === 'Y';
      this.parallel = val;
    },
     // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['csvInput'].resetFields();
      this.csvInput = JSON.parse(JSON.stringify(this.temp));
      this.csvInput.name = stepname;
    },
    getEncodings () {
      API.studio.encodings().then(res => {
        this.$set(this, 'encodingoptions', res.data);
      });
    },
    addObj () {
      this.csvInput.fields.push({});
    },
    removeObj (index) {
      this.csvInput.fields.splice(index, 1);
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
      self.$set(self.csvInput, 'fields', tempFileds);
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.csvInput.name) {
        return API.trans.inputFields(value, {'stepName': this.csvInput.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.csvInput);
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
.upload-demo {
  display: inline-block;
  float: right;
}
.button {
  width: 110px;
  display: inline-block;
  text-align: center;
}
.el-dialog__footer {
  margin-top: 49px;
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
</style>
