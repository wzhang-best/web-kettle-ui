<template>
  <div class="">
    <el-form ref="calculator" :model="calculator " label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="calculator.name"></el-input>
      </el-form-item>
      <div class="box" title="字段" style="margin-top:20px;">
        <el-row>
          <el-col :span=24>
            <el-table :data="calculator.calculations" fit border style="width: 100%;" height="250" @cell-click="cellClick">
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
              <el-table-column property="field_name" label="新字段" width="150">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.field_name"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="calc_type" label="计算" width="150">
                <template slot-scope="scope">
                  <span v-if="true">{{scope.row['lable']}}</span>
                  <span size="small" v-if="false" >{{scope.row['calc_type']}}</span>
                </template>
              </el-table-column>
              <el-table-column property="field_a" label="字段A" width="150">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field_a" style="width: 100%;" @focus="getFiledsOptions">
                    <el-option
                      v-for="item in fieldsOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="field_b" label="字段B" width="150">
                 <template slot-scope="scope">
                  <el-select v-model="scope.row.field_b" style="width: 100%;" @focus="getFiledsOptions">
                    <el-option
                      v-for="item in fieldsOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="field_c" label="字段C" width="150">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field_c" style="width: 100%;" @focus="getFiledsOptions">
                    <el-option
                      v-for="item in fieldsOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="value_type" label="值类型" width="150">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.value_type" placeholder="请选择" @focus="getvalueMetas">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="value_length" label="长度" width="150">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.value_length"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="value_precision" label="精度" width="150">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.value_precision"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="remove" label="移除" width="150">
                 <template slot-scope="scope">
                  <el-select v-model="scope.row.remove" placeholder="请选择">
                    <el-option
                      v-for="item in falgOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </template> 
              </el-table-column>
              <el-table-column property="conversion_mask" label="转换格式" width="150">
                 <template slot-scope="scope">
                  <el-select v-model="scope.row.conversion_mask" placeholder="请选择">
                    <el-option
                      v-for="item in maskOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </template> 
              </el-table-column>
              <el-table-column property="decimal_symbol" label="小数点符号" width="150">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.decimal_symbol"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="grouping_symbol" label="分组符号" width="150">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.grouping_symbol"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="currency_symbol" label="货币符号" width="150">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.currency_symbol"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span=24>
            <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
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
        :visible.sync="calcTypevisible"
        :close-on-click-modal="false"
        :title="calcTypeDialogTitle"
        width="40%"
        :append-to-body="true">
        <span>选择计算模型来执行</span>
        <el-table
          :data="calcType"
          border
          height="300px"
          highlight-current-row
          @current-change="currentChange"
          @row-dblclick="rowDbclick">
          <el-table-column property="name" label="计算模型"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="calcTypevisible = false">取消</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
import mxgraph from '@/views/modules/studio/graph/index.js';
import API from '@/api';
/* eslint-disable no-undef */
/* eslint-disable no-new-object */
/* eslint-disable no-new */
/* eslint-disable new-cap */
const {
  mxUtils,
  mxCodec
} = mxgraph;
export default {
  name: 'calculator',
  data () {
    return {
      calculator: {
        name: '',
        calculations: []
      },
      temp: {
        name: '',
        calculations: []
      },
      tempCalculator: null,
      calcTypeDialogTitle: '选择计算类型',
      calcTypevisible: false,
      calcType: [],
      currentData: null,
      currentRow: null,
      typeOptions: [],
      fieldsOptions: [],
      maskOptions: [],
      falgOptions: [{code: 'Y', name: '是'}, {code: 'N', name: '否'}]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.calculator = Object.assign({}, data);
        this.tempCalculator = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.calculator.name) {
        this.$emit('savePluginData', this.calculator);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      if (this.tempCalculator) {
        this.saveTempPluginData(this.tempCalculator);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.calculator.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    cellClick (row, column, cell, event) {
      if (column.property === 'calc_type') {
        API.studio.calculator().then(res => {
          this.$set(this, 'calcType', res.data);
        });
        this.calcTypevisible = true;
        this.currentRow = row;
      }
    },
    rowDbclick (row) {
      this.$set(this.currentRow, 'calc_type', row.code);
      this.$set(this.currentRow, 'lable', row.name);
      this.calcTypevisible = false;
    },
    currentChange (currentRow, oldCurrentRow) {
      this.currentData = currentRow;
    },
    handleSubmit () {
      if (this.currentData) {
        this.$set(this.currentRow, 'lable', this.currentData.name);
        this.$set(this.currentRow, 'calc_type', this.currentData.code);
      }
      this.calcTypevisible = false;
    },
     // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['calculator'].resetFields();
      this.calculator = Object.assign({}, this.temp);
      this.calculator.name = stepname;
    },
    addObj (index) {
      this.calculator.calculations.push({});
    },
    removeObj (index) {
      this.calculator['calculations'].splice(index, 1);
    },
    getvalueMetas () {
      API.studio.valueMetas().then(res => {
        this.typeOptions = res.data;
      });
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.calculator.name) {
        return API.trans.inputFields(value, {'stepName': this.calculator.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.calculator);
      const graph = this.graph;
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(graph.getModel());
      const value = mxUtils.getPrettyXml(node);
      return value;
    },
    getFiledsOptions () {
      const result = this.getStreamField();
      var tempFileds = [];
      if (result) {
        result.then(res => {
          res.data.forEach(element => {
            let obj = {};
            obj.name = element.name;
            tempFileds.push(obj);
          });
        });
      }
      if (this.calculator.calculations) {
        this.calculator.calculations.forEach(item => {
          let obj = {};
          obj.name = item['field_name'];
          tempFileds.push(obj);
        });
      }
      this.fieldsOptions = tempFileds;
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
.optionStyle button {
  margin: 0px
}
</style>
