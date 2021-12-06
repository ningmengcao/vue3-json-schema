<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 11:45:55
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 16:54:25
 * @Description: json schema编辑器
 * @FilePath: \vue3-json-schema\packages\json-schema\src\JsonSchemaEditor.vue
-->
<template>
  <div class="margin-bottom-xs">
    <el-button type="primary" size="small" @click="importJson"
      >导入json</el-button
    >
  </div>

  <div class="json-schema-vue-editor">
    <el-row>
      <el-col :span="8" class="col-item name-item col-item-name">
        <el-row type="flex" justify="space-around" align="middle">
          <el-col :span="2" class="down-style-col">
            <span
              v-if="schemaData.type === 'object'"
              class="down-style"
              @click="handleClickIcon"
            >
              <i v-if="show" class="el-icon-caret-bottom icon-object"></i>
              <i v-if="!show" class="el-icon-caret-right icon-object"></i>
            </span>
          </el-col>
          <el-col :span="22">
            <el-input
              model-value="root"
              disabled
              size="small"
              :maxlength="50"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5" class="col-item col-item-type">
        <el-select
          v-model="schemaData.type"
          disabled
          class="type-select-style"
          size="small"
          @change="handleChangeType2($event)"
        >
          <el-option
            v-for="item in schemaTypes"
            :key="item"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col
        v-if="!showTitle && showDefaultValue"
        :span="8"
        class="col-item col-item-mock"
      >
        <el-input
          v-model="schemaData.default"
          placeholder="默认值"
          size="small"
          :disabled="
            schemaData.type === 'object' ||
            schemaData.type === 'array' ||
            schemaData.disabled
          "
        >
          <template #append>
            <i class="el-icon-edit"></i>
          </template>
        </el-input>
      </el-col>
      <el-col :span="3" class="col-item col-item-setting">
        <span
          v-if="schemaData.type === 'object'"
          @click="
            handleSchemaUpdateEvent({
              eventType: 'add-field',
              isChild: false,
              prefix: ['properties'],
            })
          "
        >
          <el-tooltip placement="top" content="添加子节点">
            <i class="el-icon-plus plus"></i>
          </el-tooltip>
        </span>
      </el-col>
    </el-row>
    <schema-json
      v-if="show"
      :data="schemaData"
      :show-title="showTitle"
      :show-default-value="showDefaultValue"
      :editor-id="editorId"
    ></schema-json>
    <!-- 导入json弹窗 -->
    <div v-if="importVisible">
      <Json2SchemaDialog
        v-model:visible="importVisible"
        @json2schema="json2schema"
      ></Json2SchemaDialog>
    </div>
    <!-- 默认值编辑弹窗 -->
    <div v-if="basicDialogVisible">
      <BasicDialog
        v-model:visible="basicDialogVisible"
        :init-data="basicModalData"
      />
    </div>
    <!-- 高级设置弹窗 -->
    <div v-if="settingDialogVisible.string">
      <StringDialog
        v-model:visible="settingDialogVisible.string"
        :init-data="settingModalData"
      ></StringDialog>
    </div>
    <div v-if="settingDialogVisible.number">
      <NumberDialog
        v-model:visible="settingDialogVisible.number"
        :init-data="settingModalData"
      ></NumberDialog>
    </div>
    <div v-if="settingDialogVisible.integer">
      <NumberDialog
        v-model:visible="settingDialogVisible.integer"
        :init-data="settingModalData"
      ></NumberDialog>
    </div>
    <div v-if="settingDialogVisible.array">
      <ArrayDialog
        v-model:visible="settingDialogVisible.array"
        :init-data="settingModalData"
      ></ArrayDialog>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  onMounted,
  toRefs,
  nextTick,
  onBeforeUnmount,
  watch,
} from "vue";
import SchemaJson from "./components/json-schema/schema/SchemaJson.vue";
import BasicDialog from "./components/json-schema/dialog/BasicDialog.vue";
import Json2SchemaDialog from "./components/json-schema/dialog/Json2SchemaDialog.vue";
import StringDialog from "./components/json-schema/dialog/StringDialog.vue";
import NumberDialog from "./components/json-schema/dialog/NumberDialog.vue";
import ArrayDialog from "./components/json-schema/dialog/ArrayDialog.vue";

