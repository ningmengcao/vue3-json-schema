<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-18 09:52:54
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:05:44
 * @Description: DropPlus(新增下拉框)
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\schema\DropPlus.vue
-->
<template>
  <el-dropdown trigger="click">
    <el-tooltip placement="top" content="添加兄弟/子节点">
      <i class="el-icon-plus plus"></i>
    </el-tooltip>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <span
            @click="addFieldAction({ eventType: 'add-field', isChild: false })"
            >兄弟节点</span
          >
        </el-dropdown-item>
        <el-dropdown-item>
          <span
            @click="addFieldAction({ eventType: 'add-field', isChild: true })"
            >子节点</span
          >
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { reactive, onMounted, toRefs } from "vue";
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTooltip,
} from "element-plus";

export default {
  name: "DropPlus",
  components: {
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElTooltip,
  },
  props: {
    prefix: { type: Array, default: () => [] },
    name: { type: String, default: "" },
  },
  emits: ["add-field"],
  setup(props, context) {
    // ************************************************数据声明******************************************
    // TODO(定义数据变量)
    let data = reactive({});
    // ************************************************钩子函数******************************************
    onMounted(() => {});
    // ************************************************方法声明******************************************
    // TODO(添加字段操作)
    const addFieldAction = (...args) => {
      context.emit("add-field", ...args);
    };

    return { ...toRefs(data), addFieldAction };
  },
};
</script>

<style scoped lang="scss"></style>
