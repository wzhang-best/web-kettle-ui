<template>
  <div class="">
    <el-form ref="unique" :model="unique" label-width="140px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="unique.name"></el-input>
      </el-form-item>
      <div class="box" title="设置" style="margin-top:20px;">
        <el-row>
          <el-col :span="4">
            <el-form-item label="增加计数到输出" prop="count_rows">
              <el-checkbox v-model="unique.count_rows" true-label="Y" false-label= "N" @change="countRowsChange"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="计数器字段" prop="count_field">
              <el-input v-model="unique.count_field" :disabled="count_rows"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="重定向重复记录" prop="reject_duplicate_row">
              <el-checkbox v-model="unique.reject_duplicate_row" true-label="Y" false-label= "N" @change="rejectDuplicateRowChange"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="错误描述" prop="error_description">
              <el-input v-model="unique.error_description" :disabled="reject_duplicate_row"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:20px;margin-bottom:5px"><span>用来比较的字段(没有条目意味着:比较现在完成了)</span></div>
      <el-table :data="unique.fields" border style="width: 100%;" height="200">
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
        <el-table-column property="name" label="字段名称">
          <template slot-scope="scope">
            <el-select v-model="scope.row.name" style="width: 100%;" @focus="getFiledsOption">
              <el-option
                v-for="item in streamFields"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column property="case_insensitive" label="忽略大小写">
           <template slot-scope="scope">
            <el-select v-model="scope.row.case_insensitive" style="width: 100%;" >
              <el-option
                v-for="item in flagOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
      </el-col>
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
  name: 'unique',
  props: {
    name: String
  },
  data () {
    return {
      count_rows: true,
      graph: null,
      reject_duplicate_row: true,
      streamFields: [],
      flagOptions: [{code: 'Y', name: '是'}, {code: 'N', name: '否'}],
      unique: {
        name: '',
        count_rows: 'N',
        reject_duplicate_row: 'N',
        fields: []
      },
      tempUnique: null,
      temp: {
        name: '',
        count_rows: 'N',
        reject_duplicate_row: 'N',
        fields: []
      }
    };
  },
  watch: {
    unique (data) {
      this.count_rows = data.count_rows === 'N';
      this.reject_duplicate_row = data.reject_duplicate_row === 'N';
    }
  },
  methods: {
    loadData (data) {
      if (data) {
        console.log(data);
        this.$forceUpdate();
        this.unique = Object.assign({}, data);
        this.tempUnique = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.unique.name) {
        this.$emit('savePluginData', this.unique);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      if (this.tempUnique) {
        this.saveTempPluginData(this.tempUnique);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.unique.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['unique'].resetFields();
      this.unique = JSON.parse(JSON.stringify(this.temp));
      this.unique['name'] = stepname;
    },
    async getFiledsOption () {
      if (this.streamFields.length === 0) {
        const streamFields = await this.getStreamField();
        if (streamFields) {
          this.$set(this, 'streamFields', streamFields.data);
        }
      }
    },
    countRowsChange (val) {
      this.count_rows = val === 'N';
    },
    rejectDuplicateRowChange (val) {
      this.reject_duplicate_row = val === 'N';
    },
    async getField () {
      const self = this;
      let streamFields = await this.getStreamField();
      var tempFileds = [];
      streamFields.data.forEach(element => {
        let obj = {};
        obj.name = element.name;
        tempFileds.push(obj);
      });
      self.$set(self.unique, 'fields', tempFileds);
    },
    async getStreamField () {
      const value = await this.getXml();
      if (this.unique.name) {
        return API.trans.inputFields(value, {'stepName': this.unique.name});
      }
    },
    getXml () {
      this.saveTempPluginData(this.unique);
      const graph = this.graph;
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(graph.getModel());
      const value = mxUtils.getPrettyXml(node);
      return value;
    },
    async getStreamFieldOptions () {
      const result = this.getStreamField();
      this.$refs['tableField'].setOptions(result);
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
    },
    removeObj (index) {
      this.unique.fields.splice(index, 1);
    },
    async addObj () {
      this.unique.fields.push({});
      if (this.streamFields.length === 0) {
        const streamFields = await this.getStreamField();
        if (streamFields) {
          this.$set(this, 'streamFields', streamFields.data);
        }
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
.el-dialog__footer {
  margin-top: 50px;
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
    left:10%;
    transform:translateX(-50%);
    -webkit-transform:translate(-50%,-50%);
    padding:0px 10px;
    background-color:#fff;
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
