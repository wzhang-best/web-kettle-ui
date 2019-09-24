<template>
  <div class="">
    <el-form ref="jsonInput" :model="jsonInput" label-width="170px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="jsonInput.name"></el-input>
      </el-form-item>
        <el-tabs  v-model="tabsValue">
            <el-tab-pane label="文件" name="file">
                <el-form-item label="源定义在一个字段里?" prop="include">
                  <el-input v-model="jsonInput.include"></el-input>
                </el-form-item>   
                <el-form-item label="从字段获取源" prop="include_field">
                  <el-select v-model="jsonInput.include_field" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="源是一个文件名?" prop="filemask">
                  <el-input v-model="jsonInput.filemask"></el-input>
                </el-form-item>
                <el-form-item label="以Url获取源?" prop="readurl">
                  <el-input v-model="jsonInput.readurl"></el-input>
                </el-form-item>  
                <el-form-item label="Do not pass field downstream" prop="filemask">
                  <el-input v-model="jsonInput.filemask"></el-input>
                </el-form-item>    
                <el-form-item label="文件或者路径" prop="name">
                  <el-input v-model="jsonInput.name" style="width:55%"></el-input>
                  <el-button type="primary" >增加</el-button>
                  <el-button type="primary" >浏览</el-button>
                </el-form-item> 
                <el-form-item label="正则表达式" prop="filemask">
                  <el-input v-model="jsonInput.filemask"></el-input>
                </el-form-item>   
                <el-form-item label="正则表达式(排除)" prop="exclude_filemask">
                  <el-input v-model="jsonInput.exclude_filemask"></el-input>
                </el-form-item>
                <el-form-item label="选中的文件列表" prop="enclosure">
                  <el-row>
                    <el-col style="width:74%">
                      <el-table :data="jsonInput.files" border style="width: 100%;" height="150">
                        <el-table-column  type="selection"></el-table-column>
                        <el-table-column property="name" label="文件/目录"></el-table-column>
                        <el-table-column property="filemask" label="通配符号"></el-table-column>
                        <el-table-column property="exclude_filemask" label="通配符号(排除)"></el-table-column>
                        <el-table-column property="file_required" label="要求"></el-table-column>
                        <el-table-column property="include_subfolders" label="包含子目录"></el-table-column>
                      </el-table>
                    </el-col>
                    <el-col style="width:26%">
                        <el-button type="primary">删除</el-button>
                        <el-button type="info" >编辑</el-button>
                    </el-col>
                 </el-row> 
                </el-form-item>
                <el-form-item>
                  <el-button  type="primary">显示文件名</el-button>
                </el-form-item> 
            </el-tab-pane>

            <el-tab-pane label="内容" name="content"> 
                <el-form-item label="忽略空文件" prop="IsIgnoreEmptyFile">
                   <el-checkbox v-model="jsonInput.IsIgnoreEmptyFile" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="如果没有文件不进行报错" prop="doNotFailIfNoFile">
                   <el-checkbox v-model="jsonInput.doNotFailIfNoFile" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="忽略不完整的路径" prop="ignoreMissingPath">
                   <el-checkbox v-model="jsonInput.ignoreMissingPath" true-label="Y" false-label= "N"></el-checkbox> 
                </el-form-item>
                <el-form-item label="限制" prop="limit">
                   <el-input v-model="jsonInput.limit"></el-input> 
                </el-form-item>
                <el-row >
                  <el-col style="width:30%">
                    <el-form-item label="在输出中包含文件名?" prop="includeFilenameField">
                      <el-checkbox v-model="jsonInput.resultfieldName" true-label="Y" false-label= "N"></el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col style="width:70%">
                    <el-form-item label="包含文件名的字段名" prop="filenameField">
                      <el-input v-model="jsonInput.filenameField">xml_filename</el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col style="width:30%">
                    <el-form-item label="在输出中包含行数?" prop="rownum">
                      <el-checkbox v-model="jsonInput.rownum" true-label="Y" false-label= "N"></el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col style="width:70%">
                    <el-form-item label="包含行数的字段名" prop="rownum_field">
                      <el-input v-model="jsonInput.rownum_field">xml_filename</el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="字段" name="fields">
              <el-table :data="jsonInput.fields" border style="width: 100%;" height="150">
                <el-table-column  type="selection"></el-table-column>
                <el-table-column property="name" label="名称"></el-table-column>
                <el-table-column property="path" label="路径"></el-table-column>
                <el-table-column property="type" label="类型"></el-table-column>
                <el-table-column property="repeat" label="重复"></el-table-column>
                <el-table-column property="format" label="格式"></el-table-column>
                <el-table-column property="length" label="长度"></el-table-column>
                <el-table-column property="precision" label="精度"></el-table-column>
                <el-table-column property="trim_type" label="去除空格类型"></el-table-column>
                <el-table-column property="currency" label="货币"></el-table-column>
                <el-table-column property="decimal" label="十进制"></el-table-column>
                <el-table-column property="group" label="组"></el-table-column>
              </el-table>
            </el-tab-pane>

             <el-tab-pane label="其他输出字段" name="other">
                <el-form-item label="文件名字段" prop="shortFileFieldName">
                    <el-input v-model="jsonInput.shortFileFieldName"></el-input> 
                </el-form-item>
                <el-form-item label="扩展名字段" prop="extensionFieldName">
                    <el-input v-model="jsonInput.extensionFieldName"></el-input> 
                </el-form-item>
                <el-form-item label="路径字段" prop="pathFieldName">
                    <el-input v-model="jsonInput.pathFieldName"></el-input> 
                </el-form-item>
                <el-form-item label="文件大小字段" prop="sizeFieldName">
                    <el-input v-model="jsonInput.sizeFieldName"></el-input> 
                </el-form-item>
                <el-form-item label="是否为隐藏文件字段" prop="hiddenFieldName">
                    <el-input v-model="jsonInput.hiddenFieldName"></el-input> 
                </el-form-item>
                <el-form-item label="最后修改时间字段" prop="lastModificationTimeFieldName">
                    <el-input v-model="jsonInput.lastModificationTimeFieldName"></el-input> 
                </el-form-item>
                <el-form-item label="Uri 字段" prop="uriNameFieldName">
                    <el-input v-model="jsonInput.uriNameFieldName"></el-input> 
                </el-form-item>
                <el-form-item label="Root uri 字段" prop="rootUriNameFieldName">
                    <el-input v-model="jsonInput.rootUriNameFieldName"></el-input> 
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
    <div class="el-dialog__footer">
      <span  class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button type="primary" @click="handleSaveData">预览</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>
  </div>
</template>
<script>
/* eslint semi: ["error", "always"] */
export default {
  name: 'jsonInput',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      jsonInput: {
        name: 'JSON文件输入',
        IsIgnoreEmptyFile: 'N',
        doNotFailIfNoFile: 'N',
        ignoreMissingPath: 'N',
        resultfieldName: 'N',
        rownum: 'N',
        rownum_field: 'N',
        fields: [{}, {}],
        remove: [],
        meta: []
      },
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
    // 重置表单数据
    resetFormData () {
      this.$refs['jsonInput'].resetFields();
    },
    getSelectedFields () {
    },
    getRemoveFields () {

    },
    setGraph (val) {
      this.graph = val;
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
.u-el-input {
  // width: 490px;
}
</style>
