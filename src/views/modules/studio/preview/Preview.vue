<template>
    <div>
      <el-table
        :data="preview.data"
        stripe
        border
        tooltip-effect="dark"
        style="100%">
        <el-table-column v-if="(!preview.index)"
          fixed
          type="index"
          width="50"
          header-align="center"
          align="center">
        </el-table-column>
        <template v-for="(column, index) in preview.columns">
          <el-table-column v-if="column.type==='normal'"
            :prop="column.prop"
            :label="column.label"
            :key="index">
          </el-table-column>
        </template>
      </el-table>
    </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
export default {
  name: 'preview',
  data () {
    return {
      preview: {
        index: true,
        columns: [
          { type: 'normal', prop: 'id', label: 'ID' },
          { type: 'normal', prop: 'name', label: 'A' },
          { type: 'normal', prop: 'type', label: 'B' },
          { type: 'normal', prop: 'path', label: 'C' }
        ],
        data: []
      }
    };
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
