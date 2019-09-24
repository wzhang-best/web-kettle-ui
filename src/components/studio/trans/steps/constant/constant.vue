<template>
  <div class="">
    <el-form ref="constant" :model="constant" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="constant.name"></el-input>
      </el-form-item>
      <div class="box" title="字段" style="margin-top:20px;">  
        <!-- 
        <el-form-item label="字段" prop="fields">
        <el-table :data="constant.fields" border style="width: 100%;" height="250">
          <el-table-column type="selection" ></el-table-column>
          <el-table-column label="操作" width="85" :resizable=false>
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
          <el-table-column property="name" label="名称" width="200">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="type" label="类型" width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" placeholder="请选择" @focus="getvalueMetas">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column property="format" label="格式" width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.format" placeholder="请选择" @focus="getvalueFormats(scope.row.type)">
                <el-option
                  v-for="item in formatOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column property="length" label="长度" width="200">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.length"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="precision" label="精度" width="200">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.precision"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="currency" label="当前的" width="200">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.currency"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="decimal" label="10进制的" width="200">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.decimal"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="group" label="组" width="200">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.group"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="nullif" label="值" width="200">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.nullif"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="set_empty_string" label="设为空串?" width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.set_empty_string" placeholder="请选择">
                <el-option
                  v-for="item in falgOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template> 
          </el-table-column>
        </el-table> -->
        <el-row>
          <template>
            <u-table ref="tableField" :tableData="constant.fields" :tableHeader="cloumns" @removeObj="removeObj"></u-table>
            <el-col :span=24>
              <div class="el-table-add-row" style="width:100%" @click="addObj(1)"><span>+ 添加</span></div>
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
import TableFileds from '@/views/modules/studio/table/table-fields.vue';
export default {
  name: 'Constant',
  props: {
    name: String
  },
  components: {
    'u-table': TableFileds
  },
  data () {
    return {
      count: 0,
      constant: {
        name: '',
        fields: []
      },
      temp: {
        name: '',
        fields: []
      },
      tempConstant: null,
      typeOptions: [],
      formatOptions: [],
      falgOptions: [{
        value: 'Y',
        label: '是'
      }, {
        value: 'N',
        label: '否'
      }],
      cloumns: [
        { prop: 'name', label: '名称', type: 'input' },
        { prop: 'type', label: '类型', type: 'select' },
        { prop: 'format', label: '格式', type: 'select' },
        { prop: 'length', label: '长度', type: 'input' },
        { prop: 'precision', label: '精度', type: 'input' },
        { prop: 'currency', label: '货币', type: 'input' },
        { prop: 'decimal', label: '10进制的', type: 'input' },
        { prop: 'nullif', label: '值', type: 'input' },
        { prop: 'group', label: '分组符号', type: 'input' },
        { prop: 'set_empty_string', label: '设为空串?', type: 'select' }
      ]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.constant = Object.assign({}, data);
        this.tempConstant = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.constant.name) {
        this.$emit('savePluginData', this.constant);
        this.constant = Object.assign({}, this.temp);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    getvalueFormats (param) {
      API.studio.valueFormats({'valueMetaName': param}).then(res => {
        this.formatOptions = res.data;
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
    getvalueMetas () {
      API.studio.valueMetas().then(res => {
        this.typeOptions = res.data;
      }).catch(error => {
        const errorResultData = error.response.data;
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
      });
    },
     // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['constant'].resetFields();
      this.constant = Object.assign({}, this.temp);
      this.constant.name = stepname;
    },
    addObj () {
      this.constant.fields.push({});
    },
    removeObj (index) {
      this.constant.fields.splice(index, 1);
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
    }
  },
  mounted () {
    this.count = this.constant.fields.length;
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
.optionStyle button {
  margin: 0px
}
.el-dialog__footer {
  margin-top: 10px;
}
</style>
