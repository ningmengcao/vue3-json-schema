/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-02 16:31:58
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 14:20:05
 * @Description: file content
 * @FilePath: \vue3-json-schema\packages\json-schema\src\main.js
 */
import { createApp } from "vue";
import App from "./App.vue";

import "element-plus/dist/index.css";
import ElementPlus from "element-plus";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
