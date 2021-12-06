<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 15:27:48
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-02 16:46:44
 * @Description: SchemaObject
 * @FilePath: \vue3-json-schema\src\components\json-schema\schema\SchemaObject.vue
-->
<template>
  <div class="object-style">
    <schema-item
      v-for="(name, index) in propertyKeys"
      :key="index"
      :data="data"
      :name="name"
      :prefix="prefix"
      :show-title="showTitle"
      :show-default-value="showDefaultValue"
      :editor-id="editorId"
    ></schema-item>
  </div>
</template>

<script>
import {
  reactive,
  onMounted,
  toRefs,
  computed,
  defineAsyncComponent,
} from "vue";
export default {
  name: "SchemaObject",
  components: {
    "schema-item": defineAsyncComponent(() => import("./SchemaItem.vue")),
  },
  props: {
    prefix: { type: Array, default: () => [] },
    data: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: false },
    showDefaultValue: { type: Boolean, default: false },
    editorId: { type: String, default: "editor_id" },
  },
  setup(props) {
    // ************************************************数据声明******************************************
    // TODO(定义数据变量)
    let data = reactive({
      prefix: props.prefix, // 前缀名
      data: props.data, // 数据
      showTitle: props.showTitle, // 显示标题
      showDefaultValue: props.showDefaultValue, // 显示默认值
      editorId: props.editorId, // 编辑id
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {});
    // 属性键
    const propertyKeys = computed(() => {
      return Object.keys(data.data.properties);
    });
    // ************************************************方法声明******************************************
    return { ...toRefs(data), propertyKeys };
  },
};
</script>

<style scoped lang="scss"></style>
