<template>
  <div class="" style="height:612">
    <el-form ref="tableOutput" :model="tableOutput" label-width="180px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="tableOutput.name"></el-input>
      </el-form-item>
      <el-form-item label="数据库连接" prop="connection">
        <el-select v-model="tableOutput.connection" placeholder="请选择" @focus="databases" style="width:100%">
          <el-option
            v-for="item in dbConnectionOptions"
            :key="item.value"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <el-button type="primary" @click="editDb" v-show="tshow">编辑</el-button>
        <el-button type="primary" @click="newDb" v-show="tshow">新建</el-button>
        <el-button type="primary" v-show="tshow">Wizard</el-button>
      </el-form-item>
      <el-form-item label="目标模式" prop="schema">
        <el-input v-model="tableOutput.schema" class="u-el-input" style="width:89%"></el-input>
        <el-button type="primary" @click="getSchemas" style="float:right" :disabled="connectionVisible">浏览</el-button>
      </el-form-item>
      <el-form-item label="目标表" prop="table">
        <el-input v-model="tableOutput.table" class="u-el-input" style="width:89%" :disabled="table"></el-input>
        <el-button type="primary" @click="getTables" style="float:right" :disabled="connectionVisible">浏览</el-button>
      </el-form-item>
       <el-form-item label="提交记录数量" prop="commit">
        <el-input v-model="tableOutput.commit"></el-input>
      </el-form-item>
      <el-form-item label="剪裁表" prop="truncate">
        <el-checkbox v-model="tableOutput.truncate" :disabled="truncate" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <el-form-item label="忽略插入错误" prop="ignore_errors">
        <el-checkbox v-model="tableOutput.ignore_errors" :disabled="ignore_errors" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <el-form-item label="指定数据库字段" prop="specify_fields">
        <el-checkbox v-model="tableOutput.specify_fields" true-label="Y" false-label= "N" @change="specify_fields_chanage"></el-checkbox>
      </el-form-item>
      <el-tabs v-model="tabsValue" type="border-card" class="tabs">
        <el-tab-pane label="主选项" name="main" >
          <!--
          <el-form-item label="表分区数据" prop="partitioning_enabled">
            <el-checkbox v-model="tableOutput.partitioning_enabled" true-label="Y" false-label= "N" @change="partitioning_enabled_change"></el-checkbox>
          </el-form-item>
          <el-form-item label="分区字段" prop="partitioning_field">
            <el-input v-model="tableOutput.partitioning_field" :disabled="partitioning_field"></el-input>
          </el-form-item>
          <template>
            <el-form-item prop="partitioning_monthly">
              <el-radio v-model="tableOutput.partitioning_monthly" @change="partition_change('monthly')" label="Y" :disabled="partitioning_monthly">每个月分区数据</el-radio>
            </el-form-item>
            <el-form-item prop="partitioning_daily">
              <el-radio v-model="tableOutput.partitioning_daily" @change="partition_change('daily')" label="Y" :disabled="partitioning_daily">每天分区数据</el-radio>
            </el-form-item>
          </template>
          -->
          <el-form-item label="使用批量插入" prop="use_batch">
            <el-checkbox v-model="tableOutput.use_batch" true-label="Y" false-label= "N" @change="use_batch_change" :disabled="use_batch"></el-checkbox>
          </el-form-item>
          <el-form-item label="表名定义在一个字段里" prop="tablename_in_field">
            <el-checkbox v-model="tableOutput.tablename_in_field" true-label="Y" false-label= "N" @change="tablename_in_field_chanage"></el-checkbox>
          </el-form-item>
          <el-form-item label="包含表名的字段" prop="tablename_field">
            <el-input v-model="tableOutput.tablename_field" :disabled="tablename_field"></el-input>
          </el-form-item>
          <el-form-item label="存储表名字段" prop="tablename_in_table">
            <el-checkbox v-model="tableOutput.tablename_in_table" true-label="Y" false-label= "N" :disabled="tablename_in_table" ></el-checkbox>
          </el-form-item>
          <el-form-item label="返回一个自动产生的关键字" prop="return_keys">
            <el-checkbox v-model="tableOutput.return_keys" true-label="Y" false-label= "N" @change="return_keys_change"></el-checkbox>
          </el-form-item>
          <el-form-item label="自动产生的关键字的字段名" prop="return_keys_name">
            <el-input v-model="tableOutput.return_keys_name" :disabled="return_keys_name"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="数据库字段" name="dbField" id="tabs">
          <el-row>
            <el-col :span=20>
              <el-table :data="tableOutput.fields"  border style="width: 100%;" height="200">
                <el-table-column label="操作" width="80" :resizable=false>
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
                <el-table-column property="column_name" label="表字段" >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.column_name" style="width: 100%;" @focus="getInputFieldsOption">
                      <el-option
                        v-for="item in tableFields"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </template>
                  <!-- 
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.tableField"></el-input>
                  </template>
                  -->
                </el-table-column>
                <el-table-column property="stream_name" label="流字段">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.stream_name" style="width: 100%;" @focus="getStreamFiledOption">
                      <el-option
                        v-for="item in streamFields"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </template>
                  <!-- 
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.streamField"></el-input>
                  </template>
                  -->
                </el-table-column>
              </el-table>
              <el-col :span="24">
                <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
              </el-col>
            </el-col> 
            <el-col :span=3>
                  <el-button type="primary" class="button" @click="getFields" :disabled="gFields">获取字段</el-button>
                  <el-button type="primary" class="button" :disabled="valueMapper" style="margin-top:10px" @click="valueMapperclick">输入字段映射</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        </el-tabs>
        <div class="el-dialog__footer">
          <span class="dialog-footer">
            <el-button type="primary" @click="handleSaveData">确定</el-button>
            <el-button @click="cancel">取消</el-button>
            <!-- <el-button type="primary" @click="getSQL">SQL</el-button> -->
          </span>
        </div>
    </el-form>
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
    <!-- 模式弹出框 -->
    <el-dialog
      :visible.sync="schemaDialogVisible"
      :close-on-click-modal="false"
      :title="schemaDialog"
      :append-to-body="true">
      <schema-dialog ref="schemaDialog" @setSchema="setSchema" @closeDialog="closeDialog"></schema-dialog>
    </el-dialog>
    <!-- 表弹出框 -->
    <el-dialog
      :visible.sync="sqlEditorVisible"
      :close-on-click-modal="false"
      :title="sqlEditorTitle"
      width="40%"
      :append-to-body="true">
      <span>以";"分割的SQL语句</span>
      <el-input type="textarea" v-model="sqlValue"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sqlEditorVisible = false">确定</el-button>
        <el-button @click="sqlEditorVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="tableDialogVisible"
      :close-on-click-modal="false"
      :title="tableDialog"
      width="40%"
      :append-to-body="true">
      <table-dialog ref="tableDialog" @setTable="setTable" @closeDialog="closeDialog"></table-dialog>
    </el-dialog>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
