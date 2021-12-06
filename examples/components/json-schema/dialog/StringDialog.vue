<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-24 09:43:24
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:04:49
 * @Description: 高级设置(字符串)
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\dialog\StringDialog.vue
-->
<template>
  <el-dialog
    v-model="stringVisible"
    title="高级设置(字符串)"
    width="600px"
    @open="onOpen"
    @close="onClose"
  >
    <el-form
      ref="elFormRef"
      :model="formData"
      :rules="rules"
      size="small"
      label-width="100px"
      class="schema-dialog"
    >
      <div class="display-flex">
        <el-form-item label="最小长度：" prop="minLength">
          <el-input v-model="formData.minLength" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="最大长度："
          prop="maxLength"
          class="margin-left-xs"
        >
          <el-input v-model="formData.maxLength" clearable></el-input>
        </el-form-item>
      </div>
      <el-form-item label="格式：" prop="format">
        <el-select v-model="formData.format" clearable multiple>
          <el-option
            v-for="(item, index) in formatOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="enum">
        <template #label>
          <span>
            枚举
            <el-checkbox
              v-model="enableEnum"
              label="："
              @change="formData.enum = ''"
            ></el-checkbox>
          </span>
        </template>
        <el-input
          v-model="formData.enum"
          placeholder="请输入枚举，一行一条数据"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }"
          :disabled="!enableEnum"
        ></el-input>
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
import {
  isEmpty,
  isUndefined,
  resetForm,
  submitRulesForm,
} from "../../../utils/validate";
import { ADVANCED_SETTING_FORMAT } from "../js/schema-constant";
import { validateSchemaData } from "../js/json-schema";
import _ from "lodash";
import bus from "../../../utils/mitt-bus";
import {
  ElDialog,
  ElInput,
  ElCheckbox,
  ElSelect,
  ElOption,
  ElButton,
  ElForm,
  ElFormItem,
} from "element-plus";

export default {
  name: "StringDialog",
  components: {
    ElDialog,
    ElInput,
    ElCheckbox,
    ElSelect,
    ElOption,
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
      stringVisible: false,
      enableEnum: false, // 是否枚举
      formData: { minLength: "", maxLength: "", enum: "", format: [] }, // 表单
      rules: {
        minLength: [
          { validator: validateSchemaData, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (parseInt(value) > parseInt(data.formData.maxLength)) {
                callback(new Error("最小长度不能大于最大长度"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        maxLength: [
          { validator: validateSchemaData, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (parseInt(value) < parseInt(data.formData.minLength)) {
                callback(new Error("最大长度不能小于最小长度"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        enum: [
          {
            validator: (rule, value, callback) => {
              if (data.enableEnum && isEmpty(value.trim())) {
                callback(new Error("枚举值不能为空"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      }, // 验证规则
      formatOptions: ADVANCED_SETTING_FORMAT, // 格式选项
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {
      data.stringVisible = props.visible;
    });
    // ************************************************方法声明******************************************
    // TODO(弹窗打开的回调)
    const onOpen = () => {
      const { minLength, maxLength, format } = props.initData;
      if (isUndefined(minLength)) {
        data.formData.minLength = "";
      } else {
        data.formData.minLength = minLength;
      }

      if (isUndefined(maxLength)) {
        data.formData.maxLength = "";
      } else {
        data.formData.maxLength = maxLength;
      }

      if (isUndefined(format)) {
        data.formData.format = [];
      } else {
        data.formData.format = format;
      }

      let enumValue = props.initData.enum;
      if (isUndefined(enumValue) || isEmpty(enumValue)) {
        data.formData.enum = "";
      } else {
        data.formData.enum = enumValue.join("\n");
        data.enableEnum = true;
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

        if (newData.enum) {
          newData.enum = _.compact(newData.enum.split("\n"));
        }

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
      close,
      handleConfirm,
    };
  },
};
</script>

<style scoped lang="scss">
.schema-dialog {
  :deep(.el-checkbox) {
    vertical-align: middle;
  }
  :deep(.el-checkbox__label) {
    padding-left: 0;
  }
  :deep(.el-form-item--small .el-form-item__label) {
    text-align: right;
  }
  :deep(.el-select--small) {
    width: 100%;
  }
}
</style>
