<template>
  <div>
    <!--
    <el-form :inline="true" @keyup.enter.native="getSchemaList()">
      <el-form-item>
        <el-input v-model="name" placeholder="过滤" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getSchemaList()">查询</el-button>
      </el-form-item>
    </el-form>
    -->
    <div>
      <el-table
        :data="schemas"
        border
        height="300px"
        highlight-current-row
        @current-change="currentChange"
        @row-dblclick="rowDbclick">
        <el-table-column property="name" :label=label>
        </el-table-column>
      </el-table>
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
  name: 'schemaDialog',
  data () {
    return {
      name: '',
      schemas: [],
      label: '列表',
      currentData: {}
    };
  },
  methods: {
    getSchemaList () {},
    rowDbclick (row) {
      this.$emit('setSchema', row.name);
      this.$emit('closeDialog');
    },
    closeDialog () {
      this.$emit('closeDialog');
    },
    currentChange (currentRow, oldCurrentRow) {
      this.currentData = currentRow;
    },
    submit () {
      if (this.currentData.name) {
        this.$emit('setSchema', this.currentData.name);
        this.$emit('closeDialog');
      } else {
        this.$message({
          message: '请选择数据库模式',
          type: 'warning'
        });
      }
    }
  },
  mounted () {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
