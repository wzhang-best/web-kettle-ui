<template>
  <div class="">
    <el-form ref="checkSum" :model="checkSum" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="checkSum.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="checksumtype">
        <el-select v-model="checkSum.checksumtype" placeholder="请选择" style="width:100%" @change="checksumtype_change">
          <el-option
            v-for="item in checksumtypeptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结果类型" prop="resultType">
        <el-select v-model="checkSum.resultType" placeholder="请选择" style="width:100%" :disabled="resultType">
          <el-option
            v-for="item in resultTypeOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="结果字段" prop="resultfieldName">
         <el-input v-model="checkSum.resultfieldName"></el-input>
      </el-form-item>
      <el-form-item label="兼容模式" prop="compatibilityMode">
        <el-checkbox v-model="checkSum.compatibilityMode" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <div class="box" title="检验使用的字段" style="margin-top:20px;">
        <el-row>
          <el-col :span=24>  
            <el-table :data="checkSum.fields" border style="width: 100%;" height="250">
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
              <el-table-column property="name" label="字段">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.name" placeholder="请选择" style="width:100%" @focus="getStreamFieldoption"> 
                    <el-option
                      v-for="item in fieldOptions"
                      :key="item.value"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
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
        <el-button type="info" @click="getField">获取字段</el-button>
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
  name: 'checkSum',
  props: {
    name: String
  },
  data () {
    return {
      resultType: true,
      checkSum: {
        name: '',
        checksumtype: '',
        resultType: '',
        resultfieldName: '',
        compatibilityMode: 'Y',
        fields: []
      },
      temp: {
        name: '',
        checksumtype: '',
        resultType: '',
        resultfieldName: '',
        compatibilityMode: 'Y',
        fields: []
      },
      tempCheckSum: {},
      fieldOptions: [],
      checksumtypeptions: [{
        code: 'CRC 32',
        name: 'CRC 32'
      }, {
        code: 'ADLER 32',
        name: 'ADLER 32'
      }, {
        code: 'MD5',
        name: 'MD5'
      }, {
        code: 'SHA-1',
        name: 'SHA-1'
      }, {
        code: 'SHA-256',
        name: 'SHA-256'
      }],
      resultTypeOptions: [{
        code: 'Hexadecimal',
        name: 'Hexadecimal'
      }, {
        code: 'String',
        name: 'String'
      }, {
        code: 'Binary',
        name: 'Binary'
      }]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.checkSum = Object.assign({}, data);
        this.tempCheckSum = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.checkSum.name) {
        this.$emit('savePluginData', this.checkSum);
        this.checkSum = Object.assign({}, this.temp);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      this.saveTempPluginData(this.tempCheckSum);
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
     // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['checkSum'].resetFields();
      this.checkSum.name = stepname;
    },
    async getField () {
      await this.getStreamField().then(res => {
        let tempFileds = [];
        const tempStreamField = Object.assign([], res.data);
        tempStreamField.forEach(element => {
          let obj = {};
          obj['name'] = element.name;
          tempFileds.push(obj);
        });
        this.$set(this.checkSum, 'fields', res.data);
        this.$set(this, 'fieldOptions', Object.assign([], tempFileds));
      });
    },
    async addObj () {
      this.checkSum.fields.push({});
      if (this.fieldOptions.length === 0) {
        await this.getStreamField().then(res => {
          this.$set(this, 'fieldOptions', Object.assign([], res.data));
        });
      }
    },
    async getStreamFieldoption () {
      if (this.fieldOptions.length === 0) {
        let streamFields = await this.getStreamField();
        this.$set(this, 'fieldOptions', streamFields.data);
      }
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.checkSum.name) {
        return API.trans.inputFields(value, {'stepName': this.checkSum.name});
      } else {
        return [];
      }
    },
    getXml () {
      this.saveTempPluginData(this.checkSum);
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
      this.checkSum.fields.splice(index, 1);
    },
    checksumtype_change (val) {
      if (val === 'CRC 32' || val === 'ADLER 32') {
        this.$set(this, 'resultType', true);
      } else {
        this.$set(this, 'resultType', false);
      }
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
.optionStyle button {
  margin: 0px
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
