/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-03 10:02:32
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 16:53:34
 * @Description: file content
 * @FilePath: \vue3-json-schema\packages\json-schema\index.js
 */
import JsonSchemaEditor from "./src/JsonSchemaEditor.vue";

// 为组件提供 install 安装方法，供按需引入
JsonSchemaEditor.install = function (Vue) {
  Vue.component(JsonSchemaEditor.name, JsonSchemaEditor);
};

// 默认导出组件
export default JsonSchemaEditor;
