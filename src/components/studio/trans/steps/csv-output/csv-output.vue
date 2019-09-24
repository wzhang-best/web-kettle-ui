<template>
  <div class="">
    <el-form ref="csvOutput" :model="csvOutput" label-width="170px">
      <el-form-item label="步骤名称" prop="stepname">
        <el-input v-model="stepname"></el-input>
      </el-form-item>
      <el-tabs v-model="tabsValue">
        <el-tab-pane label="文件" name="file">
            <el-form-item label="文件名称" prop="name">
              <el-input v-model="csvOutput.name" style="width:85%"></el-input>
              <el-button type="primary" style="float:right">浏览</el-button>
            </el-form-item> 
            <el-form-item label="结果输送至命令行或脚本" prop="is_command">
              <el-checkbox v-model="csvOutput.is_command" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="输出传递到Servlet" prop="servlet_output">
              <el-checkbox v-model="csvOutput.servlet_output" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="创建父目录" prop="create_parent_folder">
              <el-checkbox v-model="csvOutput.create_parent_folder" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="启动时不创建文件" prop="do_not_open_newfile_init">
              <el-checkbox v-model="csvOutput.do_not_open_newfile_init" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="文件名字段" prop="fileNameInField">
              <el-input v-model="csvOutput.fileNameInField"></el-input>
            </el-form-item>
            <el-form-item label="扩展名" prop="extention">
              <el-input v-model="csvOutput.extention"></el-input>
            </el-form-item>
            <el-form-item label="在文件里包含步骤数?" prop="haspartno">
              <el-checkbox v-model="csvOutput.haspartno" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="在文件里包含数据分区号?" prop="haspartno">
              <el-checkbox v-model="csvOutput.haspartno" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="在文件名里包含日期?" prop="add_date">
              <el-checkbox v-model="csvOutput.add_date" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="在文件名里包含时间?" prop="add_time">
                <el-checkbox v-model="csvOutput.add_time" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="指定时间格式" prop="SpecifyFormat">
              <el-checkbox v-model="csvOutput.SpecifyFormat" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="日期时间格式" prop="date_time_format">
              <el-select v-model="csvOutput.date_time_format" placeholder="请选择">
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
              <el-checkbox v-model="csvOutput.add_to_result_filenames" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="内容" name="content"> 
          <el-form-item label="追加方式" prop="append">
            <el-checkbox v-model="csvOutput.append" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="分隔符" prop="separator">
            <el-input v-model="csvOutput.separator"></el-input>
          </el-form-item>
          <el-form-item label="封闭符" prop="enclosure">
            <el-input v-model="csvOutput.password"></el-input>
          </el-form-item>
          <el-form-item label="强制在字段周围加封闭符" prop="enclosure_forced">
            <el-checkbox v-model="csvOutput.enclosure_forced" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="头部" prop="header">
            <el-checkbox v-model="csvOutput.header" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="尾部" prop="footer">
            <el-checkbox v-model="csvOutput.footer" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="格式" prop="format">
            <el-select v-model="csvOutput.format" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="压缩" prop="compression">
            <el-select v-model="csvOutput.compression" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码" prop="encoding">
            <el-select v-model="csvOutput.encoding" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段右值填充或者裁剪" prop="nullisblank">
              <el-checkbox v-model="csvOutput.nullisblank" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="快速数据存储(无格式)" prop="fast_dump">
              <el-checkbox v-model="csvOutput.fast_dump" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="分析每一行" prop="splitevery">
            <el-input v-model="csvOutput.splitevery"></el-input>
          </el-form-item>
          <el-form-item label="添加文件结束行" prop="endedLine">
            <el-input v-model="csvOutput.endedLine"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="字段" name="fields">
          <el-table :data="csvOutput.fields" border style="width: 100%;" height="150">
            <el-table-column type="selection"></el-table-column>
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="type" label="类型"></el-table-column>
            <el-table-column property="format" label="格式"></el-table-column>
            <el-table-column property="length" label="长度"></el-table-column>
            <el-table-column property="precision" label="精度"></el-table-column>
            <el-table-column property="currency" label="货币"></el-table-column>
            <el-table-column property="decimal" label="小数号"></el-table-column>
            <el-table-column property="group" label="分组"></el-table-column>
            <el-table-column property="trim_type" label="去除空格类型"></el-table-column>
            <el-table-column property="trim_type" label="Null"></el-table-column>
          </el-table>
          <div class="divBut">
            <el-button type="primary" >获取字段</el-button>
            <el-button type="primary" >最小宽度</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button type="primary" @click="handleSaveData">预览</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
/* eslint semi: ["error", "always"] */
export default {
  name: 'csvOutput',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      csvOutput: {
        name: '文本文件输',
        is_command: 'N',
        servlet_output: 'N',
        create_parent_folder: 'N',
        do_not_open_newfile_init: 'N',
        haspartno: 'N',
        add_date: 'N',
        add_time: 'N',
        SpecifyFormat: 'N',
        date_time_format: 'N',
        add_to_result_filenames: 'N',
        append: 'N',
        enclosure_forced: 'N',
        header: 'N',
        footer: 'N',
        nullisblank: 'N',
        fast_dump: 'N',
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
        console.log(data);
        this.$forceUpdate();
        this.tableOutput = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      console.log(JSON.stringify(this.tableOutput));
      this.$emit('savePluginData', this.tableOutput);
    },
    cancel () {
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    // 重置表单数据
    resetFormData () {
      this.$refs['excelInput'].resetFields();
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
.button {
  width: 110px;
  height: 40px;
  display: inline-block;
  margin-left: 20px;
  text-align: center;
  font-size: 12px;
}
.el-dialog__footer {
  margin-top: 10px;
}
</style>
