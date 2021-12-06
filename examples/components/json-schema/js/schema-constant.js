/*
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 13:39:36
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 09:31:01
 * @Description: json schema 常量
 * @FilePath: \vue3-json-schema\src\components\json-schema\js\schema-constant.js
 */

//  TODO(默认schema)
export const DEFAULT_SCHEMA = {
  string: { type: "string" },
  number: { type: "number" },
  array: { type: "array", items: { type: "string" } },
  object: { type: "object", properties: {} },
  boolean: { type: "boolean" },
  integer: { type: "integer" },
};

// TODO(初始 schema)
export const DEFAULT_INIT_SCHEMA = {
  type: "object",
  title: "title",
  properties: {},
};

// TODO(初始parameters: schema)
export const PARAMETERS_DEFAULT_INIT_SCHEMA = {
  type: "object",
  title: "title",
  properties: { "": { type: "string" } },
  required: [""],
};

// TODO(schema类型)
export const SCHEMA_TYPE = [
  "string",
  "number",
  "array",
  "object",
  "boolean",
  "integer",
];

// TODO(路径连接字符)
export const JSON_PATH_JOIN_CHAR = ".";

// TODO(高级设置格式)
export const ADVANCED_SETTING_FORMAT = [
  { value: 1, label: "小写英文" },
  { value: 2, label: "大写英文" },
  { value: 3, label: "中文" },
  { value: 4, label: "数字" },
  { value: 5, label: "特殊符号" },
  { value: 6, label: "下划线" },
];

// ace-editor 在线代码编辑器配置
export const EDITOR_OPTIONS = {
  tabSize: 2,
  enableMultiselect: true, // 选中多处
  enableBasicAutocompletion: true, // 启用基本自动完成
  enableSnippets: true, //启用代码段
  enableLiveAutocompletion: true, // 启用实时自动完成
  highlightSelectedWord: true, // 高亮选中文本
  highlightActiveLine: true, // 行高亮
  showPrintMargin: false, // 打印边距可见性
  wrap: true, // 换行
};
