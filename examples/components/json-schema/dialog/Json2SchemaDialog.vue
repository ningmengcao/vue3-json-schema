<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-22 11:33:17
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:01:40
 * @Description: 导入json（Json2Schema）
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\dialog\Json2SchemaDialog.vue
-->
<template>
  <el-dialog
    v-model="schemaVisible"
    title="导入json"
    width="600px"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <VAceEditor
      v-model:value="jsonString"
      :options="editorOptions"
      lang="json"
      theme="chrome"
      class="editor-height border-silver"
    ></VAceEditor>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="json2schema">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, onMounted, toRefs } from "vue";
import { showMessage } from "../../../utils/other";
import { regJSON } from "../../../utils/validate";
// 代码编辑器
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-json";

import { EDITOR_OPTIONS } from "../js/schema-constant";
import generateSchema from "generate-schema";
import { addRequiredFiled } from "../js/json-schema";

import { ElDialog, ElButton } from "element-plus";

export default {
  name: "Json2Schema",
  components: {
    VAceEditor,
    ElDialog,
    ElButton,
  },
  props: {
    visible: { type: Boolean, default: () => false }, // 控制弹窗显示
  },
  emits: ["json2schema", "update:visible"],
  setup(props, context) {
    // ************************************************数据声明******************************************
    // TODO(定义数据变量)
    let data = reactive({
      schemaVisible: props.visible,
      jsonString: "", // json字符串
      editorOptions: EDITOR_OPTIONS, // 配置代码编辑器
      jsonSchemaObj: {}, // json schema对象
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {});
    // ************************************************方法声明******************************************
    const json2schema = async () => {
      if (regJSON(data.jsonString)) {
        return showMessage("请输入json格式的字符串", "warning");
      } else {
        let obj = JSON.parse(data.jsonString);
        let schema = generateSchema.json("title", obj); // json转json schema
        data.jsonSchemaObj = await addRequiredFiled(schema);
        context.emit("json2schema", data.jsonSchemaObj);
        close();
      }
    };
    const close = () => {
      data.schemaVisible = false;
      context.emit("update:visible", data.schemaVisible);
    };

    return { ...toRefs(data), json2schema, close };
  },
};
</script>

<style scoped lang="scss">
.editor-height {
  height: 230px;
}
</style>
