## WeCom

[消息类型及数据格式](https://work.weixin.qq.com/api/doc/90000/90136/91770#%E6%B6%88%E6%81%AF%E7%B1%BB%E5%9E%8B%E5%8F%8A%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F)
### news
```json
{
  "msgtype": "news",
  "news": {
    "articles": [
      {
        "title": "title",
        "url": "https://www.bing.com/search?q=%E5%AE%89%E7%BA%B3%E8%A5%BF&form=hpcapt&mkt=zh-cn",
        "picurl": "https://www.bing.com/th?id=OHR.AnnecyFrance_ZH-CN5773797252_1024x768.jpg&rf=LaDigue_1024x768.jpg&pid=hp",
        "description": "description"
      }
    ]
  }
}
```


### text
```json
{
  "msgtype": "text",
  "text": {
    "content": "text",
    "mentioned_list": [
      "xxx"
    ]
  }
}
```