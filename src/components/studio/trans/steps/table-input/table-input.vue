<template>
  <div class="">
    <el-form ref="tableInput" :model="tableInput" label-width="160px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="tableInput.name"></el-input>
      </el-form-item>
      <el-form-item label="数据库连接" prop="connection">
        <el-select v-model="tableInput.connection" placeholder="请选择" @focus="databases" style="width:81%">
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
        <el-button type="primary" style="float:right" @click="getSql()" :disabled="connectionVisible">获取SQL语句</el-button>
      </el-form-item>
      <el-form-item label="SQL" prop="sql">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" v-model="tableInput.sql"></el-input>
      </el-form-item>
      <el-form-item label="允许简易转换" prop="lazy_conversion_active">
        <el-checkbox v-model="tableInput.lazy_conversion_active" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <!--
      <el-form-item label="替换SQL语句里的变量" prop="variables_active">
        <el-checkbox v-model="tableInput.variables_active" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <el-form-item label="从步骤插入数据" prop="lookup">
        <el-select v-model="tableInput.lookup" placeholder="请选择" style="width:100%" :disabled="lookup">
          <el-option
            v-for="item in lookupOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行每一行?" prop="excute_each_row">
        <el-checkbox v-model="tableInput.excute_each_row" disabled true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      -->
      <el-form-item label="记录数量限制" prop="limit">
        <el-input v-model="tableInput.limit"></el-input>
      </el-form-item>
    </el-form>
    <div class="el-dialog__footer" style="margin-buttom:20px">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button type="info" @click="preview" >预览</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>

    <!-- 表弹出框 -->
    <el-dialog
      :visible.sync="tableDialogVisible"
      :close-on-click-modal="false"
      width="40%"
      :title="tableDialogTitle"
      :append-to-body="true">
      <table-dialog ref="tableDialog" @setTable="setTable" @closeDialog="closeDialog"></table-dialog>
    </el-dialog>

    <el-dialog
      :visible.sync="previewDialogVisible"
      :close-on-click-modal="false"
      width="40%"
      :title="previewDialogTitle"
      :append-to-body="true">
      <preview-dialog ref="previewDialog"></preview-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="previewDialogVisible = false">确定</el-button>
        <el-button @click="previewDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="countDialogVisible"
      :close-on-click-modal="false"
      width="40%"
      :title="countwDialogTitle"
      :append-to-body="true">
      输入你要预览的记录数量  
      <el-input v-model="count"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="countDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
import API from '@/api';
import TableDialog from '@/views/modules/studio/table/table-dialog.vue';
import PreviewDialog from '@/views/modules/studio/preview/Preview.vue';
export default {
  name: 'TableInput',
  props: {
    name: String
  },
  components: {
    'table-dialog': TableDialog,
    'preview-dialog': PreviewDialog
  },
  watch: {
    'tableInput.connection': function (val, oldVal) {
      if (val) {
        this.$set(this, 'connectionVisible', false);
      } else {
        this.$set(this, 'connectionVisible', true);
      }
    }
  },
  data () {
    return {
      tshow: false,
      graph: null,
      tableDialogTitle: '浏览数据库',
      previewDialogTitle: '数据预览',
      countwDialogTitle: '输入预览记录数量',
      tableDialogVisible: false,
      previewDialogVisible: false,
      countDialogVisible: false,
      lookup: true,
      connectionVisible: true,
      count: 1000,
      lookupOptions: [],
      tableInput: {
        name: '',
        sql: '',
        connection: '',
        lazy_conversion_active: 'N',
        variables_active: 'N',
        lookup: '',
        excute_each_row: 'N',
        limit: 0
      },
      temp: {
        name: '',
        sql: '',
        connection: '',
        lazy_conversion_active: 'N',
        variables_active: 'N',
        lookup: '',
        excute_each_row: 'N',
        limit: 0
      },
      tempTableInput: {},
      dbConnectionOptions: [],
      stepOptions: []
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.tableInput = Object.assign({}, data);
        this.tempTableInput = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.tableInput.name) {
        this.$emit('savePluginData', this.tableInput);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      this.saveTempPluginData(this.tempTableInput);
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
     // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['tableInput'].resetFields();
      this.tableInput.name = stepname;
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
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
    // 获取SQL语句
    getSql () {
      this.tableDialogVisible = true;
      if (this.tableInput.connection) {
        API.database.explorer({'database': this.tableInput.connection}).then(res => {
          this.$refs.tableDialog.data = res.data;
        }).catch(error => {
          const errorResultData = error.response.data;
          this.$message({
            message: errorResultData.error.message,
            type: 'warning'
          });
        });
      }
    },
    setTable (currentData) {
      const param = {};
      param['database'] = this.tableInput.connection;
      param['schema'] = currentData.schema;
      param['table'] = currentData.name;
      this.$confirm('你想在SQL包含字段名吗?', '问题?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const that = this;
        param['includeField'] = true;
        API.database.getSQL(param).then(res => {
          that.$set(this.tableInput, 'sql', res.data);
        }).catch(error => {
          const errorResultData = error.response.data;
          this.$message({
            message: errorResultData.error.message,
            type: 'warning'
          });
        });
      }).catch(() => {
        const that = this;
        param['includeField'] = false;
        API.database.getSQL(param).then(res => {
          that.$set(this.tableInput, 'sql', res.data);
        }).catch(error => {
          const errorResultData = error.response.data;
          this.$message({
            message: errorResultData.error.message,
            type: 'warning'
          });
        });
      });
    },
    closeDialog () {
      this.tableDialogVisible = false;
    },
    preview () {
      this.countDialogVisible = true;
    },
    handleSubmit () {
      this.countDialogVisible = false;
      this.previewDialogVisible = true;
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
</style>
