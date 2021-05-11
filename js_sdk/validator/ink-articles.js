
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "user_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "defaultValue": {
      "$env": "uid"
    }
  },
  "keywords": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "关键词"
  },
  "title": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "标题"
  },
  "description": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "简介"
  },
  "article_url": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "链接"
  },
  "article_status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "value": 0,
            "text": "公有"
          },
          {
            "value": 1,
            "text": "私有"
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "文章状态"
  },
  "view_count": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "阅读数量"
  },
  "like_count": {
    "rules": [
      {
        "format": "int"
      }
    ]
  },
  "publish_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "defaultValue": {
      "$env": "now"
    },
    "label": "发表时间"
  },
  "last_modify_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "defaultValue": {
      "$env": "now"
    },
    "label": "最后修改时间"
  },
  "mode": {
    "rules": [
      {
        "format": "number"
      }
    ],
    "label": "排版显示模式"
  }
}

const enumConverter = {
  "article_status_valuetotext": {
    "0": "公有",
    "1": "私有"
  }
}

export { validator, enumConverter }
