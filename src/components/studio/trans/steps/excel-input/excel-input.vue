<template>
  <div class="">
    <el-form ref="excelInput" :model="excelInput" label-width="160px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="excelInput.name"></el-input>
      </el-form-item>
      <el-tabs v-model="tabsValue" type="border-card" class="tabs">
        <el-tab-pane label="文件" name="file">
          <el-form-item label="表格类型(引擎)" prop="spreadsheet_type">
            <el-select v-model="excelInput.spreadsheet_type" placeholder="请选择" style="width:100%" @focus="getSpreadsheetType">
              <el-option
                v-for="item in spreadsheetTypeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件或者目录" prop="name">
            <el-input v-model="excelInput.filename" style="width:75%" clearable @change="cleanFileList"></el-input>
            <el-button type="primary" @click="addFile" :disabled="addDisabled" style="float: right;">增加</el-button>
            <el-upload
              ref="upload"
              class="upload-demo"
              action="/"
              :http-request="Upload"
              :show-file-list="false"
              accept=".xls,.xlsx"
              :limit="1">
              <el-button type="primary">浏览</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="正则表达式" prop="filemask">
            <el-input v-model="excelInput.filemask"></el-input>
          </el-form-item>
          <el-form-item label="正则表达式(排除)" prop="exclude_filemask">
            <el-input v-model="excelInput.exclude_filemask"></el-input>
          </el-form-item>
          <el-form-item label="选中的文件列表" prop="enclosure">
            <el-row>
              <el-col :span=21>
                <el-table :data="excelInput.files" border style="width: 100%;" height="150" @selection-change="handleSelectionChange">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column property="name" label="文件/目录"></el-table-column>
                  <el-table-column property="filemask" label="通配符号"></el-table-column>
                  <el-table-column property="exclude_filemask" label="通配符号(排除)"></el-table-column>
                  <el-table-column property="file_required" label="要求">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.file_required" placeholder="请选择">
                        <el-option
                          v-for="item in falgOptions"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                      </el-select>
                    </template> 
                  </el-table-column>
                  <el-table-column property="include_subfolders" label="包含子目录">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.include_subfolders" placeholder="请选择">
                        <el-option
                          v-for="item in falgOptions"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span=2>
                <el-button type="primary" class="button" @click="deleFiles">删除</el-button>
                <el-button type="info" class="button"  @click="editeFiles">编辑</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="从前面步骤获取文件名">
            <el-checkbox></el-checkbox> 
          </el-form-item>
          <el-form-item label="从哪个步骤中读文件名">
            <el-select v-model="excelInput.encoding" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保存文件名的字段名">
            <el-select v-model="excelInput.encoding" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getRemoveFields">显示文件名</el-button>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="工作表" name="sheets">
            <el-form-item label="要获取的工作列表" >
              <el-table :data="excelInput.sheets" border style="width: 100%;" height="150">
                <el-table-column label="操作" width="80" :resizable=false>
                  <template slot-scope="scope">
                    <div class="optionStyle">
                      <el-button
                          type="text"
                          @click="removeSheet(scope.$index)"
                          size="mini">移除
                      </el-button>
                    </div>
                  </template>
               </el-table-column>
                <el-table-column property="name" label="工作表名称">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="startrow" label="起始行">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.startrow"></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="startcol" label="起始列">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.startcol"></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <el-col :span=24>
                <div class="el-table-add-row" style="width:100%" @click="addSheets"><span>+ 添加</span></div>
              </el-col>
              <el-button type="primary" @click="getRemoveFields">获取工作表名称</el-button>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="内容" name="content"> 
          <el-form-item label="头部" prop="header">
              <el-checkbox v-model="excelInput.header" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="非空记录" prop="noempty">
              <el-checkbox v-model="excelInput.noempty" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="停在空记录" prop="stoponempty">
              <el-checkbox v-model="excelInput.stoponempty" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="限制" prop="limit">
              <el-input v-model="excelInput.limit" true-label="Y" false-label= "N"></el-input> 
          </el-form-item>
          <el-form-item label="编码" prop="encoding">
            <el-select v-model="excelInput.encoding" placeholder="请选择" @focus="getEncodings">
              <el-option
                v-for="item in encodingoptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加文件名" prop="add_to_result_filenames">
            <el-checkbox v-model="excelInput.add_to_result_filenames" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="错误处理" name="remove">
          <el-form-item label="严格类型?" prop="header">
            <el-checkbox v-model="excelInput.header" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="忽略错误?" prop="error_ignored">
            <el-checkbox v-model="excelInput.error_ignored" true-label="Y" false-label= "N" @change="error_ignored_change"></el-checkbox> 
          </el-form-item>
          <el-form-item label="跳过错误行?" prop="error_line_skipped">
            <el-checkbox v-model="excelInput.error_line_skipped" true-label="Y" false-label= "N" :disabled="errorDisabled"></el-checkbox> 
          </el-form-item>
          <el-row>
            <el-col style="width:50%">
              <el-form-item label="告警文件目录" prop="bad_line_files_destination_directory">
                <el-input v-model="excelInput.bad_line_files_destination_directory" :disabled="errorDisabled"></el-input> 
              </el-form-item> 
            </el-col>
            <el-col style="width:30%">
              <el-form-item label="扩展名" prop="bad_line_files_extension">
                <el-input v-model="excelInput.bad_line_files_extension" :disabled="errorDisabled"></el-input> 
              </el-form-item> 
            </el-col>
            <el-col style="width:20%">
              <el-button type="primary" style="margin-left:10px" :disabled="errorDisabled">变量</el-button>
              <el-button type="primary" :disabled="errorDisabled">浏览</el-button> 
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width:50%">
              <el-form-item label="错误文件目录" prop="error_line_files_destination_directory">
                <el-input v-model="excelInput.error_line_files_destination_directory" :disabled="errorDisabled"></el-input> 
              </el-form-item> 
            </el-col>
            <el-col style="width:30%">
              <el-form-item label="扩展名" prop="error_line_files_extension">
                <el-input v-model="excelInput.error_line_files_extension" :disabled="errorDisabled"></el-input> 
              </el-form-item> 
            </el-col>
            <el-col style="width:20%">
              <el-button type="primary" style="margin-left:10px" :disabled="errorDisabled">变量</el-button>
              <el-button type="primary" :disabled="errorDisabled">浏览</el-button> 
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width:50%">
              <el-form-item label="失败的记录数文件目录" prop="line_number_files_destination_directory">
                <el-input v-model="excelInput.line_number_files_destination_directory" :disabled="errorDisabled"></el-input> 
              </el-form-item> 
            </el-col>
            <el-col style="width:30%">
              <el-form-item label="扩展名" prop="line_number_files_extension">
                <el-input v-model="excelInput.line_number_files_extension" :disabled="errorDisabled"></el-input> 
              </el-form-item> 
            </el-col>
            <el-col style="width:20%">
              <el-button type="primary" style="margin-left:10px" :disabled="errorDisabled">变量</el-button>
              <el-button type="primary" :disabled="errorDisabled">浏览</el-button> 
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="字段" name="fields">
          <template>
            <u-table ref="tableField" :tableData="excelInput.fields" :tableHeader="cloumns" @removeObj="removeObj" @getStreamFieldOptions="getStreamFieldOptions"></u-table>
            <el-col :span=24>
              <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
            </el-col>
          </template>
          <el-button type="primary" @click="getField">获取来自头部数据的字段</el-button>
        </el-tab-pane>
        <el-tab-pane label="其他输出字段" name="other">
          <el-form-item label="文件名称字段" prop="filefield">
            <el-input v-model="excelInput.filefield"></el-input> 
          </el-form-item>
          <el-form-item label="工作表名称字段" prop="sheetfield">
            <el-input v-model="excelInput.sheetfield"></el-input> 
          </el-form-item>
          <el-form-item label="表单的行号列" prop="sheetrownumfield">
            <el-input v-model="excelInput.sheetrownumfield"></el-input> 
          </el-form-item>
          <el-form-item label="行号列" prop="rownumfield">
            <el-input v-model="excelInput.rownumfield"></el-input> 
          </el-form-item>
          <el-form-item label="文件名字段" prop="shortFileFieldName">
            <el-input v-model="excelInput.shortFileFieldName"></el-input> 
          </el-form-item>
          <el-form-item label="扩展名字段" prop="extensionFieldName">
            <el-input v-model="excelInput.extensionFieldName"></el-input> 
          </el-form-item>
          <el-form-item label="路径字段" prop="pathFieldName">
            <el-input v-model="excelInput.pathFieldName"></el-input> 
          </el-form-item>
          <el-form-item label="文件大小字段" prop="sizeFieldName">
            <el-input v-model="excelInput.sizeFieldName"></el-input> 
          </el-form-item>
          <el-form-item label="是否为隐藏文件字段" prop="hiddenFieldName">
            <el-input v-model="excelInput.hiddenFieldName"></el-input> 
          </el-form-item>
          <el-form-item label="最后修改时间字段" prop="lastModificationTimeFieldName">
            <el-input v-model="excelInput.lastModificationTimeFieldName"></el-input> 
          </el-form-item>
          <el-form-item label="URI 字段" prop="uriNameFieldName">
            <el-input v-model="excelInput.uriNameFieldName"></el-input> 
          </el-form-item>
          <el-form-item label="Root URI 字段" prop="rootUriNameFieldName">
            <el-input v-model="excelInput.rootUriNameFieldName"></el-input> 
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button type="info" @click="handleSaveData">预览</el-button>
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
  name: 'excelInput',
  props: {
    name: String
  },
  components: {
    'u-table': TableFileds
  },
  watch: {
    'excelInput.filename': function (val, oldvlaue) {
      if (val) {
        this.addDisabled = false;
      } else {
        this.addDisabled = true;
      }
    }
  },
  data () {
    return {
      graph: null,
      errorDisabled: true,
      addDisabled: true,
      falgOptions: [{code: 'Y', name: '是'}, {code: 'N', name: '否'}],
      excelInput: {
        filename: '',
        name: '',
        header: 'N',
        add_to_result_filenames: 'N',
        noempty: 'N',
        stoponempty: 'N',
        filemask: '',
        exclude_filemask: '',
        fields: [],
        files: [],
        remove: [],
        sheets: [],
        encoding: '',
        spreadsheet_type: '',
        bad_line_files_extension: 'warning',
        error_line_files_extension: 'error',
        line_number_files_extension: 'line',
        meta: []
      },
      temp: {
        name: '',
        filename: '',
        sheets: [],
        header: 'N',
        add_to_result_filenames: 'N',
        noempty: 'N',
        stoponempty: 'N',
        filemask: '',
        exclude_filemask: '',
        spreadsheet_type: '',
        fields: [],
        files: [],
        remove: [],
        encoding: '',
        bad_line_files_extension: 'warning',
        error_line_files_extension: 'error',
        line_number_files_extension: 'line',
        meta: []
      },
      tempFiles: {},
      tabsValue: 'file',
      options: [],
      encodingoptions: [],
      multipleSelection: [],
      tempExcelInput: {},
      spreadsheetTypeOptions: [],
      cloumns: [
        { prop: 'name', label: '名称', type: 'input' },
        { prop: 'type', label: '类型', type: 'select' },
        { prop: 'format', label: '格式', type: 'select' },
        { prop: 'repeat', label: '重复', type: 'select' },
        { prop: 'length', label: '长度', type: 'input' },
        { prop: 'precision', label: '精度', type: 'input' },
        { prop: 'currency', label: '货币符号', type: 'input' },
        { prop: 'decimal', label: '小数', type: 'input' },
        { prop: 'group', label: '分组', type: 'input' },
        { prop: 'trim_type', label: '去除空格类型', type: 'select' }
      ]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.excelInput = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.excelInput);
    },
    cancel () {
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    Upload (param) {
      this.tempFiles = param.file;
      this.$set(this.excelInput, 'filename', param.file.name);
      this.cleanFileList(this.excelInput.filename);
    },
    addFile () {
      const temp = {};
      if (this.excelInput.filename) {
        temp.name = this.excelInput.filename;
      } else {
        temp.name = this.tempFiles.name;
      }
      temp.include_subfolders = 'N';
      temp.file_required = 'N';
      temp.filemask = this.excelInput.filemask;
      temp.exclude_filemask = this.excelInput.exclude_filemask;
      this.excelInput.files.push(temp);
      this.excelInput.filename = '';
      this.excelInput.filemask = '';
      this.excelInput.exclude_filemask = '';
      this.cleanFileList(this.excelInput.filename);
    },
    error_ignored_change (val) {
      val = val === 'Y';
      this.errorDisabled = !val;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['excelInput'].resetFields();
      this.excelInput.name = stepname;
    },
    cleanFileList (val) {
      if (!val) {
        this.addDisabled = true;
        this.tempFiles = {};
        this.$refs.upload.clearFiles();
      } else {
        this.addDisabled = false;
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    deleFiles () {
      this.multipleSelection.forEach((item) => {
        this.excelInput.files.splice(this.excelInput.files.indexOf(item), 1);
      });
    },
    editeFiles () {
      if (this.multipleSelection.length === 1) {
        this.excelInput.files.splice(this.multipleSelection[0], 1);
        const tempData = this.multipleSelection[0];
        this.$set(this.excelInput, 'filemask', tempData['filemask']);
        this.$set(this.excelInput, 'exclude_filemask', tempData['exclude_filemask']);
        this.$set(this.excelInput, 'filename', tempData['name']);
      }
    },
    addSheets () {
      this.excelInput.sheets.push({});
    },
    removeSheet (index) {
      this.excelInput.sheets.splice(index, 1);
    },
    getSelectedFields () {
    },
    getRemoveFields () {

    },
    getEncodings () {
      API.studio.encodings().then(res => {
        this.$set(this, 'encodingoptions', res.data);
      });
    },
    getChangFields () {
      console.log('getChangFields');
    },
    addObj () {
      this.excelInput.fields.push({});
    },
    removeObj (index) {
      this.excelInput.fields.splice(index, 1);
    },
    async getField () {
      const self = this;
      let streamFields = await this.getStreamField();
      var tempFileds = [];
      streamFields.data.forEach(element => {
        let obj = {};
        tempFileds.push(obj);
      });
      self.$set(self.excelInput, 'fields', tempFileds);
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.excelInput.name) {
        return API.trans.inputFields(value, {'stepName': this.excelInput.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.excelInput);
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
    },
    getSpreadsheetType () {
      if (this.spreadsheetTypeOptions.length === 0) {
        API.studio.spreadSheetTypes().then(res => {
          this.$set(this, 'spreadsheetTypeOptions', res.data);
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form-item {
  margin-bottom: 10px !important;
}
.upload-demo {
  display: inline;
}
.button {
  width: 80px;
  height: 40px;
  display: inline-block;
  margin-left: 10px;
  margin-top: 5px; 
}
.el-dialog__footer {
  margin-top: 10px;
}
.el-tabs >>> .el-tabs__content {
    padding: 15px !important;
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
