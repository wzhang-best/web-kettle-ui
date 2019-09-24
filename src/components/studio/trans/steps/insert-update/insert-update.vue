<template>
  <div class="">
    <el-form ref="insertUpdate" :model="insertUpdate" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="insertUpdate.name"></el-input>
      </el-form-item>
      <el-form-item label="数据库连接" prop="connection">
        <el-select v-model="insertUpdate.connection" @focus="databases" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in dbConnectionOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <el-button type="primary" @click="editDb" v-show="tshow">编辑</el-button>
        <el-button type="primary" @click="newDb" v-show="tshow">新建</el-button>
        <el-button type="primary" v-show="tshow" >Wizard</el-button>
      </el-form-item>
      <el-form-item label="目标模式" prop="schema">
        <el-input v-model="insertUpdate.lookup.schema" class="u-el-input" style="width:89%"></el-input>
        <el-button type="primary" @click="getSchemas" style="float:right" :disabled="connectionVisible">浏览</el-button>
      </el-form-item>
      <el-form-item label="目标表" prop="table">
        <el-input v-model="insertUpdate.lookup.table" class="u-el-input" style="width:89%"></el-input>
        <el-button type="primary" @click="getTables" style="float:right" :disabled="connectionVisible">浏览</el-button>
      </el-form-item>
       <el-form-item label="提交记录数量" prop="commit">
        <el-input v-model="insertUpdate.commit"></el-input>
      </el-form-item>
      <el-form-item label="不执行任何更新" prop="update_bypassed">
        <el-checkbox v-model="insertUpdate.update_bypassed" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <div class="box" title="用来查询关键字" style="margin-top:20px;">
        <el-row>
          <el-col :span="20">
            <el-table :data="insertUpdate.lookup.keys"  border  style="width: 100%;" height="200">
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column label="操作" align="center" fixed width="80" :resizable=false>
                <template slot-scope="scope">
                  <div class="optionStyle">
                    <el-button
                      type="text"
                      @click="removeObj(scope.$index)"
                      size="mini">移除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column property="field" label="表字段">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field" style="width: 100%;" @focus="getTableFieldsOption">
                    <el-option
                      v-for="item in tableFields"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="condition" label="比较符">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.condition" style="width: 100%;" >
                    <el-option
                      v-for="item in conditionOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="name" label="流里的字段1">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.name" style="width: 100%;" @focus="getStreamFieldoption">
                    <el-option
                      v-for="item in streamFields"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="name2" label="流里的字段2">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.name2" style="width: 100%;" @focus="getStreamFieldoption">
                    <el-option
                      v-for="item in streamFields"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24">
                <div class="el-table-add-row" style="width:100%" @click="addObj('keys')"><span>+ 添加</span></div>
            </el-col>
          </el-col> 
          <el-col :span="4">
            <el-button type="primary" class="button" @click="getFields('keys')" >获取字段</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="box" title="更新字段" style="margin-top:20px;">
        <el-row>
          <el-col :span="20">
            <el-table :data="insertUpdate.lookup.values"   border style="width: 100%;" height="200">
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column label="操作" width="80" :resizable=false>
                <template slot-scope="scope">
                    <div class="optionStyle">
                      <el-button
                          type="text"
                          @click="removeValues(scope.$index)"
                          size="mini">移除
                      </el-button>
                    </div>
                </template>
              </el-table-column>
              <el-table-column property="field" label="表字段">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field" style="width: 100%;" >
                    <el-option
                      v-for="item in tableFields"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="rename" label="流字段">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.rename" style="width: 100%;" >
                    <el-option
                      v-for="item in streamFields"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="update" label="更新">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.update" style="width: 100%;" >
                    <el-option
                      v-for="item in options"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24">
              <div class="el-table-add-row" style="width:100%" @click="addObj('values')"><span>+ 添加</span></div>
            </el-col>
          </el-col> 
          <el-col :span="4">
            <el-button type="primary" @click="getFields('values')" class="button" >获取字段</el-button>
            <el-button class="button" style="margin-top:10px" @click="valueMapperclick">输入字段映射</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
        <!-- <el-button type="primary">SQL</el-button> -->
      </span>
    </div>

     <!-- 输入映射的弹出框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="790px"
      :append-to-body="true"
      class="u-el-dialog">
      <u-tran ref="mapper" @setFields="setFields" @hiddenDialog="hiddenDialog"></u-tran>
    </el-dialog>

    <el-dialog
      :visible.sync="tableDialogVisible"
      :close-on-click-modal="false"
      :title="tableDialog"
      width="40%"
      :append-to-body="true">
      <table-dialog ref="tableDialog" @setTable="setTable" @closeDialog="closeDialog"></table-dialog>
    </el-dialog>
     <!-- 模式弹出框 -->
    <el-dialog
      :visible.sync="schemaDialogVisible"
      :close-on-click-modal="false"
      :title="schemaDialog"
      :append-to-body="true">
      <schema-dialog ref="schemaDialog" @setSchema="setSchema" @closeDialog="closeDialog"></schema-dialog>
    </el-dialog>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
