<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptName">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="点击选择所属部门"
                  class="dept-list__input"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" maxlength="100"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="mini" label="功能授权">
            <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="menuId"
              ref="menuListTree" :check-strictly="true"
              :default-expand-all="false" @check="clickDeal"
              show-checkbox
              style="max-height: 260px; overflow:auto ">
            </el-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据授权">
            <el-tree
              :data="deptIdList"
              :props="deptIdListTreeProps"
              node-key="deptId"
              ref="deptIdListTree"
              :default-expand-all="false"
              show-checkbox
              style="max-height: 160px; overflow:auto ;min-height: 160px;">
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        subbut: false,
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          remark: '',
          deptName: '',
          deptId: ''
        },
        dataRule: {
          roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ]
        },
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        deptIdList: [], // 数据权限
        deptIdListTreeProps: {
          label: 'name',
          children: 'children'
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
        this.subbut = false
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList = treeDataTranslate(data, 'deptId')
          })
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptIdList = treeDataTranslate(data, 'deptId')
          })
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
            this.$refs.deptIdListTree.setCheckedKeys([])
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName
                this.dataForm.remark = data.role.remark
                this.dataForm.deptId = data.role.deptId
                this.deptListTreeSetCurrentNode()
                var idx = data.role.menuIdList.indexOf(this.tempKey)
                var idy = data.role.deptIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                }
                if (idy !== -1) {
                  data.role.deptIdList.splice(idy, data.role.deptIdList.length - idy)
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
                this.$refs.deptIdListTree.setCheckedKeys(data.role.deptIdList)
              }
            })
          }
        })
      },
      // 菜单树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
      },
      // 菜单树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      clickDeal (currentObj, treeStatus) {
        // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
        let selected = treeStatus.checkedKeys.indexOf(currentObj.menuId) // -1未选中
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          this.selectedParent(currentObj)
          // 统一处理子节点为相同的勾选状态
          this.uniteChildSame(currentObj, true)
        } else {
          // 未选中 处理子节点全部未选中
          if (currentObj.childs.length !== 0) {
            this.uniteChildSame(currentObj, false)
          }
        }
      },
      // 统一处理子节点为相同的勾选状态
      uniteChildSame (treeList, isSelected) {
        this.$refs.menuListTree.setChecked(treeList.menuId, isSelected)
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected)
        }
      },
      // 统一处理父节点为选中
      selectedParent (currentObj) {
        let currentNode = this.$refs.menuListTree.getNode(currentObj)
        if (currentNode.parent.key !== undefined) {
          this.$refs.menuListTree.setChecked(currentNode.parent, true)
          this.selectedParent(currentNode.parent)
        }
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
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'remark': this.dataForm.remark,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
                'deptIdList': [].concat(this.$refs.deptIdListTree.getCheckedKeys(), [this.tempKey]),
                'deptId': this.dataForm.deptId
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
