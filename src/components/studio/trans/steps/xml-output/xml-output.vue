<template>
  <div class="">
    <el-form ref="XmlOutput" :model="xmlOutput" label-width="170px">
      <el-form-item label="步骤名称" prop="stepname">
        <el-input v-model="stepname"></el-input>
      </el-form-item>
        <el-tabs  v-model="tabsValue">
            <el-tab-pane label="文件" name="file">
                <el-form-item label="文件名称" prop="name">
                  <el-input v-model="xmlOutput.name" style="width:85%"></el-input>
                  <el-button type="primary" >浏览</el-button>
                </el-form-item> 
                <el-form-item label="启动时不创建文件" prop="do_not_open_newfile_init">
                   <el-checkbox v-model="xmlOutput.do_not_open_newfile_init" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="输出传递到Servlet" prop="servlet_output">
                   <el-checkbox v-model="xmlOutput.servlet_output" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                 <el-form-item label="扩展" prop="extention">
                  <el-input v-model="xmlOutput.extention"></el-input>
                </el-form-item>
                <el-form-item label="在文件里包含步号码?" prop="haspartno">
                   <el-checkbox v-model="xmlOutput.haspartno" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="在文件名里包含日期?" prop="add_date">
                   <el-checkbox v-model="xmlOutput.add_date" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="在文件名里包含时间?" prop="add_time">
                   <el-checkbox v-model="xmlOutput.add_time" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="指定时间格式" prop="SpecifyFormat">
                   <el-checkbox v-model="xmlOutput.SpecifyFormat" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>   
                <el-form-item label="日期时间格式" prop="date_time_format">
                  <el-select v-model="xmlOutput.date_time_format" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary" >显示文件名</el-button>
                </el-form-item >
                <el-form-item label="在结果中添加文件名" prop="add_to_result_filenames">
                   <el-checkbox v-model="xmlOutput.add_to_result_filenames" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="内容" name="content"> 
                <el-form-item label="已压缩(Zipped)" prop="zipped">
                   <el-checkbox v-model="xmlOutput.zipped" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="编码" prop="encoding">
                  <el-select v-model="xmlOutput.encoding" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="命名空间" prop="name_space">
                  <el-input v-model="xmlOutput.name_space"></el-input>
                </el-form-item>
                <el-form-item label="父XML元素" prop="xml_main_element">
                  <el-select v-model="xmlOutput.encoding" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="记录XML元素" prop="xml_main_element">
                  <el-select v-model="xmlOutput.xml_main_element" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分割每一个记录" prop="splitevery">
                  <el-input v-model="xmlOutput.splitevery"></el-input>
                </el-form-item>
                <el-form-item label="忽略输入到XML文件中的null值" prop="omit_null_values">
                   <el-checkbox v-model="xmlOutput.omit_null_values" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="字段" name="fields">
              <el-table :data="xmlOutput.fields" border style="width: 100%;" height="150">
                <el-table-column  type="selection"></el-table-column>
                <el-table-column property="name" label="文件名称"></el-table-column>
                <el-table-column property="element" label="元素名称"></el-table-column>
                <el-table-column property="type" label="类型"></el-table-column>
                <el-table-column property="format" label="内容类型"></el-table-column>
                <el-table-column property="format" label="格式"></el-table-column>
                <el-table-column property="length" label="长度"></el-table-column>
                <el-table-column property="precision" label="精度"></el-table-column>
                <el-table-column property="currency" label="货币"></el-table-column>
                <el-table-column property="decimal" label="十进制"></el-table-column>
                <el-table-column property="group" label="分组"></el-table-column>
                <el-table-column property="nullif" label="空"></el-table-column>
              </el-table>
              <div class="divBut">
                <el-button type="primary" >获取字段</el-button>
                <el-button type="primary" >最小宽度</el-button>
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
  name: 'xmlOutput',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      xmlOutput: {
        name: '文本文件输',
        do_not_open_newfile_init: 'N',
        servlet_output: 'N',
        haspartno: 'N',
        add_date: 'N',
        add_time: 'N',
        SpecifyFormat: 'N',
        add_to_result_filenames: 'N',
        zipped: 'N',
        omit_null_values: 'N',
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
      this.$refs['XmlOutput'].resetFields();
    },
    setGraph (val) {
      this.graph = val;
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
