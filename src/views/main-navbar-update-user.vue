<template>
  <el-dialog
    title="用户信息"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="用户名" ></el-input>
        <!--<span>{{ dataForm.userName }}</span>-->
      </el-form-item>
      <!--
      <el-form-item label="所属部门" prop="deptName">
        <span>{{dataForm.deptName}}</span>
      </el-form-item>
      -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号" maxlength="15"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <!--
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      -->
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  import { treeDataTranslate } from '@/utils/index'
  export default {
    data () {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        dataForm: {
          userId: '',
          userName: '',
          password: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          deptName: '',
          deptId: '',
          createTime: '',
          createUserId: ''
        },
        dataRule: {
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        },
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList = treeDataTranslate(data, 'deptId')
          })
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          var userId = this.$store.state.user.id
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info/${userId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.userId = data.user.userId
              this.dataForm.userName = data.user.username
              this.dataForm.salt = data.user.salt
              this.dataForm.password = data.user.password
              this.dataForm.email = data.user.email
              this.dataForm.mobile = data.user.mobile
              this.dataForm.roleIdList = data.user.roleIdList
              this.dataForm.status = data.user.status
              this.dataForm.deptId = data.user.deptId
              this.dataForm.createTime = data.user.createTime
              this.dataForm.createUserId = data.user.createUserId
              this.deptListTreeSetCurrentNode()
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/user/update'),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                'deptId': this.dataForm.deptId,
                'createTime': this.dataForm.createTime,
                'createUserId': this.dataForm.createUserId
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
              }
            })
          }
        })
      }
    }
  }
</script>

