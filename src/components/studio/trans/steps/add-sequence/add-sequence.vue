<template>
  <div class="">
    <el-form ref="step" :model="sequence" label-width="180px">
      <el-form-item label="步骤名称">
        <el-input v-model="sequence.name"></el-input>
      </el-form-item>
      <el-form-item label="值的名称">
        <el-input v-model="sequence.valuename"></el-input>
      </el-form-item>
      <div class="box" title="使用数据库生成序列" style="margin-top:20px;">
      <el-form-item label="使用DB来获取序列">
        <el-checkbox v-model="sequence.use_database" true-label="Y" false-label= "N" @change="change('use_database', sequence.use_database)"></el-checkbox>
      </el-form-item>
      <el-form-item label="数据库连接">
        <el-select v-model="sequence.connection" placeholder="请选择" style="width:100%" @change="databasesChanage" @focus="databases" :disabled="use_database_input">
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
      <el-form-item label="模式名称">
        <el-input v-model="sequence.schema" style="width:89%" :disabled="use_database_input"></el-input>
        <el-button type="primary" @click="getSchemas" style="float:right" :disabled="use_database">模式</el-button>
      </el-form-item>
      <el-form-item label="序列名称">
        <el-input v-model="sequence.seqname" style="width:89%" :disabled="use_database_input"></el-input>
        <el-button type="primary" @click="getSequence" style="float:right" :disabled="use_database">序列</el-button>
      </el-form-item>
      </div>
      <div class="box" title="使用转换计数器来生成序列" style="margin-top:20px;">
        <el-form-item label="使用转换计数器来生成序列">
          <el-checkbox v-model="sequence.use_counter" true-label="Y" false-label= "N" @change="change('use_counter', sequence.use_counter)"></el-checkbox>
        </el-form-item>
        <el-form-item label="计算器名称(可选)">
          <el-input v-model="sequence.counter_name" :disabled="use_counter"></el-input>
        </el-form-item>
        <el-form-item label="起始值">
          <el-input v-model="sequence.start_at" :disabled="use_counter"></el-input>
        </el-form-item>
        <el-form-item label="增长值">
          <el-input v-model="sequence.increment_by" :disabled="use_counter"></el-input>
        </el-form-item>
        <el-form-item label="最大值">
          <el-input v-model="sequence.max_value" :disabled="use_counter"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>

    <el-dialog
      :visible.sync="sequenceDialogVisible"
      :close-on-click-modal="false"
      :title="sequenceDialogTitle"
      width="40%"
      :append-to-body="true">
      <schema-dialog ref="sequenceDialog" @setSchema="setSchema" @closeDialog="closeDialog"></schema-dialog>
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
import SchemaDialog from '@/views/modules/studio/schema/schema-dialog.vue';
export default {
  name: 'Sequence',
  props: {
    name: String
  },
  components: {
    'schema-dialog': SchemaDialog
  },
  watch: {
    sequence (sequence) {
      const val = sequence.use_database === 'Y';
      if (val && sequence.connection) {
        this.$set(this, 'use_database', false);
      } else {
        this.$set(this, 'use_database', true);
      }
    }
  },
  data () {
    return {
      graph: null,
      tshow: false,
      use_database: true,
      use_database_input: true,
      use_counter: false,
      sequenceDialogTitle: '浏览序列',
      schemaDialog: '浏览模式',
      schemaDialogVisible: false,
      sequenceDialogVisible: false,
      sequence: {
        name: '',
        connection: '',
        valuename: 'valuename',
        calculateName: '',
        start_at: '1',
        increment_by: '1',
        max_value: '999999999',
        use_database: 'N',
        use_counter: 'Y'
      },
      temp: {
        name: '',
        connection: '',
        valuename: '',
        calculateName: '',
        start_at: '1',
        increment_by: '1',
        max_value: '999999999',
        use_database: 'N',
        use_counter: 'Y'
      },
      dbConnectionOptions: []
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.sequence = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.sequence.name) {
        this.$emit('savePluginData', this.sequence);
        this.sequence = Object.assign({}, this.temp);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      this.$emit('cancel');
      this.sequence = Object.assign({}, this.temp);
    },
    setGraph (val) {
      this.graph = val;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.sequence = Object.assign({}, this.temp);
      this.sequence.name = stepname;
    },
    getSequence () {
      this.sequenceDialogVisible = true;
      API.database.explorer({'database': this.sequence.connection}).then(res => {
        this.$refs.sequenceDialog.data = res.data;
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
    getSchemas () {
      this.schemaDialogVisible = true;
      API.database.schemas({'database': this.sequence.connection}).then(res => {
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
      this.$set(this.sequence, 'schema', val);
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
    databasesChanage (val) {
      this.use_database = val === undefined;
    },
    closeDialog () {
      this.schemaDialogVisible = false;
    },
    change (param, val) {
      const falg = val === 'Y';
      if (param === 'use_database') {
        this.use_database_input = !falg;
        this.use_database = this.sequence.connection !== undefined;
        this.use_counter = falg;
        this.sequence.use_counter = falg ? 'N' : 'Y';
      } else if (param === 'use_counter') {
        this.use_counter = !falg;
        this.use_database = true;
        this.use_database_input = falg;
        this.sequence.use_database = falg ? 'N' : 'Y';
      }
    },
    setTable (currentData) {
      this.$set(this.sequence, 'seqname', currentData.name);
    },
    editDb () {
    },
    newDb () {
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 10px !important;
}
.el-dialog__footer {
  margin-top: 10px;
} 
.box{
    position:relative;
    border:1px solid #dcdfe6;
    padding:30px 10px; 
}
.box::before{
    content:attr(title);
    position:absolute;
    top: 0%;
    left:15%;
    transform:translateX(-50%);
    -webkit-transform:translate(-50%,-50%);
    padding:0px 10px;
    background-color:#fff;
}
</style>
