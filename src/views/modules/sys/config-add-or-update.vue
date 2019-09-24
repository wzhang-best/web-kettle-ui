<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="应用名称" prop="key">
        <el-input v-model="dataForm.key" placeholder="应用名称" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="应用值" prop="value">
        <el-input v-model="dataForm.value" placeholder="应用值" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" maxlength="50"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        subbut: false,
        visible: false,
        dataForm: {
          id: 0,
          key: '',
          value: '',
          remark: ''
        },
        dataRule: {
          key: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.subbut = false
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.key = data.config.key
                this.dataForm.value = data.config.value
                this.dataForm.remark = data.config.remark
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        if (this.subbut) {
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.subbut = true
            this.$http({
              url: this.$http.adornUrl(`/sys/config/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'key': this.dataForm.key,
                'value': this.dataForm.value,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.subbut = false
              }
            })
          }
        })
      }
    }
  }
</script>