import API from '@/api';
import mxgraph from '@/views/modules/studio/graph/index.js';
import TableDialog from '@/views/modules/studio/table/table-dialog.vue';
import PreviewDialog from '@/views/modules/studio/preview/Preview.vue';
import SchemaDialog from '@/views/modules/studio/schema/schema-dialog.vue';
import ConformStanView from '@/views/modules/studio/mapping-dialog/mapping-dialog.vue';
/* eslint-disable no-undef */
/* eslint-disable no-new-object */
/* eslint-disable no-new */
/* eslint-disable new-cap */
const {
  mxUtils,
  mxCodec
} = mxgraph;
export default {
  name: 'insertUpdate',
  props: {
    name: String
  },
  components: {
    'table-dialog': TableDialog,
    'preview-dialog': PreviewDialog,
    'schema-dialog': SchemaDialog,
    'u-tran': ConformStanView
  },
  data () {
    return {
      graph: null,
      tshow: false,
      schemaDialog: '浏览模式',
      tableDialog: '浏览数据库',
      dialogVisible: false,
      dialogTitle: '输出映射',
      schemaDialogVisible: false,
      tableDialogVisible: false,
      connectionVisible: true,
      streamFields: [],
      streamFields2: [],
      tableFields: [],
      conditionOptions: [],
      insertUpdate: {
        name: '',
        connection: '',
        lookup: {
          keys: [],
          values: [],
          schema: '',
          table: ''
        },
        update_bypassed: 'N',
        commit: 1000
      },
      temp: {
        name: '',
        connection: '',
        lookup: {
          keys: [],
          values: [],
          schema: '',
          table: ''
        },
        update_bypassed: 'N',
        commit: 1000
      },
      tempInsetUpdate: null,
      tabsValue: 'main',
      dbConnectionOptions: [],
      options: [{code: 'Y', name: '是'}, {code: 'N', name: '否'}]
    };
  },
  watch: {
    'insertUpdate.connection': function (val, oldVal) {
      if (val) {
        this.$set(this, 'connectionVisible', false);
      } else {
        this.$set(this, 'connectionVisible', true);
      }
    }
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.insertUpdate = Object.assign({}, data);
        this.tempInsetUpdate = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.insertUpdate.name) {
        this.$emit('savePluginData', this.insertUpdate);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      if (this.tempInsetUpdate) {
        this.saveTempPluginData(this.tempInsetUpdate);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.insertUpdate.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['insertUpdate'].resetFields();
      this.insertUpdate = JSON.parse(JSON.stringify(this.temp));
      this.insertUpdate['name'] = stepname;
    },
    setGraph (val) {
      this.graph = val;
    },
    getSchemas () {
      this.schemaDialogVisible = true;
      API.database.schemas({'database': this.insertUpdate.connection}).then(res => {
        if (res.data) {
          this.$refs.schemaDialog.schemas = res.data;
        }
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
    setSchema (val, key) {
      this.$set(this.insertUpdate.lookup, 'schema', val);
    },
    getTables () {
      this.tableDialogVisible = true;
      API.database.explorer({'database': this.insertUpdate.connection}).then(res => {
        this.$refs.tableDialog.data = res.data;
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
        // 获取数据源
    databases () {
      API.repository.databases().then(res => {
        this.dbConnectionOptions = res.data;
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
    setTable (currentData) {
      this.$set(this.insertUpdate.lookup, 'schema', currentData.schema);
      this.$set(this.insertUpdate.lookup, 'table', currentData.name);
    },
    closeDialog () {
      this.schemaDialogVisible = false;
      this.tableDialogVisible = false;
    },
    async addObj (key) {
      this.insertUpdate.lookup[key].push({});
      if (this.tableFields.length === 0) {
        const result = await this.getInputField();
        if (result) {
          this.$set(this, 'tableFields', result.data);
        }
      }
      if (this.streamFields.length === 0) {
        const streamFields = await this.getStreamField();
        if (streamFields) {
          this.$set(this, 'streamFields', streamFields.data);
        }
      }
    },
    async getTableFieldsOption () {
      if (this.tableFields.length === 0) {
        const result = await this.getInputField();
        this.$set(this, 'tableFields', result.data);
      }
    },
    async getStreamFieldoption () {
      if (this.streamFields.length === 0) {
        let streamFields = await this.getStreamField();
        this.$set(this, 'streamFields', streamFields.data);
      }
    },
    async getFields (key) {
      if (this.insertUpdate.connection === '') {
        this.$message({
          message: '请选择数据源',
          type: 'warning'
        });
        return;
      }
      if (this.insertUpdate.table === '') {
        this.$message({
          message: '请选择数据库表',
          type: 'warning'
        });
        return;
      }
      const self = this;
      var tempStreamField = [];
      if (this.streamFields.length === 0) {
        let streamFields = await this.getStreamField();
        tempStreamField = streamFields.data;
        self.$set(self, 'streamFields', streamFields.data);
      } else {
        tempStreamField = this.streamFields;
      }
      if (this.tableFields.length === 0) {
        const result = await this.getInputField();
        self.$set(self, 'tableFields', result.data);
      }
      var tempFileds = [];
      if (key === 'keys') {
        tempStreamField.forEach(element => {
          let obj = {};
          obj.field = element.name;
          obj.condition = '=';
          obj.name = element.name;
          obj.name2 = '';
          tempFileds.push(obj);
        });
      } else {
        tempStreamField.forEach(element => {
          let obj = {};
          obj.field = element.name;
          obj.rename = element.name;
          obj.update = 'Y';
          tempFileds.push(obj);
        });
      }
      self.$set(self.insertUpdate.lookup, key, tempFileds);
    },
    getInputField () {
      if (this.insertUpdate.connection && this.insertUpdate.lookup.table) {
        const param = {};
        param['database'] = this.insertUpdate.connection;
        param['schema'] = this.insertUpdate.lookup.schema;
        param['table'] = this.insertUpdate.lookup.table;
        return API.database.fields(param);
      }
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.insertUpdate.name) {
        return API.trans.inputFields(value, {'stepName': this.insertUpdate.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.insertUpdate);
      const graph = this.graph;
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(graph.getModel());
      const value = mxUtils.getPrettyXml(node);
      return value;
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
    },
    removeObj (index) {
      this.insertUpdate.lookup.keys.splice(index, 1);
    },
    removeValues (index) {
      this.insertUpdate.lookup.values.splice(index, 1);
    },
    async valueMapperclick () {
      this.dialogVisible = true;
      let that = this;
      const result = await this.getStreamField();
      const mapperValues = Object.assign([], this.insertUpdate.lookup.values);
      var fileds = [];
      mapperValues.forEach(element => {
        let obj = {};
        obj.column_name = element.field;
        obj.stream_name = element.rename;
        fileds.push(obj);
      });
      await this.getInputField().then(res => {
        this.$nextTick(() => {
          that.$refs.mapper.setChildFields(res.data, result.data, fileds);
        });
      });
    },
    setFields (data) {
      var fileds = [];
      data.forEach(element => {
        let obj = {};
        obj.field = element.tableField.name;
        obj.rename = element.streamField.name;
        obj.update = 'Y';
        fileds.push(obj);
      });
      this.$set(this.insertUpdate.lookup, 'values', fileds);
    },
    hiddenDialog () {
      this.dialogVisible = false;
    },
    editDb () {
    },
    newDb () {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 10px !important;
}
.button {
  width: 110px;
  height: 40px;
  display: inline-block;
  margin-left: 20px;
  text-align: center;
  font-size: 12px;
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
.el-dialog__footer {
  margin-top: 10px;
}
</style>
