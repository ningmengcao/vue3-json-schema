/*
 * @Author: zhaoshengnan
 * @Date: 2021-12-02 17:20:50
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-02 17:20:51
 * @Description: file content
 * @FilePath: \vue3-json-schema\src\utils\other.js
 */
import { ElMessage } from "element-plus";
/**
 * @description 显示提示消息
 * @param msg 消息提示
 * @param msgType 消息类型
 */
export function showMessage(msg, msgType) {
  ElMessage({ message: msg, duration: 1500, type: msgType });
}
