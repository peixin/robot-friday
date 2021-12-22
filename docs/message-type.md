- StandUpMeeting
  * url
  * image
  * title
  * description
  ```json
  {
    "msgtype": "news",
    "news": {
      "articles": [
        {
          "title": "站会了!",
          "url": "https://www.bing.com/search?q=%E5%AE%89%E7%BA%B3%E8%A5%BF&form=hpcapt&mkt=zh-cn",
          "picurl": "https://www.bing.com/th?id=OHR.AnnecyFrance_ZH-CN5773797252_1024x768.jpg&rf=LaDigue_1024x768.jpg&pid=hp",
          "description": "投射在安纳西中皇岛墙上的雪景影像，法国上萨瓦省 (© blickwinkel/Alamy)"
        }
      ]
    }
  }
  ```

- Diff
  * title
  * mentioned_list
  ```json
  {
    "msgtype": "text",
    "text": {
      "content": "今天 diff 吗？",
      "mentioned_list": [
        "xxx"
      ]
    }
  }
  ```

- WorkingDayOnWeekend
  * title
  * mentioned_list
  ```json
  {
    "msgtype": "text",
    "text": {
      "content": "温馨提示，明天要上班的哦！",
      "mentioned_list": [
        "@all"
      ]
    }
  }
  ```

- HolidayGreeting
  * url
  * image
  * title
  * description
  ```json
  {
    "msgtype": "news",
    "news": {
      "articles": [
        {
          "description": "中华人民共和国，中央人民政府，在今天成立了。",
          "picurl": "https://bkimg.cdn.bcebos.com/pic/8ad4b31c8701a18b3c766b6d932f07082838fe77?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UyNzI=,g_7,xp_5,yp_5/format,f_auto",
          "title": "国庆节快乐",
          "url": "http://tv.cctv.com/2019/09/16/VIDEjGRd3W7UdoXzGrZDAwmq190916.shtml"
        }
      ]
    }
  }
  ```