import {
  DEFAULT_SCHEMA,
  SCHEMA_TYPE,
  JSON_PATH_JOIN_CHAR,
} from "./components/json-schema/js/schema-constant";
import { uuid } from "./components/json-schema/js/json-schema";

import "./styles/json-schema.scss";
import "element-plus/dist/index.css";

import _ from "lodash";
import bus from "./utils/mitt-bus";
import { isEmpty } from "./utils/validate";
import {
  ElSelect,
  ElOption,
  ElButton,
  ElTooltip,
  ElRow,
  ElCol,
  ElInput,
} from "element-plus";

export default {
  name: "vue3-json-schema",
  components: {
    SchemaJson,
    BasicDialog,
    Json2SchemaDialog,
    StringDialog,
    NumberDialog,
    ArrayDialog,
    ElSelect,
    ElOption,
    ElButton,
    ElTooltip,
    ElRow,
    ElCol,
    ElInput,
  },
  props: {
    schema: { type: Object, default: () => {} }, // json schema 对象
    showTitle: { type: Boolean, default: false }, // 显示标题
    showDefaultValue: { type: Boolean, default: true }, // 是否展示默认值输入框
  },
  emits: ["schema-change", "update:schema"],
  setup(props, context) {
    // ************************************************数据声明******************************************
    const visibleObj = {};
    SCHEMA_TYPE.map((type) => {
      visibleObj[type] = false;
    }); // 高级弹窗控制对象
    // TODO(定义数据变量)
    let data = reactive({
      editorId: uuid(), // 编辑器id
      schemaData: props.schema, // schema格式数据
      showTitle: props.showTitle,
      showDefaultValue: props.showDefaultValue,
      showRaw: props.showRaw,
      show: true, // 是否显示子级节点
      schemaTypes: SCHEMA_TYPE, // schema类型
      basicDialogVisible: false, // 控制基础弹窗
      basicModalData: { title: "", value: "" }, // 基础模型数据
      settingDialogVisible: visibleObj, // 控制高级设置弹窗
      settingModalData: {}, // 高级设置模型数据
      importVisible: false, // 控制导入json
      previewVisible: false, // 控制预览
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {
      bus.$on(`schema-update-${data.editorId}`, (options) =>
        handleSchemaUpdateEvent(options)
      );
    });

    onBeforeUnmount(() => {
      bus.$off(`schema-update-${data.editorId}`, (options) =>
        handleSchemaUpdateEvent(options)
      );
    });
    // 监听schema
    watch(
      () => props.schema,
      (val) => {
        forceUpdate(val);
        handleEmitChange(val);
      }
    );
    // ************************************************方法声明******************************************
    // TODO(点击展开/收缩图标)
    const handleClickIcon = () => {
      data.show = !data.show;
    };
    // TODO(处理schema更新事件)
    const handleSchemaUpdateEvent = (options) => {
      const { eventType, ...opts } = options;

      switch (eventType) {
        case "add-field":
          addFieldAction(opts);
          break;
        case "delete-field":
          deleteFieldAction(opts);
          break;
        case "update-field-name":
          updateFieldNameAction(opts);
          break;
        case "schema-type":
          handleChangeType(opts);
          break;
        case "show-edit":
          handleShowEdit(opts);
          break;
        case "save-showedit":
          handleSaveShowEdit(opts);
          break;
        case "setting":
          handleSettingAction(opts);
          break;
        case "save-setting":
          handleSaveSetting(opts);
          break;
        default:
          break;
      }
    };
    // TODO(处理新增字段 isChild 新增子节点 action 字段和路径)
    async function addFieldAction(opts) {
      const { isChild, name, prefix } = opts;
      let parentPrefix = ""; // 父节点路径
      let requirePrefix = []; // require路径
      if (isChild) {
        const tempArr = [].concat(prefix, name);
        parentPrefix = tempArr.concat("properties").join(JSON_PATH_JOIN_CHAR);
        requirePrefix = [...tempArr];
      } else {
        parentPrefix = prefix.join(JSON_PATH_JOIN_CHAR);
        const tempPrefix = [].concat(prefix);
        tempPrefix.pop();
        requirePrefix = tempPrefix;
      }

      let newPropertiesData = {};
      const ranName = "field_" + uuid();
      const propertiesData = _.get(data.schemaData, parentPrefix);
      newPropertiesData = Object.assign({}, propertiesData);
      newPropertiesData[ranName] = _.cloneDeep(DEFAULT_SCHEMA["string"]);

      const cloneSchema = _.cloneDeep(data.schemaData);
      _.set(cloneSchema, parentPrefix, newPropertiesData);

      // add required
      let pRequiredData = null;
      if (!requirePrefix.length) {
        // 一级属性
        pRequiredData = cloneSchema;
      } else {
        pRequiredData = _.get(cloneSchema, requirePrefix);
      }
      const requiredData = [].concat(pRequiredData.required || []);
      requiredData.push(ranName);
      requirePrefix.push("required");
      _.set(cloneSchema, requirePrefix, _.uniq(requiredData)); // 绑定去重后的required

      // update schema
      data.schemaData = cloneSchema;
      forceUpdate(cloneSchema);
      handleEmitChange(cloneSchema);
    }
    // TODO(删除字段)
    function deleteFieldAction(opts) {
      const { name, prefix } = opts;
      const curFieldPath = [].concat(prefix, name).join(JSON_PATH_JOIN_CHAR);

      const cloneSchema = _.cloneDeep(data.schemaData);

      // 删除required中对应的字段
      const newPrefix = _.cloneDeep(prefix);
      newPrefix[newPrefix.length - 1] = "required"; // 将路径上的最后一个properties值变为required
      const requiredPrefix = newPrefix.join(JSON_PATH_JOIN_CHAR);
      const requiredData = _.get(cloneSchema, requiredPrefix);

      const newRequiredData = _.difference(requiredData, [name]);
      _.unset(cloneSchema, requiredPrefix); // 解绑required

      if (!isEmpty(newRequiredData)) {
        _.set(cloneSchema, requiredPrefix, _.uniq(newRequiredData)); // 绑定去重后新的required
      }
      _.unset(cloneSchema, curFieldPath); // 解绑当前路径上的数据

      // update schema
      data.schemaData = cloneSchema;
      forceUpdate();
      handleEmitChange(cloneSchema);
    }
    // TODO(更新字段名称)
    function updateFieldNameAction(opts) {
      const { value, name, prefix } = opts;

      let requirePrefix = [];
      const prefixCopy = _.cloneDeep(prefix);
      prefixCopy.pop();
      requirePrefix = prefixCopy; // 上级 required路径
      const parentPrefix = prefix.join(JSON_PATH_JOIN_CHAR);
      const curFieldPath = prefix.concat(name).join(JSON_PATH_JOIN_CHAR); // 当前路径

      const cloneSchema = _.cloneDeep(data.schemaData);
      const propertiesData = _.get(cloneSchema, curFieldPath); // 原来的值
      _.unset(cloneSchema, curFieldPath); // 解绑当前路径
      _.set(cloneSchema, `${parentPrefix}.${value}`, propertiesData); // 添加
      // update required name
      let pRequiredData = null;
      if (!requirePrefix.length) {
        // 一级属性
        pRequiredData = cloneSchema;
      } else {
        pRequiredData = _.get(cloneSchema, requirePrefix);
      }
      let requiredData = [].concat(pRequiredData.required || []);
      requiredData = requiredData.map((item) => {
        if (item === name) return value;
        return item;
      });
      requirePrefix.push("required");
      _.set(cloneSchema, requirePrefix, _.uniq(requiredData)); // 绑定去重后的required

      // update schema
      data.schemaData = cloneSchema;
      forceUpdate(cloneSchema);
      handleEmitChange(cloneSchema);
    }
    // TODO(schema 类型变化)
    function handleChangeType(opts) {
      const { value, name, prefix } = opts;
      const parentPrefix = [].concat(prefix, name).join(JSON_PATH_JOIN_CHAR);

      const newParentDataItem = _.cloneDeep(DEFAULT_SCHEMA[value]);
      const newParentData = Object.assign({}, newParentDataItem);
      const cloneSchema = _.cloneDeep(data.schemaData);
      _.set(cloneSchema, parentPrefix, newParentData);

      data.schemaData = cloneSchema;
      forceUpdate();
      handleEmitChange(cloneSchema);
    }
    // TODO(根节点schema变化)
    const handleChangeType2 = (value) => {
      data.schemaData.type = value;
      const newParentDataItem = _.cloneDeep(DEFAULT_SCHEMA[value]);
      const newParentData = Object.assign({}, newParentDataItem);
      data.schemaData = newParentData;
      handleEmitChange(data.schemaData);
    };
    // TODO(默认值编辑)
    function handleShowEdit(opts) {
      const { field, name, prefix, isRoot, type } = opts;

      let parentData = {};
      if (isRoot) {
        parentData = data.schemaData;
      } else {
        const parentPrefix = [].concat(prefix, name);
        parentData = _.get(data.schemaData, parentPrefix);
      }

      // disable 的时候，return事件处理
      if (
        (field === "default" && parentData.type === "array") ||
        parentData.type === "object"
      ) {
        return;
      }

      data.basicDialogVisible = true;
      Object.assign(data.basicModalData, {
        title:
          field === "title" ? "标题" : field === "default" ? "默认值" : "描述",
        value: parentData[field],
        editorId: data.editorId,
        type: type,
        ...opts,
      });
    }
    // TODO(保存默认值编辑)
    function handleSaveShowEdit(opts) {
      const { value, field, name, prefix, isRoot } = opts;

      let parentPrefix = [];
      const cloneSchema = _.cloneDeep(data.schemaData);
      if (isRoot) {
        cloneSchema[field] = value;
      } else {
        parentPrefix = [].concat(prefix, name, field);

        _.set(cloneSchema, parentPrefix, value);
      }

      data.schemaData = cloneSchema;
      forceUpdate();
      handleEmitChange(cloneSchema);
    }
    // TODO(高级设置)
    function handleSettingAction(opts) {
      const { schemaType, name, prefix, isRoot } = opts;
      data.settingDialogVisible[schemaType] = true;
      let parentData;
      if (isRoot) {
        parentData = data.schemaData;
      } else {
        const parentPrefix = [].concat(prefix, name);
        parentData = _.get(data.schemaData, parentPrefix);
      }
      data.settingModalData = {
        schemaType,
        name,
        isRoot,
        prefix,
        editorId: data.editorId,
        ...parentData,
      };
    }
    // TODO(高级设置更新 schema)
    function handleSaveSetting(opts) {
      const { name, prefix, newData, isRoot } = opts;
      const cloneSchema = _.cloneDeep(data.schemaData);

      if (isRoot) {
        Object.assign(cloneSchema, { ...newData });
      } else {
        const parentPrefix = [].concat(prefix, name);
        const oldData = _.get(cloneSchema, parentPrefix);
        _.set(cloneSchema, parentPrefix, { ...oldData, ...newData });
      }

      data.schemaData = cloneSchema;
      forceUpdate();
      handleEmitChange(cloneSchema);
    }

    // TODO(导入json)
    const importJson = () => {
      data.importVisible = true;
    };
    // TODO(json 转 schema对象)
    const json2schema = (schema) => {
      forceUpdate(schema);
      handleEmitChange(schema);
    };
    // TODO(解决嵌套对象属性无法刷新页面问题)
    function forceUpdate(schema) {
      const temp = schema || data.schemaData;
      data.schemaData = {};
      nextTick(() => {
        data.schemaData = temp;
      });
    }
    // TODO(更新emit)
    function handleEmitChange(schema) {
      context.emit("schema-change", schema);
      context.emit("update:schema", schema);
    }

    return {
      ...toRefs(data),
      handleClickIcon,
      handleChangeType2,
      handleSchemaUpdateEvent,
      handleShowEdit,
      importJson,
      json2schema,
    };
  },
};
</script>

<style scoped lang="scss"></style>
