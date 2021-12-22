## Lark

[发送更个性化的消息](https://www.feishu.cn/hc/zh-CN/articles/360024984973#lineguid-CdVcCt)
### text
```json
{
  "msg_type": "text",
  "content": {
    "text": "request example"
  }
}
```


### post
```json
{
  "msg_type": "post",
  "content": {
    "title": "title",
    "post": {
      "zh_cn": {
        "content": [
          [
            {
              "tag": "text",
              "text": "text"
            },
            {
              "tag": "at",
              "user_id": "user_id or open_id or all"
            }
          ]
        ]
      }
    }
  }
}
```


### interactive
```json
{
  "msg_type": "interactive",
  "card": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "content": "#👋\n[Link](https://google.com)",
          "tag": "lark_md"
        }
      }
    ],
    "header": {
      "title": {
        "content": "this is header",
        "tag": "plain_text"
      }
    }
  }
}
```