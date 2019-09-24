<template>
    <el-table :data="tableData" border fit highlight-current-row height="250" @row-dblclick="rowDblclick"
      v-loading="loading"
      @cell-click="cellClick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-column label=" 操作" align="center" fixed width="80">
        <template slot-scope="scope">
          <el-button @click="removeObj(scope.$index)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
      <template v-for="(th, key) in tableHeader">
        <el-table-column 
          :key="key"
          :prop="th.prop"
          :label="th.label"
          :fixed="th.fixed"
          v-if="th.prop === 'calc_type'"
          :min-width="th.minWidth" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="true">{{scope.row['lable']}}</span>
            <span size="small" v-if="false" >{{scope.row[th.prop]}}</span>
          </template>
        </el-table-column>

        <el-table-column 
          :key="key"
          :prop="th.prop"
          :label="th.label"
          :fixed="th.fixed"
          v-else-if="th.type === 'input'"
          :min-width="th.minWidth" align="center" width="150">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row[th.prop]"></el-input>
          </template>
        </el-table-column>

        <el-table-column 
          :key="key"
          :prop="th.prop"
          :label="th.label"
          :fixed="th.fixed"
          v-else-if="th.prop === 'in_stream_name' || th.prop === 'replace_field_by_string' || th.prop === 'field_a' || th.prop === 'field_b' || th.prop === 'field_c' || th.prop === 'name'"
          :min-width="th.minWidth" align="center" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row[th.prop]" style="width: 100%;" @focus="getFiledsOptions">
              <el-option
                v-for="item in fieldsOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column 
          :key="key"
          :prop="th.prop"
          :label="th.label"
          :fixed="th.fixed"
          v-else-if="th.prop === 'format' || th.prop === 'conversion_mask'"
          :min-width="th.minWidth" align="center" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row[th.prop]" style="width: 100%;" @focus="getvalueFormats(scope.row.type)">
              <el-option
                v-for="item in formatOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column 
          :key="key"
          :prop="th.prop"
          :label="th.label"
          :fixed="th.fixed"
          v-else-if="th.type === 'select'"
          :min-width="th.minWidth" align="center" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row[th.prop]" style="width: 100%;">
              <el-option
                v-for="item in options[key]"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>
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
</el-table>
</template>

<script>
/* eslint semi: ["error", "always"] */
import API from '@/api';
export default {
  name: 'tableFields',
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    rowDblclick: {
      type: Function,
      default: (row, event, column) => {}
    },
    tableHeader: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableFiledData: [],
      calcTypevisible: false,
      calcTypeDialogTitle: '选择计算类型',
      calcType: [],
      currentData: null,
      currentRow: null,
      typeOptions: [],
      fieldsOptions: [],
      options: [],
      key: '',
      label: '',
      value: '',
      filedIndex: 0,
      formatOptions: []
    };
  },
  methods: {
    cellClick (row, column, cell, event) {
      if (column.property === 'calc_type') {
        API.studio.calculator().then(res => {
          this.$set(this, 'calcType', res.data);
        });
        this.calcTypevisible = true;
        this.currentRow = row;
      }
    },
    removeObj (index) {
      this.$emit('removeObj', index);
    },
    getFiledsOptions () {
      if (this.fieldsOptions) {
        this.$emit('getStreamFieldOptions');
      }
    },
    getvalueFormats (param) {
      if (param) {
        API.studio.valueFormats({'valueMetaName': param}).then(res => {
          this.formatOptions = res.data;
        });
      } else {
        this.formatOptions = [];
      }
    },
    currentChange (currentRow, oldCurrentRow) {
      this.currentData = currentRow;
    },
    rowDbclick (row) {
      this.$set(this.currentRow, 'calc_type', row.code);
      this.$set(this.currentRow, 'lable', row.name);
      this.calcTypevisible = false;
    },
    handleSubmit () {
      if (this.currentData) {
        this.$set(this.currentRow, 'lable', this.currentData.name);
        this.$set(this.currentRow, 'calc_type', this.currentData.code);
      }
      this.calcTypevisible = false;
    },
    setOptions (result) {
      if (result) {
        if (this.fieldsOptions.length === 0) {
          var tempFileds = [];
          result.then(res => {
            res.data.forEach(element => {
              let obj = {};
              obj.name = element.name;
              tempFileds.push(obj);
            });
          });
          this.fieldsOptions = tempFileds;
        }
      }
    },
    async getOptiones () {
      let tempOption = [];
      for (let index = 0; index < this.tableHeader.length; index++) {
        tempOption[index] = [];
        const element = this.tableHeader[index];
        const key = element['prop'];
        if (key === 'type' || key === 'value_type') {
          await API.studio.valueMetas().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'encoding') {
          await API.studio.encodings().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'set_empty_string' || key === 'idrem' || key === 'use_regex' || key === 'whole_word' || key === 'case_sensitive' || key === 'repeat' || key === 'date_format_lenient' || key === 'lenient_string_to_number' || key === 'binary_to_normal' || key === 'init_cap') {
          tempOption[index] = [{code: 'Y', name: '是'}, {code: 'N', name: '否'}];
        } else if (key === 'trim_type' || key === 'trimtype') {
          await API.studio.trimTypes().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'lower_upper') {
          tempOption[index] = [{code: 'node', name: 'none'}, {code: 'lowwer', name: 'lowwer'}, {code: 'upper', name: 'upper'}];
        } else if (key === 'digits') {
          await API.studio.digits().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'padding_type') {
          await API.studio.paddings().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'remove_special_character') {
          await API.studio.specialCharacters().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'escape') {
          await API.studio.escapeMasks().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'date_format_timezone') {
          await API.studio.timezones().then(res => {
            tempOption[index] = res.data;
          });
        } else if (key === 'date_format_locale') {
          await API.studio.locales().then(res => {
            tempOption[index] = res.data;
          });
        } else {
          tempOption[index] = [];
        }
      }
      this.$set(this, 'options', tempOption);
    }
  },
  mounted () {
    this.getOptiones();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
