<template>
  <div class="">
    <el-form ref="delete" :model="Delete" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="Delete.name"></el-input>
      </el-form-item>
      <el-form-item label="数据库连接" prop="connection">
        <el-select v-model="Delete.connection" placeholder="请选择" @focus="databases" style="width:100%">
          <el-option
            v-for="item in dbConnectionOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <el-button type="primary" @click="editDb" v-show="tshow">编辑</el-button>
        <el-button type="primary" @click="newDb" v-show="tshow">新建</el-button>
        <el-button type="primary" v-show="tshow">Wizard</el-button>
      </el-form-item>
      <el-form-item label="目标模式" prop="schema">
        <el-input v-model="Delete.lookup.schema" class="u-el-input" style="width:89%"></el-input>
        <el-button type="primary" @click="getSchemas" style="float:right" :disabled="connectionVisible">浏览</el-button>
      </el-form-item>
      <el-form-item label="目标表" prop="table">
        <el-input v-model="Delete.lookup.table" class="u-el-input" style="width:89%"></el-input>
        <el-button type="primary" @click="getTables" style="float:right" :disabled="connectionVisible">浏览</el-button>
      </el-form-item>
      <el-form-item label="提交记录数量" prop="commit">
        <el-input v-model="Delete.commit"></el-input>
      </el-form-item>

      <div class="box" title="查询所需关键字" style="margin-top:20px;">  
        <el-row>
          <el-col :span="21">
            <el-table :data="Delete.lookup.keys"  border style="width: 100%;" height="200">
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column label="操作" align="center" fixed width="80">
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
              <el-table-column property="name2" label="流里的字段2" @focus="getStreamFieldoption">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.name2" style="width: 100%;" >
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
                <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
            </el-col>
          </el-col> 
          <el-col :span="3">
            <el-button type="primary" @click="getFields" class="button">获取字段</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>

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
        tableDialog
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
/* eslint-disable no-undef */
/* eslint-disable no-new-object */
/* eslint-disable no-new */
/* eslint-disable new-cap */
const {
  mxUtils,
  mxCodec
} = mxgraph;
export default {
  name: 'Delete',
  props: {
    name: String
  },
  components: {
    'table-dialog': TableDialog,
    'preview-dialog': PreviewDialog,
    'schema-dialog': SchemaDialog
  },
  data () {
    return {
      graph: null,
      tshow: false,
      schemaDialog: '浏览模式',
      tableDialog: '浏览数据库',
      schemaDialogVisible: false,
      tableDialogVisible: false,
      connectionVisible: true,
      Delete: {
        name: '',
        connection: '',
        commit: '100',
        lookup: {
          keys: [],
          schema: '',
          table: ''
        }
      },
      temp: {
        name: '',
        connection: '',
        commit: '100',
        lookup: {
          keys: [],
          schema: '',
          table: ''
        }
      },
      tempDelete: null,
      tabsValue: 'main',
      tableFields: [],
      conditionOptions: [],
      streamFields: [],
      streamFields2: [],
      dbConnectionOptions: []
    };
  },
  watch: {
    'Delete.connection': function (val, oldVal) {
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
        this.Delete = Object.assign({}, data);
        this.tempDelete = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.Delete.name) {
        this.$emit('savePluginData', this.Delete);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      if (this.tempDelete) {
        this.saveTempPluginData(this.tempDelete);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.Delete.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    getSchemas () {
      this.schemaDialogVisible = true;
      API.database.schemas({'database': this.Delete.connection}).then(res => {
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
      this.$set(this.Delete.lookup, 'schema', val);
    },
    getTables () {
      this.tableDialogVisible = true;
      API.database.explorer({'database': this.Delete.connection}).then(res => {
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
      this.$set(this.Delete.lookup, 'schema', currentData.schema);
      this.$set(this.Delete.lookup, 'table', currentData.name);
    },
    closeDialog () {
      this.schemaDialogVisible = false;
      this.tableDialogVisible = false;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['delete'].resetFields();
      this.Delete.name = stepname;
    },
    async addObj () {
      this.Delete.lookup.keys.push({});
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
    async getFields () {
      if (this.Delete.lookup.connection === '') {
        this.$message({
          message: '请选择数据源',
          type: 'warning'
        });
        return;
      }
      if (this.Delete.lookup.table === '') {
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
        if (result) {
          self.$set(self, 'tableFields', result.data);
        }
      }
      var tempFileds = [];
      tempStreamField.forEach(element => {
        let obj = {};
        obj.field = element.name;
        obj.condition = '=';
        obj.name = element.name;
        obj.name2 = '';
        tempFileds.push(obj);
      });
      self.$set(self.Delete.lookup, 'keys', tempFileds);
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
    getInputField () {
      if (this.Delete.connection && this.Delete.lookup.table) {
        const param = {};
        param['database'] = this.Delete.connection;
        param['schema'] = this.Delete.lookup.schema;
        param['table'] = this.Delete.lookup.table;
        return API.database.fields(param);
      }
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.Delete.name) {
        return API.trans.inputFields(value, {'stepName': this.Delete.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.Delete);
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
      this.Delete.lookup.keys.splice(index, 1);
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
  display: inline-block;
  margin-left: 10px;
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
.el-dialog__footer {
  margin-top: 15px;
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
