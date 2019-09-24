<template>
  <div class="">
    <el-form ref="constant" :model="constant" label-width="110px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="constant.name"></el-input>
      </el-form-item>
      <el-form-item  label="字段" prop="fields">
        <el-col :span=24>
           <vxe-table
          border
          size="small"
          show-overflow
          height="200"
          row-id="id"
          highlight-current-row
          :data.sync="constant.fields"
          :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
          >
          <vxe-table-column type="index" width="60"></vxe-table-column>
          <vxe-table-column title="操作" width="60">
            <template slot-scope="scope">
                <div class="optionStyle">
                  <el-button
                      type="text"
                      @click="removeObj(scope.$index)"
                      size="mini">移除
                  </el-button>   
                </div>      
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="名称" :edit-render="{name: 'input'}" width='200'></vxe-table-column>
          <vxe-table-column field="type" title="类型" :edit-render="{name: 'select', options: typeOptions }" width='200'></vxe-table-column>
          <vxe-table-column field="format" title="格式" :edit-render="{name: 'select', options: formatOptions}" width='200'></vxe-table-column>
          <vxe-table-column field="length" title="长度" :edit-render="{name: 'input'}" width='200'></vxe-table-column>
          <vxe-table-column field="precision" title="精度" :edit-render="{name: 'input'}" width='200'></vxe-table-column>
          <vxe-table-column field="currency" title="当前的" :edit-render="{name: 'input'}" width='200'></vxe-table-column>
          <vxe-table-column field="group" title="组" :edit-render="{name: 'input'}" width='200'></vxe-table-column>
          <vxe-table-column field="nullif" title="值" :edit-render="{name: 'input'}" width='200'></vxe-table-column>
          <vxe-table-column field="set_empty_string" title="设为空串?" :edit-render="{name: 'select', options: falgOptions}" width='200'></vxe-table-column>
        </vxe-table> 
        </el-col>
        <el-col :span=24>
          <div class="el-table-add-row" style="width:100%" @click="addObj(1)"><span>+ 添加</span></div>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="el-dialog__footer">
      <span  class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
import API from '@/api';
export default {
  name: 'Constant',
  props: {
    name: String
  },
  data () {
    return {
      count: 0,
      constant: {
        name: '增加常量',
        fields: []
      },
      typeOptions: [],
      formatOptions: [],
      falgOptions: [{
        value: 'Y',
        label: '是'
      }, {
        value: 'N',
        label: '否'
      }]
    };
  },
  methods: {
    loadData (data) {
      console.log(data);
      if (data) {
        this.$forceUpdate();
        this.constant = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      console.log(JSON.stringify(this.constant));
      this.$emit('savePluginData', this.constant);
    },
    cancel () {
      this.resetFormData();
      this.count = this.constant.fields.length;
      this.$emit('cancel');
    },
    setGraph (val) {
      this.editor = val;
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
    resetFormData () {
      this.$refs['constant'].resetFields();
    },
    addObj (index) {
      this.constant.fields.push({});
      this.count = this.constant.fields.length;
    },
    removeObj (index) {
      this.constant.fields.splice(index, 1);
      this.count = this.constant.fields.length;
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
.optionStyle button {
  margin: 0px
}
.el-dialog__footer {
  margin-top: 10px;
}
</style>
