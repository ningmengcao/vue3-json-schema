/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-02 16:58:33
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-02 17:27:41
 * @Description: 验证文件
 * @FilePath: \vue3-json-schema\src\utils\validate.js
 */

// TODO(清除表单验证规则)
export function resetForm(formRef) {
  if (!formRef.value) return;
  return formRef.value.resetFields();
}

// TODO(确定提交表单验证)
export async function submitRulesForm(formRef) {
  let status = false;
  if (!formRef.value) return status;
  await formRef.value.validate((valid) => {
    status = valid;
  });
  return status;
}

// TODO(传递的参数为空)
export function isEmpty(value) {
  return (
    value === null ||
    value === "" ||
    value.length === 0 ||
    JSON.stringify(value) === "{}"
  );
}

// TODO(json格式校验 true: 检验不通过 false： 检验通过)
export function regJSON(str) {
  try {
    let obj = JSON.parse(str);
    if (typeof obj == "object" && obj) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    return true;
  }
}

// TODO(判断数据是否未定义)
export function isUndefined(value) {
  if (typeof value == "undefined") {
    return true;
  } else {
    return false;
  }
}

// TODO(正则整数)
export function regIntegerNumber(value) {
  let reg = /^(-?\d+)$/;
  return !reg.test(value) ? true : false;
}

// TODO(正则浮点数)
export function regFloatNumber(value) {
  let reg = /^(-?\d+(\.\d+)?)$/;
  return !reg.test(value) ? true : false;
}

// TODO(正则纯数字)
export function regNumber(value) {
  let reg = /^\d+$/;
  return !reg.test(value) ? true : false;
}
