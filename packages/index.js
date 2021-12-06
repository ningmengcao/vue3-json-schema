/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-03 10:14:32
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:22:19
 * @Description: file content
 * @FilePath: \vue3-json-schema\packages\index.js
 */
import vue3JsonSchema from "./json-schema/index.js";
const components = [vue3JsonSchema];
const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return;
  components.map((component) => {
    Vue.component(component.name, component);
  });
  // 判断是否是直接引入文件
  if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
  }
};
export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  vue3JsonSchema,
};
