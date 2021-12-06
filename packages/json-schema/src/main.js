/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-03 16:22:26
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 16:22:27
 * @Description: file content
 * @FilePath: \vue3-json-schema\packages\json-schema\main.js
 */
import { createApp } from "vue";
import JsonSchemaEditor from "./JsonSchemaEditor.vue";

// import "element-plus/dist/index.css";
// import ElementPlus from "element-plus";

const app = createApp(JsonSchemaEditor);
// app.use(ElementPlus);
app.mount("#app");
