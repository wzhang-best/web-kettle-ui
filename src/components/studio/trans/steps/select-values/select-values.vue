<template>
  <div class="">
    <el-form ref="selectValues" :model="selectValues" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="selectValues.name"></el-input>
      </el-form-item>
      <el-tabs v-model="tabsValue" type="border-card" class="tabs">
        <el-tab-pane label="选择和修改" name="selectAndUpdate" >
          <span>字段</span>
          <el-row>
            <el-col :span="20">
              <el-table :data="selectValues.field" border style="width: 100%;" height="200">
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column label="操作" align="center" fixed width="80" :resizable=false>
                  <template slot-scope="scope">
                      <div class="optionStyle">
                        <el-button
                            type="text"
                            @click="removeFileds(scope.$index)"
                            size="mini">移除
                        </el-button>
                      </div>
                  </template>
                  </el-table-column>
                <el-table-column property="name" label="字段名称" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.name" placeholder="请选择">
                      <el-option
                        v-for="item in fieldOptions"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="rename" label="改名成" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.rename"></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="length" label="长度" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.length" ></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="precision" label="精度" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.precision" v-if="scope.row.precision >= 0" ></el-input>
                    <el-input v-model="scope.row.precision" v-else value=""></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <el-col :span=24>
                <div class="el-table-add-row" style="width:100%" @click="addfield()"><span>+ 添加</span></div>
              </el-col>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" class="button" @click="getSelectedFields">获取选择的字段</el-button>
              <el-button type="primary" class="button" style="margin-top:10px;">列映射</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="移除" name="remove">
          <span>移除的字段</span>
          <el-row>
            <el-col :span="20">
              <el-table :data="selectValues.remove" border height="200">
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column label="操作" align="center" fixed width="80" :resizable=false>
                  <template slot-scope="scope">
                    <div class="optionStyle">
                      <el-button
                          type="text"
                          @click="removeRemove(scope.$index)"
                          size="mini">移除
                      </el-button>
                    </div>
                  </template>
                  </el-table-column>
                <el-table-column property="name" label="字段名称">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.name" placeholder="请选择">
                      <el-option
                        v-for="item in fieldOptions"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
              <el-col :span=24>
                <div class="el-table-add-row" style="width:100%" @click="addRemove()"><span>+ 添加</span></div>
              </el-col>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" class="button" @click="getRemoveFields">获取移除的字段</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="元数据" name="meta"> 
          <span>需要改变元数据的字段</span>
          <el-row>
            <el-col :span="20">
              <!-- 
              <el-table :data="selectValues.meta" border style="width: 100%;" height="200">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="操作" width="85" :resizable=false>
                  <template slot-scope="scope">
                    <div class="optionStyle">
                      <el-button
                        type="text"
                        @click="removemeta(scope.$index)"
                        size="mini">移除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="字段名称" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.name" placeholder="请选择">
                      <el-option
                        v-for="item in fieldOptions"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="rename" label="改名成" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.rename"></el-input>
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
                <el-table-column property="length" label="长度" width="200">
                  <template slot-scope="scope">
                    <el-input type="Number" v-model="scope.row.length"></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="precision" label="精度" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.precision"></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="binary_to_normal" label="Binary to Normal?" width="200">
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
                <el-table-column property="conversion_mask" label="格式" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.conversion_mask" placeholder="请选择" @focus="getvalueFormats(scope.row.type)">
                      <el-option
                        v-for="item in formatOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="date_format_lenient" label="Date Format Lenient?" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.date_format_lenient" placeholder="请选择">
                      <el-option
                        v-for="item in falgOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="date_format_locale" label="Date Locale" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.date_format_locale" placeholder="请选择" @focus="getvalueFormats(scope.row.type)">
                      <el-option
                        v-for="item in dateLocalOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="date_format_timezone" label="Data Time Zone" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.date_format_locale" placeholder="请选择" @focus="getvalueFormats(scope.row.type)">
                      <el-option
                        v-for="item in dateLocalOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="lenient_string_to_number" label="Lenient number conversion?" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.lenient_string_to_number" placeholder="请选择">
                      <el-option
                        v-for="item in falgOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="encoding" label="编码" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.encoding" placeholder="请选择" @focus="getEncodings" style="width:100%" width="200">
                      <el-option
                        v-for="item in encodingoptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column property="decimal_symbol" label="十进制" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.decimal_symbol"></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="grouping_symbol" label="组" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.grouping_symbol"></el-input>
                  </template>
                </el-table-column>
                <el-table-column property="currency_symbol" label="货币" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.currency_symbol"></el-input>
                  </template>
                </el-table-column>
              </el-table>
              -->
              <template>
                <u-table ref="tableField" :tableData="selectValues.meta" :tableHeader="cloumns" @removeObj="removeObj" @getStreamFieldOptions="getStreamFieldOptions"></u-table>
                <el-col :span=24>
                  <div class="el-table-add-row" style="width:100%" @click="addmeta()"><span>+ 添加</span></div>
                </el-col>
              </template>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" class="button" @click="getChangFields">获取改变的字段</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
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
  name: 'selectValues',
  props: {
    name: String
  },
  components: {
    'u-table': TableFileds
  },
  data () {
    return {
      graph: null,
      selectValues: {
        name: '',
        field: [],
        remove: [],
        meta: []
      },
      temp: {
        name: '',
        field: [],
        remove: [],
        meta: []
      },
      tempSelectValue: null,
      tabsValue: 'selectAndUpdate',
      fieldOptions: [],
      typeOptions: [],
      encodingoptions: [],
      dateLocalOptions: [],
      formatOptions: [],
      falgOptions: [{
        value: 'Y',
        label: '是'
      }, {
        value: 'N',
        label: '否'
      }],
      cloumns: [
        { type: 'select', prop: 'name', label: '字段名称' },
        { type: 'input', prop: 'rename', label: '改名成' },
        { type: 'select', prop: 'type', label: '类型' },
        { type: 'input', prop: 'length', label: '长度' },
        { type: 'input', prop: 'precision', label: '精度' },
        { type: 'select', prop: 'conversion_mask', label: '格式' },
        { type: 'select', prop: 'date_format_lenient', label: '宽松日期格式' },
        { type: 'select', prop: 'binary_to_normal', label: '二进制转换' },
        { type: 'select', prop: 'date_format_locale', label: '时间地区' },
        { type: 'select', prop: 'date_format_timezone', label: '时区' },
        { type: 'select', prop: 'lenient_string_to_number', label: '宽松数值转换' },
        { type: 'select', prop: 'encoding', label: '编码' },
        { type: 'input', prop: 'decimal_symbol', label: '十进制' },
        { type: 'input', prop: 'grouping_symbol', label: '组' },
        { type: 'input', prop: 'currency_symbol', label: '货币' }
      ]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.selectValues = Object.assign({}, data);
        this.tempSelectValue = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.selectValues.name) {
        this.$emit('savePluginData', this.selectValues);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      if (this.tempSelectValue) {
        this.saveTempPluginData(this.tempSelectValue);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.selectValues.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    // 重置表单数据
    resetFormData (stepName) {
      this.$forceUpdate();
      this.$refs['selectValues'].resetFields();
      this.selectValues = JSON.parse(JSON.stringify(this.temp));
      this.selectValues.name = stepName;
    },
    setGraph (val) {
      this.graph = val;
    },
    removeFileds (index) {
      this.selectValues.field.splice(index, 1);
    },
    async addfield () {
      this.selectValues.field.push({});
      if (this.fieldOptions.length === 0) {
        await this.getStreamField().then(res => {
          let tempFileds = [];
          const tempStreamField = Object.assign([], res.data);
          tempStreamField.forEach(element => {
            let obj = {};
            obj['name'] = element.name;
            tempFileds.push(obj);
          });
          this.$set(this, 'fieldOptions', tempFileds);
        });
      }
    },
    removeRemove (index) {
      this.selectValues.remove.splice(index, 1);
    },
    async addRemove () {
      this.selectValues.remove.push({});
      if (this.fieldOptions.length === 0) {
        await this.getStreamField().then(res => {
          let tempFileds = [];
          const tempStreamField = Object.assign([], res.data);
          tempStreamField.forEach(element => {
            let obj = {};
            obj['name'] = element.name;
            tempFileds.push(obj);
          });
          this.$set(this, 'fieldOptions', tempFileds);
        });
      }
    },
    removeObj (index) {
      this.selectValues.meta.splice(index, 1);
    },
    async addmeta () {
      this.selectValues.meta.push({});
      if (this.fieldOptions.length === 0) {
        await this.getStreamField().then(res => {
          let tempFileds = [];
          const tempStreamField = Object.assign([], res.data);
          tempStreamField.forEach(element => {
            let obj = {};
            obj['name'] = element.name;
            tempFileds.push(obj);
          });
          this.$set(this, 'fieldOptions', tempFileds);
        });
      }
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
    getEncodings () {
      API.studio.encodings().then(res => {
        this.$set(this, 'encodingoptions', res.data);
      });
    },
    async getSelectedFields () {
      const result = await this.getStreamField();
      let tempFileds = [];
      const tempStreamField = Object.assign([], result.data);
      tempStreamField.forEach(element => {
        let obj = {};
        obj['name'] = element.name;
        tempFileds.push(obj);
      });
      this.$set(this, 'fieldOptions', tempFileds);
      this.$set(this.selectValues, 'field', result.data);
    },
    async getRemoveFields () {
      const result = await this.getStreamField();
      let tempFileds = [];
      const tempStreamField = Object.assign([], result.data);
      tempStreamField.forEach(element => {
        let obj = {};
        obj['name'] = element.name;
        tempFileds.push(obj);
      });
      this.$set(this, 'fieldOptions', tempFileds);
      this.$set(this.selectValues, 'remove', result.data);
    },
    async getChangFields () {
      const result = await this.getStreamField();
      let tempFileds = [];
      const tempStreamField = Object.assign([], result.data);
      tempStreamField.forEach(element => {
        let obj = {};
        obj['name'] = element.name;
        tempFileds.push(obj);
      });
      this.$set(this, 'fieldOptions', tempFileds);
      this.$set(this.selectValues, 'meta', result.data);
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.selectValues.name) {
        return API.trans.inputFields(value, {'stepName': this.selectValues.name});
      } else {
        return [];
      }
    },
    getXml () {
      this.saveTempPluginData(this.selectValues);
      const graph = this.graph;
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(graph.getModel());
      const value = mxUtils.getPrettyXml(node);
      return value;
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
    },
    async getStreamFieldOptions () {
      const result = this.getStreamField();
      this.$refs['tableField'].setOptions(result);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 10px !important;
}
.el-tabs /deep/ .el-tabs__content {
    padding: 15px !important;
}
.el-select {
    width: 100%;
}
.button {
  width: 140px;
  display: inline-block;
  margin-left: 10px;
  text-align: center;
}
.el-dialog__footer {
  margin-top: 10px;
}
.optionStyle button {
  margin: 0px
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