import mxgraph from '@/views/modules/studio/graph/index.js';
import API from '@/api';
import ConformStanView from '@/views/modules/studio/mapping-dialog/mapping-dialog.vue';
import SchemaDialog from '@/views/modules/studio/schema/schema-dialog.vue';
import TableDialog from '@/views/modules/studio/table/table-dialog.vue';
/* eslint-disable no-undef */
/* eslint-disable no-new-object */
/* eslint-disable no-new */
/* eslint-disable new-cap */
const {
  mxUtils,
  mxCodec
} = mxgraph;
export default {
  name: 'TableOutput',
  components: {
    'u-tran': ConformStanView,
    'schema-dialog': SchemaDialog,
    'table-dialog': TableDialog
  },
  props: {
    name: String
  },
  watch: {
    tableOutput (tableOutput) {
      const val = tableOutput.specify_fields === 'Y';
      this.gFields = this.valueMapper = !val;
    },
    'tableOutput.connection': function (val, oldVal) {
      if (val) {
        this.$set(this, 'connectionVisible', false);
      } else {
        this.$set(this, 'connectionVisible', true);
      }
    }
  },
  data () {
    return {
      graph: null,
      tshow: false,
      schemaDialog: '浏览模式',
      tableDialog: '浏览数据库',
      sqlEditorTitle: '简单SQL编辑器',
      schemaDialogVisible: false,
      tableDialogVisible: false,
      sqlEditorVisible: false,
      districtList: [], // 展示的数据
      checkedData: [], // 已选择
      checkAll: false,
      tempTableOutput: null,
      searchWord: '',
      buttonAble: true,
      partitioning_field: true,
      partitioning_monthly: true,
      partitioning_daily: true,
      truncate: false,
      ignore_errors: true,
      tablename_field: true,
      tablename_in_table: true,
      return_keys_name: true,
      use_batch: false,
      table: false,
      gFields: true,
      valueMapper: true,
      dialogVisible: false,
      connectionVisible: true,
      dialogTitle: '输出映射',
      tableOutput: {
        name: '',
        connection: '',
        schema: '',
        table: '',
        commit: 1000,
        partitioning_monthly: 'Y',
        partitioning_daily: 'N',
        tablename_in_table: 'Y',
        use_batch: 'Y',
        truncate: 'N',
        ignore_errors: 'N',
        specify_fields: 'N',
        partitioning_enabled: 'N',
        tablename_in_field: 'N',
        return_keys: 'N',
        fields: []
      },
      count: 0,
      tabsValue: 'main',
      dbConnectionOptions: [],
      tableFields: [],
      streamFields: [],
      temp: {
        name: '',
        connection: '',
        schema: '',
        table: '',
        commit: 1000,
        partitioning_monthly: 'Y',
        partitioning_daily: 'N',
        tablename_in_table: 'Y',
        use_batch: 'Y',
        truncate: 'N',
        ignore_errors: 'N',
        specify_fields: 'N',
        partitioning_enabled: 'N',
        tablename_in_field: 'N',
        return_keys: 'N',
        fields: []
      },
      isDisabled_style: false,
      sqlValue: ''
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.tableOutput = JSON.parse(JSON.stringify(data));
        this.tempTableOutput = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.tableOutput.name) {
        this.$emit('savePluginData', this.tableOutput);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    partitioning_enabled_change (val) {
      val = val === 'Y';
      this.partitioning_field = this.partitioning_monthly = this.partitioning_daily = !val;
      this.truncate = val;
    },
    use_batch_change (val) {
      val = val === 'Y';
      this.ignore_errors = val;
      this.isDisabled_style = val;
    },
    return_keys_change (val) {
      val = val === 'Y';
      this.return_keys_name = !val;
      this.use_batch = val;
      this.tableOutput.use_batch = false;
      this.ignore_errors = false;
    },
    tablename_in_field_chanage (val) {
      val = val === 'Y';
      this.tablename_field = this.tablename_in_table = !val;
      this.table = this.truncate = val;
    },
    specify_fields_chanage (val) {
      val = val === 'Y';
      this.gFields = this.valueMapper = !val;
    },
    cancel () {
      if (this.tempTableOutput) {
        this.saveTempPluginData(this.tempTableOutput);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.tableOutput.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    async getInputFieldsOption () {
      if (this.tableFields.length === 0) {
        const result = await this.getInputField();
        if (result) {
          this.$set(this, 'tableFields', result.data);
        }
      }
    },
    async getStreamFiledOption () {
      if (this.streamFields.length === 0) {
        const streamFields = await this.getStreamField();
        if (streamFields) {
          this.$set(this, 'streamFields', streamFields.data);
        }
      }
    },
    async addObj () {
      this.tableOutput.fields.push({});
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
    partition_change (value) {
      if (value === 'monthly') {
        this.tableOutput.partitioning_monthly = 'Y';
        this.tableOutput.partitioning_daily = 'N';
      } else if (value === 'daily') {
        this.tableOutput.partitioning_monthly = 'N';
        this.tableOutput.partitioning_daily = 'Y';
      }
    },
    removeObj (index) {
      this.tableOutput.fields.splice(index, 1);
      this.count = this.tableOutput.fields.length;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['tableOutput'].resetFields();
      this.tableOutput = JSON.parse(JSON.stringify(this.temp));
      this.tableOutput['name'] = stepname;
    },
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
    async getFields () {
      if (this.tableOutput.connection === '') {
        this.$message({
          message: '请选择数据源',
          type: 'warning'
        });
        return;
      }
      if (this.tableOutput.table === '') {
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
        if (streamFields.data) {
          self.$set(self, 'streamFields', streamFields.data);
        }
      } else {
        tempStreamField = this.streamFields;
      }
      if (this.tableFields.length === 0) {
        const result = await this.getInputField();
        if (result.data) {
          self.$set(self, 'tableFields', result.data);
        }
      }
      var tempFileds = [];
      tempStreamField.forEach(element => {
        let obj = {};
        obj.column_name = element.name;
        obj.stream_name = element.name;
        tempFileds.push(obj);
      });
      self.$set(self.tableOutput, 'fields', tempFileds);
    },
    setFields (data) {
      var fileds = [];
      data.forEach(element => {
        let obj = {};
        obj.column_name = element.tableField.name;
        obj.stream_name = element.streamField.name;
        fileds.push(obj);
      });
      this.$set(this.tableOutput, 'fields', fileds);
    },
    hiddenDialog () {
      this.dialogVisible = false;
    },
    async valueMapperclick () {
      this.dialogVisible = true;
      let that = this;
      const result = await this.getStreamField();
      const mapperValues = Object.assign([], this.tableOutput.fields);
      await this.getInputField().then(res => {
        this.$nextTick(() => {
          that.$refs.mapper.setChildFields(res.data, result.data, mapperValues);
        });
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
    setGraph (val) {
      this.graph = val;
    },
    getSchemas () {
      this.schemaDialogVisible = true;
      API.database.schemas({'database': this.tableOutput.connection}).then(res => {
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
      this.$set(this.tableOutput, 'schema', val);
    },
    closeDialog () {
      this.schemaDialogVisible = false;
      this.tableDialogVisible = false;
    },
    getTables () {
      this.tableDialogVisible = true;
      API.database.explorer({'database': this.tableOutput.connection}).then(res => {
        if (res) {
          this.$refs.tableDialog.data = res.data;
        } else {
          this.$refs.tableDialog.data = [];
        }
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
    setTable (currentData) {
      this.$set(this.tableOutput, 'schema', currentData.schema);
      this.$set(this.tableOutput, 'table', currentData.name);
    },
    getInputField () {
      if (this.tableOutput.connection && this.tableOutput.table) {
        const param = {};
        param['database'] = this.tableOutput.connection;
        param['schema'] = this.tableOutput.schema;
        param['table'] = this.tableOutput.table;
        return API.database.fields(param);
      }
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.tableOutput.name) {
        return API.trans.inputFields(value, {'stepName': this.tableOutput.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.tableOutput);
      const graph = this.graph;
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(graph.getModel());
      const value = mxUtils.getPrettyXml(node);
      return value;
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
    },
    getSQL () {
      this.sqlEditorVisible = true;
    },
    editDb () {
    },
    newDb () {}
  },
  mounted () {
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
.optionStyle button {
  margin: 0px
}
.el-textarea /deep/ .el-textarea__inner{
  height: 300px !important;
}
.button {
  width: 110px;
  height: 40px;
  display: inline-block;
  margin-left: 20px;
  text-align: center;
  font-size: 12px;
}
.el-tabs .el-tabs__content {
    margin-top: 15px;
}
.el-checkbox__label {
  display: none !important
}
.el-dialog__header {
  text-align: left !important;
}
.el-dialog__footer {
  margin-top: 10px;
}
.el-tabs /deep/ .el-tabs__content {
    padding: 15px !important;
}
</style>
