const BasePlatform = require("./base");
const { MessageType } = require("../message");

class PlatformWecom extends BasePlatform {
  constructor(messageType) {
    super(messageType);
    this.sendURL = process.env.WECOM_ROBOT_HOOK_URL;
  }
}

module.exports = PlatformWecom;

PlatformWecom.prototype[`get${MessageType.StandUpMeeting}`] = ({ title, url, picurl, description }) => {
  return {
    msgtype: "news",
    news: {
      articles: [
        {
          title: title,
          url: url,
          picurl: picurl,
          description: description,
        },
      ],
    },
  };
};

PlatformWecom.prototype[`get${MessageType.Diff}`] = ({ mentionedMobileList, mentionedList, message }) => {
  const payload = {
    msgtype: "text",
    text: {
      content: message,
    },
  };
  if (mentionedMobileList && mentionedMobileList.length) {
    payload.text["mentioned_mobile_list"] = mentionedMobileList;
  }

  if (mentionedList && mentionedList.length) {
    payload.text["mentioned_list"] = mentionedList;
  }
  return payload;
};

PlatformWecom.prototype[`get${MessageType.WorkingDayOnWeekend}`] = ({ message }) => {
  return {
    msgtype: "text",
    text: {
      content: message,
      mentioned_list: ["@all"],
    },
  };
};

PlatformWecom.prototype[`get${MessageType.HolidayGreeting}`] = ({ title, description, url, picurl }) => {
  if (!description) {
    return {
      msgtype: "text",
      text: {
        content: title,
      },
    };
  } else {
    return {
      msgtype: "news",
      news: {
        articles: [
          {
            title: title,
            description: description,
            url: url,
            picurl: picurl,
          },
        ],
      },
    };
  }
};
