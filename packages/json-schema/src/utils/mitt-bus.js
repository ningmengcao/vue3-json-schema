/*
 * @Author: zhaoshengnan
 * @Date: 2021-11-17 16:16:04
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-02 17:12:55
 * @Description: mitt组件通信实现全局事件
 * @FilePath: \vue3-json-schema\src\utils\mitt-bus.js
 */

import mitt from "mitt";

const _emitter = mitt();
const bus = {};
bus.$emit = _emitter.emit; // 订阅
bus.$on = _emitter.on; // 绑定事件
bus.$off = _emitter.off; // 取消事件

export default bus;
