
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "名称"
  },
  "sort": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "排序"
  }
}

const enumConverter = {}

export { validator, enumConverter }
