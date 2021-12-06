<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 17:00:01
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 16:33:01
 * @Description: SchemaArray
 * @FilePath: \vue3-json-schema\examples\components\json-schema\schema\SchemaArray.vue
-->
<template>
  <div class="array-type">
    <el-row type="flex" align="middle">
      <el-col
        :span="8"
        class="col-item name-item col-item-name"
        :style="tagPaddingLeftStyle"
      >
        <el-row type="flex" justify="space-around" align="middle">
          <el-col :span="2" class="down-style-col">
            <span
              v-if="items.type === 'object'"
              class="down-style"
              @click="handleClickIcon"
            >
              <i v-if="!showIcon" class="el-icon-caret-bottom icon-object"></i>
              <i v-else class="el-icon-caret-right icon-object"></i>
            </span>
          </el-col>
          <el-col :span="22">
            <el-input
              disabled
              model-value="Items"
              size="small"
              :maxlength="50"
            />
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="5" class="col-item col-item-type">
        <el-select
          v-model="items.type"
          size="small"
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

      <el-col
        v-if="!showTitle && showDefaultValue"
        :span="8"
        class="col-item col-item-mock"
      >
        <el-select
          v-if="items.type === 'boolean'"
          v-model="items.default"
          size="small"
        >
          <el-option label="false" :value="false"></el-option>
          <el-option label="true" :value="true"></el-option>
        </el-select>
        <el-input
          v-else
          v-model.trim="items.default"
          placeholder="默认值"
          size="small"
          :disabled="
            items.type === 'object' || items.type === 'array' || items.disabled
          "
        >
          <template #append>
            <i
              class="el-icon-edit"
              @click="
                handleAction({ eventType: 'show-edit', field: 'default' })
              "
            ></i>
          </template>
        </el-input>
      </el-col>

      <el-col :span="3" class="col-item col-item-setting">
        <span
          v-if="items.type !== 'object' && items.type !== 'boolean'"
          class="adv-set"
        >
          <el-tooltip placement="top" content="高级设置">
            <i
              class="el-icon-setting"
              @click="
                handleAction({ eventType: 'setting', schemaType: items.type })
              "
            ></i>
          </el-tooltip>
        </span>

        <span v-if="items.type === 'object'">
          <el-tooltip placement="top" content="添加子节点">
            <i
              class="el-icon-plus plus"
              @click="handleAction({ eventType: 'add-field', isChild: true })"
            ></i>
          </el-tooltip>
        </span>
      </el-col>
    </el-row>

    <div class="option-formStyle">
      <template v-if="items.type === 'array'">
        <SchemaArray
          :prefix="prefixArray"
          :data="items"
          :show-title="showTitle"
          :show-default-value="showDefaultValue"
          :editor-id="editorId"
        />
      </template>
      <template v-if="items.type === 'object' && !showIcon">
        <SchemaObject
          :prefix="nameArray"
          :data="items"
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
import SchemaObject from "./SchemaObject.vue";
import bus from "../../../utils/mitt-bus";
import {
  ElInput,
  ElSelect,
  ElOption,
  ElTooltip,
  ElRow,
  ElCol,
} from "element-plus";

export default {
  name: "SchemaArray",
  components: {
    SchemaObject,
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
    action: { type: Function, default: () => () => {} },
  },
  setup(props) {
    // ************************************************数据声明******************************************
    // TODO(定义数据变量)
    let data = reactive({
      showTitle: props.showTitle, // 显示标题
      showDefaultValue: props.showDefaultValue, // 显示默认值
      name: props.name, // 属性名
      editorId: props.editorId, // 编辑id
      prefix: props.prefix, // 前缀名
      data: props.data, // 数据
      tagPaddingLeftStyle: {}, // 标记填充左样式
      schemaTypes: SCHEMA_TYPE, // schema类型
      items: props.data.items, // 数据item
      showIcon: false, // 是否显示
    });
    // ************************************************钩子函数******************************************
    // Object-属性路径
    const nameArray = computed(() => {
      let prefixArray = [].concat(data.prefix, "items");
      return [].concat(prefixArray, "properties");
    });
    // Array-属性路径
    const prefixArray = computed(() => {
      return [].concat(data.prefix, "items");
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
    // TODO(执行操作)
    const handleAction = (options) => {
      const prefix = data.prefix;
      bus.$emit(`schema-update-${data.editorId}`, {
        prefix,
        name: "items",
        ...options,
      });
    };
    // TODO(类型变化)
    const handleChangeType = (value) => {
      handleAction({ eventType: "schema-type", value });
    };

    return {
      ...toRefs(data),
      nameArray,
      prefixArray,
      handleClickIcon,
      handleChangeType,
      handleAction,
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
