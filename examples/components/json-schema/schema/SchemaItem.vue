<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 15:36:35
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:06:55
 * @Description: SchemaItem
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\schema\SchemaItem.vue
-->
<template>
  <div>
    <el-row>
      <el-col
        :span="8"
        class="col-item name-item col-item-name"
        :style="tagPaddingLeftStyle"
      >
        <el-row type="flex" justify="space-around" align="middle">
          <el-col :span="2" class="down-style-col">
            <span
              v-if="value.type === 'object'"
              class="down-style"
              @click="handleClickIcon"
            >
              <i v-if="showIcon" class="el-icon-caret-bottom icon-object"></i>
              <i v-if="!showIcon" class="el-icon-caret-right icon-object"></i>
            </span>
          </el-col>
          <el-col :span="22" class="el-input--small">
            <el-input
              v-model="fieldName"
              placeholder="字段名"
              size="small"
              :class="{ 'is-disabled': value.disabled }"
              :disabled="value.disabled"
              :maxlength="50"
              @change="handleNameChange"
            ></el-input>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="5" class="col-item col-item-type">
        <el-select
          v-model="value.type"
          size="small"
          :disabled="value.disabled"
          class="type-select-style"
          @change="handleChangeType"
        >
          <el-option
            v-for="item in schemaTypes"
            :key="item"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
      </el-col>

      <!-- 默认值 -->
      <el-col
        v-if="!showTitle && showDefaultValue"
        :span="8"
        class="col-item col-item-mock"
      >
        <el-select
          v-if="value.type === 'boolean'"
          v-model="value.default"
          size="small"
          @change="handleDefault"
        >
          <el-option label="false" :value="false"></el-option>
          <el-option label="true" :value="true"></el-option>
        </el-select>
        <el-input
          v-else-if="value.type === 'number'"
          v-model="value.default"
          placeholder="默认值"
          @change="validateNumber"
        >
          <template #append>
            <i
              class="el-icon-edit"
              @click="
                handleAction({
                  eventType: 'show-edit',
                  field: 'default',
                  type: value.type,
                })
              "
            ></i>
          </template>
        </el-input>
        <el-input
          v-else-if="value.type === 'integer'"
          v-model.number="value.default"
          placeholder="默认值"
          @change="validateInteger"
        >
          <template #append>
            <i
              class="el-icon-edit"
              @click="
                handleAction({
                  eventType: 'show-edit',
                  field: 'default',
                  type: value.type,
                })
              "
            ></i>
          </template>
        </el-input>
        <el-input
          v-else
          v-model.trim="value.default"
          placeholder="默认值"
          size="small"
          :disabled="
            value.type === 'object' || value.type === 'array' || value.disabled
          "
          @blur="handleDefault"
        >
          <template #append>
            <i
              class="el-icon-edit"
              @click="
                handleAction({
                  eventType: 'show-edit',
                  field: 'default',
                  type: value.type,
                })
              "
            ></i>
          </template>
        </el-input>
      </el-col>

      <el-col :span="3" class="col-item col-item-setting">
        <span
          v-if="value.type !== 'object' && value.type !== 'boolean'"
          class="adv-set"
        >
          <el-tooltip placement="top" content="高级设置">
            <i
              class="el-icon-setting"
              @click="
                handleAction({ eventType: 'setting', schemaType: value.type })
              "
            ></i>
          </el-tooltip>
        </span>

        <span class="delete-item" :class="{ hidden: value.disabled }">
          <el-tooltip placement="top" content="删除节点">
            <i
              class="el-icon-close close"
              @click="handleAction({ eventType: 'delete-field' })"
            ></i>
          </el-tooltip>
        </span>

        <DropPlus
          v-if="value.type === 'object'"
          :prefix="prefix"
          :name="name"
          @add-field="handleAction"
        />
        <span v-if="value.type !== 'object'">
          <el-tooltip placement="top" content="添加兄弟节点">
            <i
              class="el-icon-plus plus"
              @click="handleAction({ eventType: 'add-field', isChild: false })"
            ></i>
          </el-tooltip>
        </span>
      </el-col>
    </el-row>
    <div class="option-formStyle">
      <template v-if="value.type === 'array'">
        <SchemaArray
          :prefix="prefixArray"
          :data="value"
          :show-title="showTitle"
          :show-default-value="showDefaultValue"
          :editor-id="editorId"
        />
      </template>
      <template v-if="value.type === 'object' && showIcon">
        <SchemaObject
          :prefix="nameArray"
          :data="value"
          :show-title="showTitle"
          :show-default-value="showDefaultValue"
          :editor-id="editorId"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, computed, onBeforeMount } from "vue";
