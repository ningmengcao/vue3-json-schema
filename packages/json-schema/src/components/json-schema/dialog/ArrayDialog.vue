<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-26 11:01:42
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:09:37
 * @Description: 高级设置(数组)
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\dialog\ArrayDialog.vue
-->
<template>
  <el-dialog
    v-model="arrayVisible"
    title="高级设置(数组)"
    width="600px"
    @open="onOpen"
    @close="onClose"
  >
    <el-form
      ref="elFormRef"
      :model="formData"
      :rules="rules"
      size="small"
      label-width="120px"
    >
      <el-form-item label="最小元素个数：" prop="minItems">
        <el-input v-model="formData.minItems" clearable></el-input>
      </el-form-item>
      <el-form-item label="最大元素个数：" prop="maxItems">
        <el-input v-model="formData.maxItems" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, onMounted, toRefs } from "vue";
import { validateSchemaData } from "../js/json-schema";
import { ADVANCED_SETTING_FORMAT } from "../js/schema-constant";
import {
  isUndefined,
  resetForm,
  submitRulesForm,
} from "../../../utils/validate";
import _ from "lodash";
import bus from "../../../utils/mitt-bus";
import { ElDialog, ElInput, ElButton, ElForm, ElFormItem } from "element-plus";

export default {
  name: "ArrayDialog",
  components: {
    ElDialog,
    ElInput,
    ElButton,
    ElForm,
    ElFormItem,
  },
  props: {
    visible: { type: Boolean, default: false }, // 控制弹窗
    initData: { type: Object, default: () => {} }, // 初始数据
  },
  emits: ["update:visible"],
  setup(props, context) {
    // ************************************************数据声明******************************************
    const elFormRef = ref(null); // 表单dom
    // TODO(定义数据变量)
    let data = reactive({
      arrayVisible: false,
      enableEnum: false, // 是否枚举
      formData: { minItems: "", maxItems: "" }, // 表单
      rules: {
        minItems: [
          { validator: validateSchemaData, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (parseInt(value) > parseInt(data.formData.maxLength)) {
                callback(new Error("最小元素个数不能大于最大元素个数"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        maxItems: [
          { validator: validateSchemaData, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (parseFloat(value) < parseFloat(data.formData.minItems)) {
                callback(new Error("最大元素个数不能小于最小元素个数"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      }, // 验证规则
      formatOptions: ADVANCED_SETTING_FORMAT, // 格式选项
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {
      data.arrayVisible = props.visible;
    });
    // ************************************************方法声明******************************************
    // TODO(弹窗打开的回调)
    const onOpen = () => {
      const { minItems, maxItems } = props.initData;
      if (isUndefined(minItems)) {
        data.formData.minItems = "";
      } else {
        data.formData.minItems = minItems;
      }

      if (isUndefined(maxItems)) {
        data.formData.maxItems = "";
      } else {
        data.formData.maxItems = maxItems;
      }
    };
    // TODO(弹窗关闭的回调)
    const onClose = () => {
      if (elFormRef.value) {
        resetForm(elFormRef);
      }
      close();
    };

    // TODO(确定)
    const handleConfirm = async () => {
      if (await submitRulesForm(elFormRef)) {
        const newData = _.cloneDeep(data.formData);
        bus.$emit(`schema-update-${props.initData.editorId}`, {
          eventType: "save-setting",
          ...props.initData, // 之前的参数
          newData, // 设置数据
        });

        close();
      }
    };
    // TODO(关闭)
    const close = () => {
      context.emit("update:visible", false);
    };

    return {
      elFormRef,
      ...toRefs(data),
      onOpen,
      onClose,
      handleConfirm,
      close,
    };
  },
};
</script>

<style scoped lang="scss"></style>
