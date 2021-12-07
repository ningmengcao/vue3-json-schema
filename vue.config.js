/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-03 10:17:52
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-07 15:39:20
 * @Description: file content
 * @FilePath: \vue3-json-schema\vue.config.js
 */
const path = require("path");

module.exports = {
  // 修改默认的入口
  css: {
    extract: false,
  },
  pages: {
    index: {
      entry: "examples/main.js",
      // entry: "packages/json-schema/src/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  chainWebpack: (config) => {
    // vue默认@指向src目录，这里要修正为examples，另外新增一个~指向packages
    config.resolve.alias
      .set("@", path.resolve("examples"))
      .set("~", path.resolve("packages"));
    config.module
      .rule("js")
      .include.add(__dirname + "packages")
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap((options) => {
        return options;
      });
  },
};
