<template>
  <div class="">
    <el-form ref="xmlInput" :model="XMLInputStream" label-width="220px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="XMLInputStream.name"></el-input>
      </el-form-item>
      <el-form-item label="文件名" prop="filename">
        <el-input v-model="XMLInputStream.filename"></el-input>
      </el-form-item>
      <el-form-item label="Source is from a previous step" prop="sourceFromInput">
         <el-checkbox v-model="XMLInputStream.sourceFromInput" true-label="Y" false-label= "N"></el-checkbox>
      </el-form-item>
      <el-form-item label="Source field name" prop="sourceFieldName">
        <el-select v-model="XMLInputStream.sourceFieldName" placeholder="请选择">
          <el-option
            v-for="item in resultTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="将文件名添加到结果中?" prop="addResultFile">
         <el-input v-model="XMLInputStream.addResultFile"></el-input>
      </el-form-item>
      <el-form-item label="忽略(Elements/Attributes)" prop="nrRowsToSkip">
        <el-input v-model="XMLInputStream.nrRowsToSkip"></el-input>
      </el-form-item>
      <el-form-item label="限制(Elements/Attributes)" prop="rowLimit">
        <el-input v-model="XMLInputStream.rowLimit"></el-input>
      </el-form-item>
      <el-form-item label="默认字符串长度" prop="defaultStringLen">
        <el-input v-model="XMLInputStream.defaultStringLen"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="encoding">
        <el-input v-model="XMLInputStream.encoding"></el-input>
      </el-form-item>
      <el-form-item label="添加命名空间信息" prop="enableNamespaces">
        <el-input v-model="XMLInputStream.enableNamespaces"></el-input>
      </el-form-item>
      <el-form-item label="裁剪字符串?" prop="enableTrim">
         <el-input v-model="XMLInputStream.enableTrim"></el-input>
      </el-form-item>
      <el-row>
          <el-col style="width:10%">
             <el-form-item label="输出文件名?" prop="includeFilenameField">
              <el-checkbox v-model="XMLInputStream.resultfieldName" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
            <el-form-item label="字段名" prop="filenameField">
              <el-input v-model="XMLInputStream.filenameField">xml_filename</el-input>
            </el-form-item>
          </el-col>
      </el-row>
     
     <el-row>
          <el-col style="width:10%">
             <el-form-item label="输出记录数?" prop="includeRowNumberField">
              <el-checkbox v-model="XMLInputStream.includeRowNumberField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
             <el-form-item label="字段名" prop="rowNumberField">
                <el-input v-model="XMLInputStream.rowNumberField"></el-input>
             </el-form-item>
          </el-col>
      </el-row>
      

      <el-row>
          <el-col style="width:10%">  
            <el-form-item label="输出XML数据类型(整形表示)?" prop="includeDataTypeNumericField">
              <el-checkbox v-model="XMLInputStream.includeDataTypeNumericField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
             <el-form-item label="字段名" prop="dataTypeNumericField">
              <el-input v-model="XMLInputStream.dataTypeNumericField"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
      
      <el-row>
          <el-col style="width:10%">  
            <el-form-item label="输出XML数据类型(描述)?" prop="includeDataTypeDescriptionField">
              <el-checkbox v-model="XMLInputStream.includeDataTypeDescriptionField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
              <el-form-item label="字段名" prop="dataTypeDescriptionField">
                <el-input v-model="XMLInputStream.dataTypeDescriptionField"></el-input>
              </el-form-item>
          </el-col>
      </el-row>
      
       <el-row>
          <el-col style="width:10%">  
            <el-form-item label="XML location line in output?" prop="includeXmlLocationLineField">
              <el-checkbox v-model="XMLInputStream.includeXmlLocationLineField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
               <el-form-item label="字段名" prop="xmlLocationLineField">
                <el-input v-model="XMLInputStream.xmlLocationLineField"></el-input>
              </el-form-item>
          </el-col>
      </el-row>
      
      <el-row>
          <el-col style="width:10%">  
            <el-form-item label="XML location column in output?" prop="includeXmlLocationColumnField">
                <el-checkbox v-model="XMLInputStream.includeXmlLocationColumnField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
             <el-form-item label="字段名" prop="xmlLocationColumnField">
                <el-input v-model="XMLInputStream.xmlLocationColumnField"></el-input>
              </el-form-item>
          </el-col>
      </el-row>
      
      
      <el-row>
          <el-col style="width:10%">  
             <el-form-item label="输出XML element ID?" prop="includeXmlElementIDField">
              <el-checkbox v-model="XMLInputStream.includeXmlElementIDField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
             <el-form-item label="字段名" prop="xmlElementIDField">
              <el-input v-model="XMLInputStream.xmlElementIDField"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
      
       <el-row>
          <el-col style="width:10%">  
             <el-form-item label="输出XML 父 element ID?" prop="includeXmlParentElementIDField">
              <el-checkbox v-model="XMLInputStream.includeXmlParentElementIDField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
            <el-form-item label="字段名" prop="xmlParentElementIDField">
              <el-input v-model="XMLInputStream.xmlParentElementIDField"></el-input>
            </el-form-item>
          </el-col>
      </el-row>

       <el-row>
          <el-col style="width:10%">  
               <el-form-item label="输出XML element 层次?" prop="includeXmlElementLevelField">
                <el-checkbox v-model="XMLInputStream.xmlElementLevelField" true-label="Y" false-label= "N"></el-checkbox>
              </el-form-item>
          </el-col>
          <el-col style="width:90%">
           <el-form-item label="字段名" prop="name">
              <el-input v-model="XMLInputStream.name"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
       
        <el-row>
          <el-col style="width:10%">  
              <el-form-item label="输出XML路径?" prop="includeXmlPathField">
                <el-checkbox v-model="XMLInputStream.includeXmlPathField" true-label="Y" false-label= "N"></el-checkbox>
              </el-form-item>
          </el-col>
          <el-col style="width:90%">
           <el-form-item label="字段名" prop="xmlPathField">
              <el-input v-model="XMLInputStream.xmlPathField"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
       
    
        <el-row>
          <el-col style="width:10%">  
             <el-form-item label="输出XML父路径?" prop="includeXmlParentPathField">
              <el-checkbox v-model="XMLInputStream.includeXmlParentPathField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
           <el-form-item label="字段名" prop="xmlParentPathField">
              <el-input v-model="XMLInputStream.xmlParentPathField"></el-input>
            </el-form-item>
          </el-col>
      </el-row>

      
        <el-row>
          <el-col style="width:10%">  
             <el-form-item label="输出XML数据名称?" prop="includeXmlDataNameField">
              <el-checkbox v-model="XMLInputStream.includeXmlDataNameField" true-label="Y" false-label= "N"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col style="width:90%">
            <el-form-item label="字段名" prop="xmlDataNameField">
              <el-input v-model="XMLInputStream.xmlDataNameField"></el-input>
            </el-form-item>
          </el-col>
      </el-row>

      
       <el-row>
          <el-col style="width:10%">  
              <el-form-item label="输出XML数据值?" prop="includeXmlDataValueField">
                <el-checkbox v-model="XMLInputStream.includeXmlDataValueField" true-label="Y" false-label= "N"></el-checkbox>
              </el-form-item>
          </el-col>
          <el-col style="width:90%">
             <el-form-item label="字段名" prop="xmlDataValueField">
              <el-input v-model="XMLInputStream.xmlDataValueField"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
      <el-form-item>
      </el-form-item>
    </el-form>
    <div class="el-dialog__footer">
      <span  class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button type="primary">预览</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
