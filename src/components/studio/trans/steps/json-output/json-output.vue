<template>
  <div class="">
    <el-form ref="jsonOutput" :model="jsonOutput" label-width="170px">
      <el-form-item label="步骤名称" prop="stepname">
        <el-input v-model="stepname"></el-input>
      </el-form-item>
        <el-tabs  v-model="tabsValue">
            <el-tab-pane label="一般" name="file">
                <el-form-item label="操作" prop="operation_type">
                  <el-select v-model="jsonOutput.operation_type" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Json条目名称" prop="jsonBloc">
                  <el-input v-model="jsonOutput.jsonBloc" style="width:85%"></el-input>
                </el-form-item> 
                <el-form-item label="一个数据条目的数据行" prop="nrRowsInBloc">
                  <el-input v-model="jsonOutput.nrRowsInBloc" style="width:85%"></el-input>
                </el-form-item>
                <el-form-item label="输出值" prop="name">
                  <el-input v-model="jsonOutput.name" style="width:85%"></el-input>
                </el-form-item> 
                <el-form-item label="兼容模式" prop="compatibility_mode">
                   <el-checkbox v-model="jsonOutput.compatibility_mode" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="文件名" prop="name">
                  <el-input v-model="jsonOutput.name" style="width:85%"></el-input>
                  <el-button type="primary" >浏览</el-button>
                </el-form-item>
                <el-form-item label="追加方式" prop="append">
                   <el-checkbox v-model="jsonOutput.append" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="创建父目录" prop="create_parent_folder">
                   <el-checkbox v-model="jsonOutput.create_parent_folder" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="启动时不创建文件" prop="DoNotOpenNewFileInit">
                   <el-checkbox v-model="jsonOutput.DoNotOpenNewFileInit" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="扩展名" prop="extention">
                  <el-input v-model="jsonOutput.extention"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="encoding">
                  <el-select v-model="jsonOutput.encoding" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发送结果Servlet" prop="servlet_output">
                   <el-checkbox v-model="jsonOutput.servlet_output" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="添加日期到文件名?" prop="add_date">
                   <el-checkbox v-model="jsonOutput.add_date" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="添加时间到文件名?" prop="add_time">
                   <el-checkbox v-model="jsonOutput.add_time" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item >
                  <el-button type="primary" >显示文件名</el-button>
                </el-form-item >
                <el-form-item label="在结果中添加文件名" prop="addtoresult">
                   <el-checkbox v-model="jsonOutput.add_to_result_filenames" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="字段" name="fields">
              <el-table :data="jsonOutput.fields" border style="width: 100%;" height="150">
                <el-table-column  type="selection"></el-table-column>
                <el-table-column property="name" label="字段名"></el-table-column>
                <el-table-column property="element" label="元素名称"></el-table-column>
              </el-table>
              <div class="divBut">
                <el-button type="primary" >获取字段</el-button>
              </div>
            </el-tab-pane>
        </el-tabs>
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
export default {
  name: 'jsonOutput',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      jsonOutput: {
        name: '文本文件输',
        compatibility_mode: 'N',
        append: 'N',
        create_parent_folder: 'N',
        DoNotOpenNewFileInit: 'N',
        servlet_output: 'N',
        add_date: 'N',
        add_time: 'N',
        add_to_result_filenames: 'N',
        fields: [{}, {}],
        remove: [],
        meta: []
      },
      stepname: '文本文件输',
      tabsValue: 'file',
      options: []
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.tableOutput = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.tableOutput);
    },
    cancel () {
      this.$emit('cancel');
    },
    // 重置表单数据
    resetFormData () {
      this.$refs['jsonOutput'].resetFields();
    },
    getSelectedFields () {
    },
    getRemoveFields () {

    },
    getChangFields () {
      console.log('getChangFields');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 10px !important;
}
.divBut {
  text-align: center;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
.u-el-input {
  // width: 490px;
}
</style>
