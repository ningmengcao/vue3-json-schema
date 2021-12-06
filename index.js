/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-03 09:47:11
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:41:26
 * @Description: 将JsonSchemaEditor.vue文件暴露出去的出口
 * @FilePath: \vue3-json-schema\index.js
 */
import JsonSchemaEditor from "./src/components/json-schema/JsonSchemaEditor";
import _Vue from "vue";

JsonSchemaEditor.install = (Vue) => {
  if (!Vue) {
    window.Vue = Vue = _Vue;
  }
  Vue.component(JsonSchemaEditor.name, JsonSchemaEditor);
};
export default JsonSchemaEditor;
