<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 15:22:25
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:08:40
 * @Description: SchemaJson
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\schema\SchemaJson.vue
-->
<template>
  <div class="schema-content">
    <!-- <template v-if="data.type === 'array'">
			<schema-array :prefix="name" :data="data" :show-title="showTitle" :show-default-value="showDefaultValue" :editor-id="editorId" />
		</template> -->
    <template v-if="data.type === 'object'">
      <schema-object
        :prefix="nameArray"
        :data="data"
        :show-title="showTitle"
        :show-default-value="showDefaultValue"
        :editor-id="editorId"
      />
    </template>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, computed } from "vue";
import SchemaObject from "./SchemaObject.vue";
// import SchemaArray from './SchemaArray.vue'

export default {
  name: "SchemaJson",
  components: {
    SchemaObject,
  },
  props: {
    data: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: false },
    showDefaultValue: { type: Boolean, default: false },
    editorId: { type: String, default: "editor_id" },
  },
  setup(props) {
    // ************************************************数据声明******************************************
    // TODO(定义数据变量)
    let data = reactive({
      name: [], // 前缀名
      data: props.data, // 数据
      showTitle: props.showTitle, // 显示标题
      showDefaultValue: props.showDefaultValue, // 显示默认值
      editorId: props.editorId, // 编辑id
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {});
    // 前缀名
    const nameArray = computed(() => {
      return [].concat(data.name, "properties");
    });
    // ************************************************方法声明******************************************
    return { ...toRefs(data), nameArray };
  },
};
</script>

<style scoped lang="scss"></style>