export default {
  name: 'XMLInputStream',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      XMLInputStream: {
        name: 'XML输入',
        sourceFromInput: 'N',
        resultfieldName: 'N',
        includeRowNumberField: 'N',
        includeDataTypeNumericField: 'N',
        includeDataTypeDescriptionField: 'N',
        includeXmlLocationLineField: 'N',
        includeXmlLocationColumnField: 'N',
        includeXmlElementIDField: 'N',
        includeXmlParentElementIDField: 'N',
        xmlElementLevelField: 'N',
        includeXmlPathField: 'N',
        includeXmlParentPathField: 'N',
        includeXmlDataNameField: 'N',
        includeXmlDataValueField: 'N',
        XMLInputStreamtype: 'CRC32',
        resultType: 'Hexadecimal',
        compatibilityMode: true,
        fields: [{
          field: 'A'
        }]
      },
      XMLInputStreamtypeptions: [{
        value: 'CRC32',
        label: 'CRC32'
      }, {
        value: 'MD5',
        label: 'MD5'
      }],
      resultTypeOptions: [{
        value: 'Hexadecimal',
        label: 'Hexadecimal'
      }, {
        value: 'String',
        label: 'String'
      }]
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
      this.$refs['xmlInput'].resetFields();
    },
    getField () {
      console.log('getField');
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
