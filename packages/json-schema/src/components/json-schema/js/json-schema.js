/*
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 14:00:47
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 10:11:48
 * @Description: json schema函数
 * @FilePath: \vue3-json-schema\packages\vue3-json-schema\src\components\json-schema\js\json-schema.js
 */
// TODO(uuid--随机数)
export const uuid = () => {
  return new Date().getTime().toString();
};

// TODO(删除数据 state: 状态 keys: 字段)
export const deleteData = function (state, keys) {
  let curState = state;
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]];
  }

  delete curState[keys[keys.length - 1]];
};

import {
  isEmpty,
  isUndefined,
  regFloatNumber,
  regNumber,
  regIntegerNumber,
} from "../../../utils/validate";

import { showMessage } from "../../../utils/other";

// TODO(传入schema格式对象，添加required字段)
export function addRequiredFiled(schema) {
  if (schema.type == "object") {
    schema.required = [];
    if (!isEmpty(schema.properties) && isEmpty(schema.required)) {
      for (let key in schema.properties) {
        schema.required.push(key);
        if (schema.properties[key].type instanceof Array) {
          // 解决存在多个类型问题(typeof数组返回object)
          schema.properties[key].type = "string";
        }
        if (schema.properties[key].type == "object") {
          addRequiredFiled(schema.properties[key]);
        } else if (schema.properties[key].type == "array") {
          addRequiredFiled(schema.properties[key]);
        }
      }
    }
  } else if (schema.type == "array") {
    if (!isUndefined(schema.items.oneOf)) {
      // 解决[]中传入类型不同时，默认数组类型为string
      schema.items = { type: "string" };
    }
    addRequiredFiled(schema.items);
  }
  return schema;
}

// TODO(高级设置-验证字符串||数组数据)
export function validateSchemaData(rule, value, callback) {
  if (isEmpty(value)) {
    callback();
  } else if (regNumber(value)) {
    callback(new Error("数据格式：数字"));
  } else if (parseInt(value) > 1000) {
    callback(new Error("数据大小限制在0 ~ 1000"));
  } else {
    callback();
  }
}

// TODO(高级设置-验证数值型数据)
export function validateSchemaNumber(rule, value, callback) {
  if (isEmpty(value)) {
    callback();
  } else if (regFloatNumber(value)) {
    callback(new Error("数据格式：浮点数"));
  } else if (
    parseFloat(value) > 9999999999 ||
    parseFloat(value) < -9999999999
  ) {
    callback(new Error("数据大小限制在-9999999999 ~ 9999999999间"));
  } else {
    callback();
  }
}

// TODO(高级设置-验证数值型枚举数据)
export function validateSchemaNumberEnum(rule, value, callback) {
  if (isEmpty(value)) {
    callback();
  } else if (regFloatNumber(value.replace(/\n/g, ""))) {
    callback(new Error("数据格式：浮点数"));
  } else {
    callback();
  }
}
// TODO(验证浮点型默认值)
export function validateNumberDefault(value) {
  if (isEmpty(value)) {
    return true;
  } else if (regFloatNumber(value)) {
    showMessage("数据格式：浮点数", "warning");
    value = "";
    return false;
  } else if (value > 9999999999 || value < -9999999999) {
    showMessage("数据大小限制在-9999999999 ~ 9999999999间", "warning");
    value = "";
    return false;
  }
  return true;
}
// TODO(验证整型默认值)
export function validateIntegerDefault(value) {
  if (isEmpty(value)) {
    return true;
  } else if (regIntegerNumber(value)) {
    showMessage("数据格式：整数", "warning");
    value = "";
    return false;
  } else if (value > 9999999999 || value < -9999999999) {
    showMessage("数据大小限制在-9999999999 ~ 9999999999间", "warning");
    value = "";
    return false;
  }
  return true;
}
