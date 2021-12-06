<!--
 * @Author: zhaoshengnan
 * @Date: 2021-11-26 09:14:02
 * @LastEditors: zhaoshengnan
 * @LastEditTime: 2021-12-03 15:02:20
 * @Description: 高级设置(数值型)
 * @FilePath: \vue3-json-schema\packages\json-schema\src\components\json-schema\dialog\NumberDialog.vue
-->
<template>
  <el-dialog
    v-model="numberVisible"
    :title="numberTitle"
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
        <el-form-item label="最小值：" prop="minimum">
          <el-input v-model="formData.minimum" clearable></el-input>
        </el-form-item>
        <el-form-item label="最大值：" prop="maximum" class="margin-left-xs">
          <el-input v-model="formData.maximum" clearable></el-input>
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
  validateSchemaNumber,
  validateSchemaNumberEnum,
} from "../js/json-schema";
import { ADVANCED_SETTING_FORMAT } from "../js/schema-constant";
import {
  isEmpty,
  isUndefined,
  regIntegerNumber,
  resetForm,
  submitRulesForm,
} from "../../../utils/validate";
import _ from "lodash";
import bus from "../../../utils/mitt-bus";
import {
  ElCheckbox,
  ElDialog,
  ElInput,
  ElButton,
  ElForm,
  ElFormItem,
} from "element-plus";

export default {
  name: "NumberDialog",
  components: {
    ElCheckbox,
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
      numberVisible: false, // 控制弹窗显示
      enableEnum: false, // 是否枚举
      numberTitle: "", // 弹窗标题
      formData: { minimum: "", maximum: "", enum: "", format: [] }, // 表单
      rules: {
        minimum: [
          {
            validator: (rule, value, callback) => {
              if (isEmpty(value)) {
                callback();
              }
              if (props.initData.type == "integer") {
                if (regIntegerNumber(value)) {
                  callback(new Error("数据格式：整数"));
                }
              }
              if (parseFloat(value) > parseFloat(data.formData.maximum)) {
                callback(new Error("最小值不能大于最大值"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
          { validator: validateSchemaNumber, trigger: "blur" },
        ],
        maximum: [
          {
            validator: (rule, value, callback) => {
              if (isEmpty(value)) {
                callback();
              }
              if (props.initData.type == "integer") {
                if (regIntegerNumber(value)) {
                  callback(new Error("数据格式：整数"));
                }
              }
              if (parseFloat(value) < parseFloat(data.formData.minimum)) {
                callback(new Error("最大值不能小于最小值"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
          { validator: validateSchemaNumber, trigger: "blur" },
        ],
        enum: [
          {
            validator: (rule, value, callback) => {
              if (data.enableEnum) {
                if (isEmpty(value)) {
                  callback(new Error("枚举值不能为空"));
                }
                if (props.initData.type == "integer") {
                  if (regIntegerNumber(value.replace(/\n/g, ""))) {
                    callback(new Error("数据格式：整数"));
                  }
                }
              }
              callback();
            },
            trigger: "change",
          },
          { validator: validateSchemaNumberEnum, trigger: "blur" },
        ],
      }, // 验证规则
      formatOptions: ADVANCED_SETTING_FORMAT, // 格式选项
    });
    // ************************************************钩子函数******************************************
    onMounted(() => {
      data.numberVisible = props.visible;
    });
    // ************************************************方法声明******************************************
    // TODO(弹窗打开的回调)
    const onOpen = () => {
      const { minimum, maximum, format, type } = props.initData;
      if (isUndefined(minimum)) {
        data.formData.minimum = "";
      } else {
        data.formData.minimum = minimum;
      }

      if (isUndefined(maximum)) {
        data.formData.maximum = "";
      } else {
        data.formData.maximum = maximum;
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

      if (type === "number") {
        data.numberTitle = "高级设置(浮点型)";
      } else {
        data.numberTitle = "高级设置(整型)";
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
      handleConfirm,
      close,
    };
  },
};
</script>

<style scoped lang="scss">
.schema-dialog {
  :deep(.el-form-item) {
    margin-bottom: 25px;
  }
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
