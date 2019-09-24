<template>
  <div class="transfer">
    <div style="margin: 0 auto;">
      <div class="el-transfer">
        <div class="el-transfer-panel">
          <p class="el-transfer-panel__header">
            <label role="checkbox" class="el-checkbox">
              <span class="el-checkbox__label">表字段</span>
            </label>
          </p>
          <div class="el-transfer-panel__body">
            <el-radio
              v-model="tableField"
              class="radio"
              v-for="(i, index) in tableFields"
              :key="index"
              :label="i"
              :disabled="i.disabled"
              @change="tableChange"
              >
              {{ i.name }}
            </el-radio>
          </div>
        </div>
        <div class="el-transfer-panel marginLfet">
          <p class="el-transfer-panel__header">
            <label role="checkbox" class="el-checkbox">
              <span class="el-checkbox__label">流字段</span>
            </label>
          </p>
          <div class="el-transfer-panel__body">
            <el-radio
              class="radio"
              v-model="streamField"
              v-for="(i, index) in streamFields"
              :key="index"
              :label="i"
              :disabled="i.disabled"
              @change="streamChange"
              >
              {{ i.name }}
            </el-radio>
          </div>
        </div>
        <div class="el-transfer__buttons">
          <el-button :style="{ background: backgroundRight, color: colorRight }" class="button" :disabled="disabledRight" ref="buttonRight" @click="right">
            <span><i class="el-icon-arrow-right"></i></span>
          </el-button>
          <el-button :style="{ background: backgroundLeft, color: colorLeft, }" class="button" :disabled="disabledLeft" ref="buttonLeft" @click="left">
            <span><i class="el-icon-arrow-left"></i></span>
          </el-button>
        </div>
        <div class="el-transfer-panel">
          <p class="el-transfer-panel__header">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >
              字段对应表
              <span>{{ valueMapperSelectedValues.length }}/{{ valueMapperValues.length }}</span>
            </el-checkbox>
          </p>
          <div class="el-transfer-panel__body">
            <el-checkbox-group
              v-model="valueMapperSelectedValues"
              @change="handlevalueMapperSelectedValuesChange"
              >
              <el-checkbox
                v-model="correspond"
                v-for="(i, index) in valueMapperValues"
                :key="index"
                :label="i"
                class="radio">
                <template>
                  {{ i.tableField.name }} --> {{ i.streamField.name }}
                </template>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right; margin-top: 15px;">
        <el-checkbox v-model="autoSelectTarget" v-show="tshow">自动选择目标</el-checkbox>
        <el-checkbox v-model="autoSelectSource" v-show="tshow">自动选择源</el-checkbox>
        <el-checkbox v-model="hiddenSourceField" v-show="tshow">隐藏已经匹配的源字段</el-checkbox>
        <el-checkbox v-model="hiddenTarget" v-show="tshow">隐藏已经匹配的目标字段</el-checkbox>
        <el-button type="primary" :disabled="isDisabled" @click="setFields">确 定</el-button>
        <el-button @click="hiddenDialog">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ConformStanTaskComparisonDialogView {
    .el-dialog__body {
        max-height: 50vh;
    }
}
.transfer {
  .button {
  cursor: pointer;
  outline: none;
  border: 1px solid #dcdfe6; 
  margin: 0 auto;
  padding: 10px;
  border-radius: 50%;
  }
  .group_checkbox, .el-transfer-panel__body .radio {
  margin: 15px 0 0 15px; 
  display: block;
  text-align: left;
  }
  .el-transfer-panel__body {
  overflow-y: scroll
  }
  .marginLfet {
  margin-left: 20px;
  }
  .el-transfer__buttons {
  .radio{
  margin-left: 8px;
  }
  }
  .button, .elButton, .el-transfer__buttons .radio {
  display: block; 
  margin-bottom: 10px;
  }
}
</style>
<script>
/* eslint semi: ["error", "always"] */
export default {
  name: 'ConformStanView',
  data () {
    return {
      checkAll: false,
      tshow: false,
      autoSelectTarget: true,
      autoSelectSource: false,
      hiddenSourceField: true,
      hiddenTarget: true,
      valueMapperSelectedValues: [],
      valueMapperValues: [],
      backgroundRight: '#f5f7fa', // >默认背景颜色
      colorRight: '#c0c4cc', // >默认字体颜色
      backgroundLeft: '#f5f7fa', // <默认背景颜色
      colorLeft: '#c0c4cc', // <默认字体颜色
      disabledRight: true, // >默认禁止点击
      disabledLeft: true, // <默认禁止点击
      correspond: '', // 对应字段 多选选中值
      tableField: '', // 将待合标字段单选选中的值传给tableField当全局变量使用
      streamField: '', // 将基准字段单选选中的值传给tableField当全局变量
      isIndeterminate: false, // 对应字段左侧多选indeterminate值
      isCompare: null, // 默认不选中查询字段
      val: '', //
      tableFields: [], // 待合标字段所有值
      streamFields: [], // 对应字段所有值
      isDisabled: false // 执行成功不能保存比对内容
    };
  },
  methods: {
    tableChange (val) {
      this.tableField = val;
      if (this.tableField && this.streamField) {
        this.setStyle('right');
      }
    },
    streamChange (val) {
      this.streamField = val;
      if (this.tableField && this.streamField) {
        this.setStyle('right');
      }
    },
    right () {
      const temp = Object;
      temp.tableField = this.tableField;
      temp.streamField = this.streamField;
      if (this.tableField && this.streamField) {
        this.valueMapperValues.push(Object.assign({}, temp));
        this.tableFields.splice(this.tableFields.indexOf(temp.tableField), 1);
        this.streamFields.splice(this.streamFields.indexOf(temp.streamField), 1);
        this.clearStyle('right');
        this.tableField = '';
        this.streamField = '';
      }
    },
    left () {
      this.isIndeterminate = false;
      const count = this.valueMapperSelectedValues.length;
      for (var j = (count - 1); j >= 0; j--) {
        let element = this.valueMapperSelectedValues[j];
        this.tableFields.push(element.tableField);
        this.streamFields.push(element.streamField);
        this.valueMapperValues.splice(this.valueMapperValues.indexOf(element), 1);
      }
      this.valueMapperSelectedValues = [];
      this.isIndeterminate = false;
      this.checkAll = false;
      this.clearStyle('left');
    },
    setStyle (disabledValue) {
      if (disabledValue === 'left') {
        this.disabledLeft = false;
        this.backgroundLeft = '#409EFF';
        this.colorLeft = '#fff';
      } else if (disabledValue === 'right') {
        this.disabledRight = false;
        this.backgroundRight = '#409EFF';
        this.colorRight = '#fff';
      }
    },
    handleCheckAllChange (val) {
      this.valueMapperSelectedValues = val ? this.valueMapperValues : [];
      this.isIndeterminate = false;
      if (this.valueMapperSelectedValues.length > 0) {
        this.isIndeterminate = true;
        this.setStyle('left');
      } else {
        this.isIndeterminate = false;
        this.clearStyle('left');
      }
    },
    clearStyle (disabledValue) {
      if (disabledValue === 'left') {
        this.disabledLeft = true;
        this.backgroundLeft = '#f5f7fa';
        this.colorLeft = '#c0c4cc';
      } else if (disabledValue === 'right') {
        this.disabledRight = true;
        this.backgroundRight = '#f5f7fa';
        this.colorRight = '#c0c4cc';
      }
    },
    handlevalueMapperSelectedValuesChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount > 0;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.valueMapperValues.length;
      if (this.valueMapperSelectedValues.length > 0) {
        this.isIndeterminate = true;
        this.setStyle('left');
      } else {
        this.isIndeterminate = false;
        this.clearStyle('left');
      }
    },
    setFields () {
      if (this.valueMapperValues.length > 0) {
        this.$emit('setFields', this.valueMapperValues);
      }
      this.$emit('hiddenDialog');
    },
    async setChildFields (tableFields, streamFields, mapperValues) {
      const tempTableFields = Object.assign([], tableFields);
      const tempStreamFields = Object.assign([], streamFields);
      if (mapperValues) {
        let tempValueMapper = [];
        mapperValues.forEach(element => {
          let tableField = Object();
          let streamField = Object();
          tableField['name'] = element.column_name;
          streamField['name'] = element.stream_name;
          let temp = Object();
          temp['tableField'] = tableField;
          temp['streamField'] = streamField;
          tempValueMapper.push(temp);
        });
        this.$set(this, 'valueMapperValues', tempValueMapper);
        const tablelen = tempTableFields.length;
        for (var j = (tablelen - 1); j >= 0; j--) {
          let table = tempTableFields[j];
          for (let i = 0; i < mapperValues.length; i++) {
            if (mapperValues[i].column_name === table.name) {
              tempTableFields.splice(table, 1);
            }
          }
        }
        const streamlen = tempStreamFields.length;
        for (var m = (streamlen - 1); m >= 0; m--) {
          let stream = tempStreamFields[m];
          for (let n = 0; n < mapperValues.length; n++) {
            if (mapperValues[n].column_name === stream.name) {
              tempStreamFields.splice(stream, 1);
            }
          }
        }
        this.$set(this, 'tableFields', Object.assign([], tempTableFields));
        this.$set(this, 'streamFields', Object.assign([], tempStreamFields));
      }
    },
    hiddenDialog () {
      this.$emit('hiddenDialog');
    }
  },
  mounted () {
    this.setChildFields();
  }
};
</script>


