<!--
 * @Author: zhaoshengnan
 * @Date: 2021-12-02 16:31:58
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 09:34:36
 * @Description: file content
 * @FilePath: \vue3-json-schema\src\App.vue
-->
<template>
  <JsonSchemaEditor
    v-model:schema="jsonSchema"
    @schema-change="changeSchema"
  ></JsonSchemaEditor>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import JsonSchemaEditor from "./components/json-schema/JsonSchemaEditor.vue";

export default {
  name: "App",
  components: {
    JsonSchemaEditor,
  },
  setup() {
    const data = reactive({
      jsonSchema: { type: "object", title: "title", properties: {} },
    });
    const changeSchema = (val) => {
      data.jsonSchema = val;
    };

    return { ...toRefs(data), changeSchema };
  },
};
</script>

<style></style>
