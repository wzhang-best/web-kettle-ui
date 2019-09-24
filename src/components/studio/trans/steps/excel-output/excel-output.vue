<template>
  <div class="">
    <el-form ref="excelOutput" :model="excelOutput" label-width="170px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="excelOutput.name"></el-input>
      </el-form-item>
      <el-tabs type="border-card" v-model="tabsValue">
        <el-tab-pane label="文件" name="file">
          <el-form-item label="文件名" prop="filename">
            <el-input v-model="excelOutput.filename" style="width:80%" clearable @change="cleanFileList"></el-input>
            <el-upload
              ref="upload"
              class="upload-demo"
              action="/"
              :http-request="Upload"
              :show-file-list="false"
              accept=".csv"
              :limit="1">
              <el-button type="primary" >浏览</el-button>
            </el-upload>
          </el-form-item> 
          <el-form-item label="创建父目录" prop="create_parent_folder">
            <el-checkbox v-model="excelOutput.create_parent_folder" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="启动时不创建文件" prop="do_not_open_newfile_init">
            <el-checkbox v-model="excelOutput.do_not_open_newfile_init" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="扩展名" prop="extention">
            <el-input v-model="excelOutput.extention"></el-input>
          </el-form-item>
          <el-form-item label="在文件里包含步骤数?" prop="IsIgnoreEmptyFile">
            <el-checkbox v-model="excelOutput.IsIgnoreEmptyFile" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="在文件名里包含日期?" prop="add_date">
            <el-checkbox v-model="excelOutput.add_date" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="在文件名里包含时间?" prop="add_time">
            <el-checkbox v-model="excelOutput.add_time" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="指定时间格式" prop="SpecifyFormat">
            <el-checkbox v-model="excelOutput.SpecifyFormat" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="时间格式" prop="date_time_format">
            <el-select v-model="excelOutput.date_time_format" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="在结果中添加文件名" prop="add_to_result_filenames">
            <el-checkbox v-model="excelOutput.add_to_result_filenames" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="内容" name="content"> 
          <el-form-item label="追加" prop="append">
            <el-checkbox v-model="excelOutput.append" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="头部" prop="header">
            <el-checkbox v-model="excelOutput.header" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="尾部" prop="footer">
            <el-checkbox v-model="excelOutput.footer" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="编码" prop="encoding">
            <el-select v-model="excelOutput.encoding" placeholder="请选择" @focus="getEncodings" style="width:100%">
              <el-option
                v-for="item in encodingoptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拆分...每一行" prop="splitevery">
            <el-input v-model="excelOutput.splitevery" ></el-input>
          </el-form-item>
          <el-form-item label="工作表名称" prop="sheetname">
            <el-input v-model="excelOutput.sheetname"></el-input>
          </el-form-item>
          <el-form-item label="保护工作表" prop="protect_sheet">
            <el-checkbox v-model="excelOutput.protect_sheet" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="密码" prop="password">
          <el-input v-model="excelOutput.password"></el-input>
          </el-form-item>
          <el-form-item label="自动调整列大小" prop="autosizecolums">
            <el-checkbox v-model="excelOutput.autosizecolums" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="保留NULL值" prop="nullisblank">
            <el-checkbox v-model="excelOutput.nullisblank" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <!--
          <el-form-item label="使用临时文件" prop="usetempfiles">
            <el-checkbox v-model="excelOutput.usetempfiles" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="临时文件目录" prop="tempdirectory">
            <el-input v-model="excelOutput.tempdirectory" style="width:80%" clearable @change="cleantempdirectoryFileList"></el-input>
            <el-upload
              ref="uploadTempdirectory"
              class="upload-demo"
              action="/"
              :http-request="UploadTempdirectory"
              :show-file-list="false"
              :limit="1">
              <el-button type="primary" class="button">浏览</el-button>
            </el-upload>
          </el-form-item>
          -->
          <!--
          <el-form-item label="使用模板" prop="enabled">
            <el-checkbox v-model="excelOutput.enabled" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="Execl 模板" prop="name">
            <el-input v-model="excelOutput.tempfilename" style="width:80%" clearable @change="cleantempfilenameFileList"></el-input>
            <el-upload
              ref="uploadtempfilename"
              class="upload-demo"
              action="/"
              :http-request="Uploadtempfilenameirectory"
              :show-file-list="false"
              :limit="1">
              <el-button type="primary" class="button">浏览</el-button>
            </el-upload> 
          </el-form-item> 
          <el-form-item label="追加Execl模板" prop="append">
            <el-checkbox v-model="excelOutput.append"></el-checkbox> 
          </el-form-item>
          -->
        </el-tab-pane>

        <el-tab-pane label="格式" name="other">
            <el-form-item label="表头字体" prop="header_font_name">
              <el-select v-model="excelOutput.header_font_name" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表头字体大小" prop="header_font_size">
              <el-input v-model="excelOutput.header_font_size"></el-input>
            </el-form-item>
            <el-form-item label="表头字体加粗?" prop="header_font_bold">
              <el-checkbox v-model="excelOutput.header_font_bold" true-label="Y" false-label= "N"></el-checkbox> 
            </el-form-item>
            <el-form-item label="表头字体倾斜?" prop="header_font_italic">
              <el-checkbox v-model="excelOutput.header_font_italic" true-label="Y" false-label= "N"> </el-checkbox> 
            </el-form-item>
            <el-form-item label="表头字体下划线" prop="header_font_underline">
              <el-select v-model="excelOutput.header_font_underline" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表头字体方向" prop="header_font_orientation">
              <el-select v-model="excelOutput.header_font_orientation" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表头字体颜色" prop="header_font_orientation">
              <el-select v-model="excelOutput.header_font_orientation" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表头背景颜色" prop="header_background_color">
              <el-select v-model="excelOutput.header_background_color" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表头高度" prop="header_row_height">
              <el-input v-model="excelOutput.header_row_height"></el-input>
            </el-form-item>
            <el-form-item label="表头对齐方式" prop="header_alignment">
              <el-select v-model="excelOutput.header_alignment" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!--
            <el-form-item label="添加图片" prop="header_image">
              <el-input v-model="excelOutput.header_image" style="width:80%" clearable @change="cleanFileImageList"></el-input>
              <el-upload
                ref="imageupload"
                class="upload-demo"
                action="/"
                :http-request="UploadImage"
                :show-file-list="false"
                accept=".*"
                :limit="1">
                <el-button type="primary" class="button">浏览</el-button>
                </el-upload>
            </el-form-item>
            -->
            <el-form-item label="数据字体" prop="row_font_name">
              <el-select v-model="excelOutput.row_font_name" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据字体大小" prop="row_font_size">
              <el-input v-model="excelOutput.row_font_size"></el-input>
            </el-form-item>
            <el-form-item label="数据字体颜色" prop="row_font_color">
              <el-select v-model="excelOutput.row_font_color" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据背景颜色" prop="row_background_color">
              <el-select v-model="excelOutput.row_background_color" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="字段" name="fields">
          <el-table :data="excelOutput.fields" border  style="width: 100%;" height="150">
            <el-table-column label="操作" fixed width="80">
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
            <el-table-column property="name" label="名称">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row['name']"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="type" label="类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row['type']" style="width: 100%;" @focus="getTypeOptions()">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column property="format" label="格式">
              <template slot-scope="scope">
                <el-select v-model="scope.row['format']" style="width: 100%;" @focus="getvalueFormats(scope.row.type)">
                  <el-option
                    v-for="item in formatOptions"
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
          <div class="divBut">
            <el-button type="primary" >获取字段</el-button>
            <!-- <el-button type="primary" >最小宽度</el-button> -->
          </div>
        </el-tab-pane>

      </el-tabs>
      <div class="el-dialog__footer">
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSaveData">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </span>
      </div>
    </el-form>
  </div>
