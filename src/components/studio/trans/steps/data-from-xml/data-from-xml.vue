<template>
  <div class="">
    <el-form ref="xmlInput" :model="xmlInput" label-width="150px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="xmlInput.name"></el-input>
      </el-form-item>
      <el-tabs v-model="tabsValue">
        <el-tab-pane label="文件" name="file">
          <el-form-item label="XML源定义在一个字段里?" prop="IsInFields">
            <el-input v-model="xmlInput.IsInFields"></el-input>
          </el-form-item>
          <el-form-item label="XML源是文件名?" prop="IsAFile">
            <el-input v-model="xmlInput.IsAFile"></el-input>
          </el-form-item>
          <el-form-item label="XML源字段名" prop="XmlField">
            <el-select v-model="xmlInput.encoding" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件或者目录" prop="name">
            <el-input v-model="xmlInput.name" style="width:65%"></el-input>
            <el-button type="primary" >增加</el-button>
            <el-button type="primary" >浏览</el-button>
          </el-form-item> 
          <el-form-item label="正则表达式" prop="filemask">
            <el-input v-model="xmlInput.filemask"></el-input>
          </el-form-item>
          <el-form-item label="正则表达式(排除)" prop="exclude_filemask">
            <el-input v-model="xmlInput.exclude_filemask"></el-input>
          </el-form-item>
          <el-form-item label="选中的文件列表" prop="enclosure">
            <el-row>
              <el-col style="width:75%">
                <el-table :data="xmlInput.files" border style="width: 100%;" height="150">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column property="name" label="文件/目录"></el-table-column>
                  <el-table-column property="filemask" label="通配符号"></el-table-column>
                  <el-table-column property="exclude_filemask" label="通配符号(排除)"></el-table-column>
                  <el-table-column property="file_required" label="要求"></el-table-column>
                  <el-table-column property="include_subfolders" label="包含子目录"></el-table-column>
                </el-table>
              </el-col>
              <el-col style="width:25%">
                <el-form-item>
                  <el-button type="primary" >删除</el-button>
                  <el-button type="info" >编辑</el-button>
                </el-form-item>
              </el-col>
            </el-row> 
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getRemoveFields">显示文件名</el-button>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="内容" name="content"> 
            <el-form-item label="循环读取路径" prop="loopxpath">
              <el-input v-model="xmlInput.loopxpath" style="width:65%"></el-input>
              <el-button type="primary" >获取XML文档的所有路径</el-button>
            </el-form-item>
            <el-form-item label="编码" prop="encoding">
              <el-select v-model="xmlInput.encoding" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考虑命名空间" prop="namespaceaware">
              <el-checkbox v-model="xmlInput.namespaceaware" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="忽略注释?" prop="ignorecomments">
              <el-checkbox v-model="xmlInput.ignorecomments" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="验证XML?" prop="validating">
              <el-checkbox v-model="xmlInput.validating" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="使用标记?" prop="usetoken">
              <el-checkbox v-model="xmlInput.usetoken" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="忽略空文件?" prop="IsIgnoreEmptyFile">
              <el-checkbox v-model="xmlInput.IsIgnoreEmptyFile" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="如果没有文件不要报告错误?" prop="doNotFailIfNoFile">
              <el-checkbox v-model="xmlInput.doNotFailIfNoFile" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="限制" prop="limit">
              <el-input v-model="xmlInput.limit"></el-input> 
            </el-form-item>
            <el-form-item label="用于截取数据的XML路径(大文件)" prop="prunePath">
              <el-input v-model="xmlInput.prunePath"></el-input> 
            </el-form-item>
            <el-row>
              <el-col style="width:10%">
                <el-form-item label="输出包括文件名?" prop="includeFilenameField">
                  <el-checkbox v-model="xmlInput.resultfieldName" true-label="Y" false-label= "N"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col style="width:90%">
                <el-form-item label="字段名" prop="filenameField">
                  <el-input v-model="xmlInput.filenameField">xml_filename</el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="width:10%">
                <el-form-item label="输出中包括行号?" prop="rownum">
                  <el-checkbox v-model="xmlInput.rownum" true-label="Y" false-label= "N"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col style="width:90%">
                <el-form-item label="行号字段" prop="rownum_field">
                  <el-input v-model="xmlInput.rownum_field"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="将文件添加到结果文件中" prop="addresultfile">
              <el-checkbox v-model="xmlInput.addresultfile" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="字段" name="fields">
          <el-table :data="xmlInput.fields" border style="width: 100%;" height="150">
            <el-table-column type="selection"></el-table-column>
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="xpath" label="XML路径"></el-table-column>
            <el-table-column property="element_type" label="节点"></el-table-column>
            <el-table-column property="result_type" label="结果类型"></el-table-column>
            <el-table-column property="type" label="类型"></el-table-column>
            <el-table-column property="repeat" label="重复"></el-table-column>
            <el-table-column property="format" label="格式"></el-table-column>
            <el-table-column property="length" label="长度"></el-table-column>
            <el-table-column property="precision" label="精度"></el-table-column>
            <el-table-column property="trim_type" label="去除空格类型"></el-table-column>
            <el-table-column property="currency" label="货币符号"></el-table-column>
            <el-table-column property="decimal" label="小数点符号"></el-table-column>
            <el-table-column property="group" label="组"></el-table-column>
          </el-table>
          <el-form-item>
            <el-button type="primary">获取字段</el-button>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="其他输出字段" name="other">
            <el-form-item label="文件名字段" prop="filefield">
              <el-input v-model="xmlInput.filefield"></el-input> 
            </el-form-item>
            <el-form-item label="扩展名字段" prop="extensionFieldName">
              <el-input v-model="xmlInput.extensionFieldName"></el-input> 
            </el-form-item>
            <el-form-item label="路径字段" prop="pathFieldName">
              <el-input v-model="xmlInput.pathFieldName"></el-input> 
            </el-form-item>
            <el-form-item label="文件大小字段" prop="sizeFieldName">
              <el-input v-model="xmlInput.sizeFieldName"></el-input> 
            </el-form-item>
            <el-form-item label="是否为隐藏文件字段" prop="hiddenFieldName">
              <el-input v-model="xmlInput.hiddenFieldName"></el-input> 
            </el-form-item>
            <el-form-item label="最后修改时间字段" prop="lastModificationTimeFieldName">
              <el-input v-model="xmlInput.lastModificationTimeFieldName"></el-input> 
            </el-form-item>
            <el-form-item label="Uri字段" prop="uriNameFieldName">
              <el-input v-model="xmlInput.uriNameFieldName"></el-input> 
            </el-form-item>
            <el-form-item label="Root uri" prop="rootUriNameFieldName">
              <el-input v-model="xmlInput.rootUriNameFieldName"></el-input> 
            </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
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
  name: 'xmlInput',
  props: {
    name: String
  },
  data () {
    return {
      xmlInput: {
        name: 'Get data from XML',
        namespaceaware: 'N',
        ignorecomments: 'N',
        validating: 'N',
        usetoken: 'N',
        IsIgnoreEmptyFile: 'N',
        doNotFailIfNoFile: 'N',
        resultfieldName: 'N',
        rownum: 'N',
        addresultfile: 'N',
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
    setGraph (val) {
      this.editor = val;
    },
    // 重置表单数据
    resetFormData () {
      this.$refs['xmlInput'].resetFields();
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
.u-el-input {
  // width: 490px;
}
</style>