import { SCHEMA_TYPE } from "../js/schema-constant";
import SchemaArray from "./SchemaArray.vue";
import SchemaObject from "./SchemaObject.vue";
import DropPlus from "./DropPlus.vue";

import bus from "../../../utils/mitt-bus";
import { isEmpty } from "../../../utils/validate";
import {
  validateIntegerDefault,
  validateNumberDefault,
} from "../js/json-schema";
import {
  ElInput,
  ElSelect,
  ElOption,
  ElTooltip,
  ElRow,
  ElCol,
} from "element-plus";

export default {
  name: "SchemaItem",
  components: {
    SchemaArray,
    SchemaObject,
    DropPlus,
    ElInput,
    ElSelect,
    ElOption,
    ElTooltip,
    ElRow,
    ElCol,
  },
  props: {
    showTitle: { type: Boolean, default: false },
    showDefaultValue: { type: Boolean, default: false },
    editorId: { type: String, default: "editor_id" },
    name: { type: String, default: "" },
    prefix: { type: Array, default: () => [] },
    data: { type: Object, default: () => {} },
  },
  setup(props) {
    // ************************************************数据声明******************************************
    // TODO(定义数据变量)
    let data = reactive({
      showIcon: true, // 是否显示子级节点
      value: props.data.properties[props.name], // 属性值
      prefix: props.prefix, // 前缀名
      data: props.data, // 数据
      showTitle: props.showTitle, // 显示标题
      showDefaultValue: props.showDefaultValue, // 显示默认值
      fieldName: props.name, // 属性名
      editorId: props.editorId, // 编辑id
      tagPaddingLeftStyle: {}, // 标记填充左样式
      schemaTypes: SCHEMA_TYPE, // schema类型
    });
    // ************************************************钩子函数******************************************
    // 属性名
    const nameArray = computed(() => {
      const prefixArray = [].concat(data.prefix, data.fieldName);
      return [].concat(prefixArray, "properties");
    });
    // 前缀名
    const prefixArray = computed(() => {
      return [].concat(data.prefix, data.fieldName);
    });
    onBeforeMount(() => {
      const length = data.prefix.filter((name) => name !== "properties").length;
      data.tagPaddingLeftStyle = { paddingLeft: `${10 * (length + 1)}px` };
    });
    onMounted(() => {});
    // ************************************************方法声明******************************************
    // TODO(点击展开/收缩图标)
    const handleClickIcon = () => {
      data.showIcon = !data.showIcon;
    };
    // TODO(更改属性名)
    const handleNameChange = (e) => {
      if (isEmpty(props.name)) {
        data.value.default = "";
      }
      handleAction({ eventType: "update-field-name", value: e });
    };
    // TODO(类型变化)
    const handleChangeType = (value) => {
      handleAction({ eventType: "schema-type", value });
    };
    // TODO(执行操作)
    const handleAction = (options) => {
      const prefix = props.prefix; // 字段路径
      const name = props.name; // 当前操作字段
      bus.$emit(`schema-update-${data.editorId}`, {
        eventType: "add-field",
        prefix,
        name,
        ...options,
      });
    };

    // TODO(验证类型为number的数据)
    const validateNumber = () => {
      if (validateNumberDefault(data.value.default)) {
        handleDefault();
      } else {
        data.value.default = "";
      }
    };
    // TODO(验证类型为integer的数据)
    const validateInteger = () => {
      if (validateIntegerDefault(data.value.default)) {
        handleDefault();
      } else {
        data.value.default = "";
      }
    };
    // TODO(处理默认值)
    const handleDefault = () => {
      handleAction({
        eventType: "save-showedit",
        field: "default",
        value: data.value.default,
        type: data.value.type,
      });
    };

    return {
      ...toRefs(data),
      nameArray,
      prefixArray,
      handleClickIcon,
      handleNameChange,
      handleChangeType,
      handleAction,
      validateNumber,
      validateInteger,
      handleDefault,
    };
  },
};
</script>

<style scoped lang="scss">
.col-item-mock {
  :deep(.el-select--small) {
    width: 100%;
  }
}
</style>
