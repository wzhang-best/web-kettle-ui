<template>
  <div class="">
    <el-form ref="job" :model="job" label-width="200px">
      <el-form-item label="作业项名称" prop="name">
        <el-input v-model="job.name"></el-input>
      </el-form-item>
      <el-form-item label="作业" prop="jobname">
        <el-input v-if="true" style="width:80%" v-model="tempPath" clearable></el-input>
        <el-input v-else v-model="job.jobname" style="width:80%"></el-input>
        <el-button type="primary"  @click="priview" style="float:right">浏览</el-button>
      </el-form-item>
      <!--
      <el-tabs v-model="tabsValue" type="border-card">
        <el-tab-pane label="配置" name="file">
          <el-form-item label="运行配置" prop="run_configuration">
            <el-select v-model="job.run_configuration" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行每一个输入行?" prop="exec_per_row">
            <el-checkbox v-model="job.exec_per_row" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="将作业执行结果发送到从服务器上" prop="clear_rows">
            <el-checkbox v-model="job.clear_rows" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="Enable monitoring for sub jobs and tranformation?" prop="clear_files">
            <el-checkbox v-model="job.clear_files" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="等待远程转换执行结束?" prop="wait_until_finished">
            <el-checkbox v-model="job.wait_until_finished" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="在本地作业终止则远程作业也同时终止?" prop="follow_abort_remote">
            <el-checkbox v-model="job.follow_abort_remote" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="设置日志" name="log"> 
          <el-form-item label="指定日志文件" prop="set_logfile">
            <el-checkbox v-model="job.set_logfile" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="日志文件名" prop="filename">
            <el-input v-model="job.filename" style="width:80%" clearable @change="cleanFilenameFileList"></el-input>
            <el-upload
              ref="uploadFilename"
              class="upload-demo"
              action="/"
              :http-request="UploadFilename"
              :show-file-list="false"
              :limit="1">
              <el-button type="primary" class="button">浏览</el-button>
            </el-upload>
          </el-form-item> 
          <el-form-item label="日志后缀名" prop="logext">
            <el-input v-model="job.logext" ></el-input>
          </el-form-item>
          <el-form-item label="日志级别" prop="loglevel">
            <el-select v-model="job.loglevel" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加到日志文件尾" prop="parallel">
            <el-checkbox v-model="job.parallel" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
            <el-form-item label="创建父文件夹" prop="create_parent_folder">
            <el-checkbox v-model="job.create_parent_folder" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
            <el-form-item label="日志文件包含日期?" prop="add_date">
            <el-checkbox v-model="job.add_date" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="日志文件包含时间?" prop="add_time">
            <el-checkbox v-model="job.add_time" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="参数" name="args">
          <el-form-item label="复制上一步结果到位置参数?" prop="arg_from_previous">
            <el-checkbox v-model="job.arg_from_previous" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-table :data="job.fields" border style="width: 100%;" height="150">
            <el-table-column type="selection"></el-table-column>
            <el-table-column property="name" label="参数"></el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="命名参数" name="namargs">
          <el-form-item label="复制上一步结果到命名参数?" prop="params_from_previous">
            <el-checkbox v-model="job.params_from_previous" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-form-item label="将所有参数值都传递到子作业?" prop="">
            <el-checkbox v-model="job.value" true-label="Y" false-label= "N"></el-checkbox> 
          </el-form-item>
          <el-col :span="24">
            <el-table :data="job.fields" border style="width: 100%;" height="150">
              <el-table-column label="操作" width="50" :resizable=false>
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
              <el-table-column property="args" label="命名参数">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row['args']"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="stramname" label="流列名">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row['stramname']"></el-input>
                </template>
              </el-table-column>
              <el-table-column property="value" label="值">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row['value']"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <div class="el-table-add-row" style="width:100%" @click="addObj"><span>+ 添加</span></div>
          </el-col>
          <el-button type="primary" @click="handleSaveData" style="float:right">获取参数</el-button>
        </el-tab-pane>
      </el-tabs>
      -->
    </el-form>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>

    <!-- 资源库弹窗 -->
    <div>
      <el-dialog
        title="资源库"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :append-to-body="true">
        <u-repository ref="repository" @setFilePath=setFilePath></u-repository>
      </el-dialog>
    </div>
  </div>
