<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-18 14:12:41
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:00:53
 * @Description: BasicDialog
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\dialog\BasicDialog.vue
-->
<template>
  <div>
    <el-dialog
      v-model="basicDialogVisible"
      :title="title"
      width="30%"
      :before-close="close"
    >
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        style="margin-bottom: 15px"
      ></el-input>
      <template #footer>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from "vue";
import bus from "../../../utils/mitt-bus";
import {
  validateIntegerDefault,
  validateNumberDefault,
} from "../js/json-schema";
import { ElDialog, ElInput, ElButton } from "element-plus";
export default {
  name: "BasicDialog",
  components: {
    ElDialog,
    ElInput,
    ElButton,
  },
  props: {
    visible: { type: Boolean, default: false }, // 控制弹窗
    initData: { type: Object, default: () => ({ title: "提示", value: "" }) }, // 初始数据
  },
  emits: ["update:initData", "update:visible"],
  setup(props, context) {
    // ************************************************数据声明******************************************
    // TODO(定义数据变量)
    let data = reactive({
      basicDialogVisible: props.visible,
      content: props.initData.value, // 内容
      title: props.initData.title, // 初始数据
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {});
    // ************************************************方法声明******************************************
    // 确定
    const handleOk = () => {
      let newData = props.initData;

      if (newData.type == "integer") {
        if (!validateIntegerDefault(data.content)) {
          return;
        }
      } else if (newData.type == "number") {
        if (!validateNumberDefault(data.content)) {
          return;
        }
      }

      newData.value = data.content;
      bus.$emit(`schema-update-${props.initData.editorId}`, {
        eventType: "save-showedit",
        ...newData,
      });
      context.emit("update:initData", newData);
      close();
    };
    // 取消
    const close = () => {
      context.emit("update:visible", false);
    };

    return { ...toRefs(data), handleOk, close };
  },
};
</script>

<style scoped lang="scss"></style>
