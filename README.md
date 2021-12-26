## `Friday` Robot for Team. 

基于云函数的 企业微信/飞书 机器人事件提醒

Cloud Function based WeCom/Lark robot message notification

**Office Assistant `Friday`**
 ![Friday Image](./android-icon-96x96.png)


### Capability

- Workday code review reminders
- Reminder of weekend transfer
- Reminder of standup everyday
- Reminder of holiday

### Capability
- WeCom 企业微信
- Lark 飞书

### Setup

- `yarn run pack`

- Tencent Cloud create SCF function

- upload `robot-friday-v${version}.zip` to scf function
- Or use Github Action see [.github](https://github.com/peixin/robot-friday/tree/master/.github/workflows)

- 'Upload Method' select 'Install dependencies online'

- Set environment variable
  * DEFAULT_TIMEZONE=Asia/Shanghai
  * MENTIONED_MOBILE_LIST=phone num 1|phone num 2|... // for wecom
  * MENTIONED_LIST=user ID 1|user ID 2|... // for wecom
  * MENTIONED_USER_IDS=user ID 1|user ID 2|... // for lark
  * PLATFORMS=lark|wecom
  * LARK_ROBOT_HOOK_URL=...
  * WECOM_ROBOT_HOOK_URL=...

- Set trigger
  
  * extra information
      * workingDayOnWeekend: remind if tomorrow is weekend but need to go to work
      * diff: workday remind diff
    
      e.g.
      ```
      name: StandUpMeeting
      cron syntax: 0 30 9 * * * *
      extra information: StandUpMeeting

      name: Diff
      cron syntax: 0 0 14 * * * *
      extra information: Diff

      name: HolidayGreeting
      cron syntax: 0 30 8 * * * *
      extra information: HolidayGreeting

      name: WorkingDayOnWeekend
      cron syntax: 0 0 18 * * FRI,SAT *
      extra information: WorkingDayOnWeekend
      ```



### Reference
- [WeCom Robot](https://work.weixin.qq.com/api/doc/90000/90136/91770)

- [Lark Robot](https://www.feishu.cn/hc/zh-CN/articles/360024984973)

- [crontab guru](https://crontab.guru/) 

- [chinese-holidays-data](https://github.com/bastengao/chinese-holidays-data)