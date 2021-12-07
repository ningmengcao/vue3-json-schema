# vue3-json-schema

## 安装

```
 npm install vue3-json-schema or yarn add vue3-json-schema
```

1. 安装使用会报错，使用请看源码
2. 基于element-plus@1.1.0-beta.12封装的组件，请安装 element-plus

### 使用

```
  <vue3-json-schema
    v-model:schema="jsonSchema"
    @schema-change="changeSchema"
  ></vue3-json-schema>

```

1. v-model:schema: 初始类型必须为 object,如： { type: "object", title: "title", properties: {} }
2. schema-change: 更新 schema 内容

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