</template>
<script>
/* eslint semi: ["error", "always"] */
import API from '@/api';
export default {
  name: 'excelOutput',
  props: {
    name: String
  },
  data () {
    return {
      graph: null,
      excelOutput: {
        name: '',
        filename: '',
        create_parent_folder: 'N',
        do_not_open_newfile_init: 'N',
        IsIgnoreEmptyFile: 'N',
        add_date: 'N',
        add_time: 'N',
        SpecifyFormat: 'N',
        add_to_result_filenames: 'N',
        append: 'N',
        header: 'N',
        footer: 'N',
        protect_sheet: 'N',
        autosizecolums: 'N',
        nullisblank: 'N',
        usetempfiles: 'N',
        enabled: 'N',
        header_font_bold: 'N',
        header_font_italic: 'N',
        fields: [],
        remove: [],
        meta: []
      },
      temp: {
        name: '',
        filename: '',
        create_parent_folder: 'N',
        do_not_open_newfile_init: 'N',
        IsIgnoreEmptyFile: 'N',
        add_date: 'N',
        add_time: 'N',
        SpecifyFormat: 'N',
        add_to_result_filenames: 'N',
        append: 'N',
        header: 'N',
        footer: 'N',
        protect_sheet: 'N',
        autosizecolums: 'N',
        nullisblank: 'N',
        usetempfiles: 'N',
        enabled: 'N',
        header_font_bold: 'N',
        header_font_italic: 'N',
        fields: [],
        remove: [],
        meta: []
      },
      stepname: 'Excel输出',
      tabsValue: 'file',
      options: [],
      encodingoptions: [],
      typeOptions: [],
      formatOptions: []
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.excelOutput = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.excelOutput);
      this.excelOutput = Object.assign({}, this.temp);
    },
    cancel () {
      this.$emit('cancel');
      this.excelOutput = Object.assign({}, this.temp);
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['excelOutput'].resetFields();
      this.excelOutput.name = stepname;
    },
    cleanFileList (val) {
      if (!val) {
        this.$refs.upload.clearFiles();
      }
    },
    cleanFileImageList (val) {
      if (!val) {
        this.$refs.imageupload.clearFiles();
      }
    },
    cleantempdirectoryFileList (val) {
      if (!val) {
        this.$refs.uploadTempdirectory.clearFiles();
      }
    },
    cleantempfilenameFileList (val) {
      if (!val) {
        this.$refs.uploadtempfilename.clearFiles();
      }
    },
    Upload (param) {
      this.$set(this.excelOutput, 'filename', param.file.name);
    },
    UploadImage (param) {
      this.$set(this.excelOutput, 'header_image', param.file.name);
    },
    UploadTempdirectory (param) {
      this.$set(this.excelOutput, 'tempdirectory', param.file.name);
    },
    Uploadtempfilenameirectory (param) {
      this.$set(this.excelOutput, 'tempfilename', param.file.name);
    },
    getEncodings () {
      API.studio.encodings().then(res => {
        this.$set(this, 'encodingoptions', res.data);
      });
    },
    removeObj (index) {
      this.excelOutput.fields.splice(index, 1);
    },
    addObj () {
      this.excelOutput.fields.push({});
    },
    getTypeOptions () {
      if (this.typeOptions) {
        API.studio.valueMetas().then(res => {
          this.typeOptions = res.data;
        });
      }
    },
    getvalueFormats (param) {
      if (param) {
        API.studio.valueFormats({'valueMetaName': param}).then(res => {
          this.formatOptions = res.data;
        });
      } else {
        this.formatOptions = [];
      }
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
.divBut {
  text-align: center;
  margin-top: 40px !important;
  margin-bottom: 20px !important;
}
.el-tabs /deep/ .el-tabs__content {
    padding: 15px !important;
}
.button {
  width: 110px;
  display: inline-block;
  text-align: center;
}
.upload-demo {
  display: inline-block;
  float: right;
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
.el-dialog__footer {
  margin-top: 15px;
}
</style>
