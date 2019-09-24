<template>
  <div class="">
    <el-form ref="valueMapper" :model="valueMapper" label-width="150px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="valueMapper.name"></el-input>
      </el-form-item>
      <el-form-item label="使用字段名" prop="field_to_use">
        <el-select v-model="valueMapper.field_to_use" placeholder="请选择" style="width:100%" @focus="getStreamField">
          <el-option
            v-for="item in fieldOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="目标字段名(空=覆盖)" prop="target_field">
         <el-input v-model="valueMapper.target_field"></el-input>
      </el-form-item>
       <el-form-item label="不匹配时默认值" prop="non_match_default">
         <el-input v-model="valueMapper.non_match_default"></el-input>
      </el-form-item>
      <div class="box" title="字段值" style="margin-top:20px;">
        <el-row>
          <el-col :span="24">
            <el-table :data="valueMapper.fields" border style="width: 100%;" height="200">
              <!-- <el-table-column type="selection"></el-table-column> -->
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
              <el-table-column property="source_value" label="源值">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.source_value"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="target_value" label="目标值">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.target_value"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>   
          <el-col :span="24">
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
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
import API from '@/api';
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
  name: 'valueMapper',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      valueMapper: {
        name: '',
        field_to_use: '',
        target_field: '',
        non_match_default: '',
        fields: []
      },
      temp: {
        name: '',
        field_to_use: '',
        target_field: '',
        non_match_default: '',
        fields: []
      },
      fieldOptions: []
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.valueMapper = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.valueMapper.name) {
        this.$emit('savePluginData', this.valueMapper);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    setGraph (val) {
      this.graph = val;
    },
    cancel () {
      this.$emit('cancel');
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['valueMapper'].resetFields();
      this.valueMapper = JSON.parse(JSON.stringify(this.temp));
      this.valueMapper['name'] = stepname;
    },
    async getStreamField () {
      const value = await this.getXml();
      await API.trans.inputFields(value, {'stepName': this.valueMapper.name}).then(res => {
        this.$set(this, 'fieldOptions', res.data);
      });
    },
    getXml () {
      this.saveTempPluginData(this.valueMapper);
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
      this.valueMapper.fields.splice(index, 1);
    },
    addObj () {
      this.valueMapper.fields.push({});
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
</style>
