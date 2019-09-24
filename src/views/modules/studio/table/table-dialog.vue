<template>
  <div>
    <div>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
    </div>
    <div class="divTree">
      <el-tree 
      ref="tree"
      :data="data" 
      class="filter-tree"
      :props="defaultProps"
      highlight-current
      :default-expanded-keys="expanded"
      :filter-node-method="filterNode"
      node-key="name"
      @current-change="currentChange"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span @dblclick="handleNode(data)">
          <i :class="getClass(data)"></i>{{ node.label }}
        </span>
      </span>
      </el-tree>
    </div>
    <div class="el-dialog__footer">
      <span class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
// @ is an alias to /src
// import API from '@/api';
export default {
  name: 'tableDialog',
  data () {
    return {
      filterText: '',
      currentData: {},
      data: [],
      expanded: [],
      defaultProps: {
        children: 'children', // 指定子树为节点对象的某个属性值
        label: 'name', // 指定节点标签为节点对象的某个属性值
        isLeaf: 'leaf'
      }
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    handleNode (currentData) {
      if (currentData.type === 'table') {
        this.$emit('setTable', currentData);
        this.$emit('closeDialog');
      }
    },
    currentChange (currentData, node) {
      this.currentData = currentData;
    },
    submit () {
      if (this.currentData && this.currentData.type === 'table') {
        this.$emit('setTable', this.currentData);
        this.$emit('closeDialog');
      } else {
        this.$message({
          message: '请选择数据库表',
          type: 'warning'
        });
      }
    },
    closeDialog () {
      this.$emit('closeDialog');
    },
    getClass (data) {
      if (data) {
        return data.type;
      }
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
    // 使用renderContent方式添加自定义图标和显示形态
    // renderContent (h, { node, data, store }) {
    //   if (data.type === 'table') {
    //     return (
    //       <span class="custom-tree-node">
    //         <i class="el-icon-star-on"></i>
    //         <span style="margin-left:5px;">{node.label}</span>
    //       </span>
    //     );
    //   } else if (data.type === 'schema') {
    //     return (
    //       <span class="custom-tree-node">
    //         <i class="el-icon-star-off"></i>
    //         <span style="margin-left:5px;">{node.label}</span>
    //       </span>
    //     );
    //   } else if (data.type === 'folder') {
    //     return (
    //       <span class="custom-tree-node">
    //         <i class="el-icon-tickets"></i>
    //         <span style="margin-left:5px;">{node.label}</span>
    //       </span>
    //     );
    //   } else {
    //     return (
    //       <span class="custom-tree-node">
    //         <i class=""></i>
    //         <span style="margin-left:5px;">{node.label}</span>
    //       </span>
    //     );
    //   }
    // }
  },
  mounted () {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table{
    background: url(/static/studio/images/table.png) no-repeat 0px;
    padding: 0 5px;
}
.table:before{
    content: "\e611";
    font-size: 16px;
    visibility: hidden;
}
.schema{
    background: url(/static/studio/images/schema.png) no-repeat 0px;
    padding: 0 5px;
}
.schema:before{
    content: "\e611";
    font-size: 16px;
    visibility: hidden;
}
.folder{
    background: url(/static/studio/images/folder.png) no-repeat 0px;
    padding: 0 5px;
}
.folder:before{
    content: "\e611";
    font-size: 16px;
    visibility: hidden;
}
.database{
    background: url(/static/studio/images/database.png) no-repeat 0px;
    padding: 0 5px;
}
.database:before{
    content: "\e611";
    font-size: 16px;
    visibility: hidden;
}
.divTree {
  margin-top:10px;
  height: 220px;
  overflow-y: scroll;
}
.el-dialog__footer {
    margin-top: 10px;
}
</style>