</template>
<script>
/* eslint semi: ["error", "always"] */
import PartialRepository from '@/views/modules/studio/partial-repositories/partial-repositories.vue';
export default {
  name: 'job',
  props: {
    name: String
  },
  components: {
    'u-repository': PartialRepository
  },
  watch: {
    job (job) {
      if (job.directory && job.jobname) {
        this.tempPath = job.directory + '/' + job.jobname;
      }
    },
    tempPath (data) {
      if (data === '') {
        this.$set(this.job, 'directory', '');
        this.$set(this.job, 'jobname', '');
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      tempPath: null,
      graph: null,
      job: {
        name: '',
        jobname: '',
        directory: '',
        exec_per_row: 'N',
        clear_rows: 'N',
        clear_files: 'N',
        wait_until_finished: 'N',
        follow_abort_remote: 'N',
        set_logfile: 'N',
        parallel: 'N',
        create_parent_folder: 'N',
        add_date: 'N',
        add_time: 'N',
        arg_from_previous: 'N',
        params_from_previous: 'N',
        fields: [],
        remove: [],
        meta: [],
        value: true
      },
      temp: {
        name: '',
        jobname: '',
        directory: '',
        exec_per_row: 'N',
        clear_rows: 'N',
        clear_files: 'N',
        wait_until_finished: 'N',
        follow_abort_remote: 'N',
        set_logfile: 'N',
        parallel: 'N',
        create_parent_folder: 'N',
        add_date: 'N',
        add_time: 'N',
        arg_from_previous: 'N',
        params_from_previous: 'N',
        fields: [],
        remove: [],
        meta: [],
        value: true
      },
      tempJob: null,
      tabsValue: 'file',
      options: []
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.job = Object.assign({}, data);
        this.tempJob = JSON.parse(JSON.stringify(data));
      }
    },
    // 保存表单数据
    handleSaveData () {
      if (this.job.name) {
        this.$emit('savePluginData', this.job);
      } else {
        this.$message({
          message: '步骤名称必填',
          type: 'warning'
        });
      }
    },
    cancel () {
      if (this.tempJob) {
        this.saveTempPluginData(this.tempJob);
      } else {
        let tempdata = JSON.parse(JSON.stringify(this.temp));
        tempdata['name'] = this.job.name;
        this.saveTempPluginData(tempdata);
      }
      this.$emit('cancel');
    },
    setGraph (val) {
      this.graph = val;
    },
    cleanFilenameFileList (val) {
      if (!val) {
        this.$refs.uploadFilename.clearFiles();
      }
    },
    UploadFilename (param) {
      this.$set(this.job, 'filename', param.file.name);
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['job'].resetFields();
      this.job = JSON.parse(JSON.stringify(this.temp));
      this.job.name = stepname;
    },
    priview () {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['repository'].type = 'job';
        this.$refs['repository'].listRepository('/', 'job');
      });
    },
    setFilePath (data) {
      this.$set(this.job, 'jobname', data['name']);
      this.$set(this.job, 'directory', data['parent']);
      this.tempPath = data['parent'] + '/' + data['name'];
      this.dialogVisible = false;
    },
    saveTempPluginData (formData) {
      this.$emit('saveTempPluginData', formData);
    },
    removeObj (index) {
      this.job.fields.splice(index, 1);
    },
    addObj () {
      this.job.fields.push({});
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
.divBut {
  text-align: center;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
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
.el-dialog__footer {
  margin-top: 10px;
}
.el-tabs /deep/ .el-tabs__content {
    padding: 15px !important;
}
</style>
