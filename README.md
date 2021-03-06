## `Friday` Robot for Team.

**Office Assistant `Friday`**
 ![Friday Image](http://public-assets.liupei.xin/github/repos/robot-friday/friday-icon/android-icon-96x96.png)



### Capability

- Workday code review reminders
- Reminder of weekend transfer



### Setup

- `yarn run pack`

- Tencent Cloud create SCF function

- upload `robot-friday-v${version}.zip` to scf function

- 'Upload Method' select 'Install dependencies online'

- Set environment variable
  * DEFAULT_TIMEZONE=Asia/Shanghai
  * MENTIONED_MOBILE_LIST=phone num 1|phone num 2|...
  * MENTIONED_LIST=user ID 1|user ID 2|...
  * ROBOT_KEY=xxx

- Set trigger
  
  * extra information
      * workingDayOnWeekend: remind if tomorrow is weekend but need to go to work
      * diff: workday remind diff
    
      e.g.
```
  name: workingDayOnWeekend
  cron syntax: 0 0 18 * * FRI,SAT *
  extra information: workingDayOnWeekend
  
  name: diff
  cron syntax: 0 0 14 * * * *
  extra information: diff
```



### Reference
- [WeChat Work Robot](https://work.weixin.qq.com/help?person_id=1&doc_id=13376)

- [crontab guru](https://crontab.guru/) 

- [chinese-holidays-data](https://github.com/bastengao/chinese-holidays-data)