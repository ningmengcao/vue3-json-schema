/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-02 16:31:58
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-07 14:19:30
 * @Description: file content
 * @FilePath: \vue3-json-schema\babel.config.js
 */
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      {
        libraryName: "element-plus",
        customStyleName: (name) => {
          name = name.slice(3);
          return `element-plus/theme-chalk/src/${name}.scss`;
        },
      },
    ],
  ],
};
