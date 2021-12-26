const BasePlatform = require("./base");
const { MessageType } = require("../message");

class PlatformLark extends BasePlatform {
  constructor(messageType) {
    super(messageType);
    this.sendURL = process.env.LARK_ROBOT_HOOK_URL;
  }
}

module.exports = PlatformLark;

PlatformLark.prototype[`get${MessageType.StandUpMeeting}`] = ({ title, url, picurl, description }) => {
  return {
    msg_type: "post",
    content: {
      post: {
        zh_cn: {
          title: title,
          content: [
            [
              {
                tag: "a",
                text: "[CLICK TO VIEW IMAGE]",
                href: picurl,
              },
            ],
            [],
            [
              {
                tag: "a",
                text: description,
                href: url,
              },
            ],
            [],
            [
              {
                tag: "at",
                user_id: "all",
              },
            ],
          ],
        },
      },
    },
  };
};

PlatformLark.prototype[`get${MessageType.Diff}`] = ({ userOpenIds, message }) => {
  const payload = {
    msg_type: "post",
    content: {
      post: {
        zh_cn: {
          title: message,
          content: [],
        },
      },
    },
  };

  if (userOpenIds && userOpenIds.length) {
    payload.content.post.zh_cn.content.push(
      userOpenIds.map((id) => {
        return {
          tag: "at",
          user_id: id,
        };
      })
    );
  }
  return payload;
};

PlatformLark.prototype[`get${MessageType.WorkingDayOnWeekend}`] = ({ message }) => {
  return {
    msg_type: "post",
    content: {
      post: {
        zh_cn: {
          title: message,
          content: [
            [
              {
                tag: "at",
                user_id: "all",
              },
            ],
          ],
        },
      },
    },
  };
};

PlatformLark.prototype[`get${MessageType.HolidayGreeting}`] = ({ title, description, url, picurl }) => {
  const payload = {
    msg_type: "post",
    content: {
      post: {
        zh_cn: {
          title: title,
          content: [],
        },
      },
    },
  };

  if (description) {
    payload.content.post.zh_cn.content.push(
      [
        {
          tag: "a",
          text: "[CLICK TO VIEW IMAGE]",
          href: picurl,
        },
      ],
      [],
      [
        {
          tag: "a",
          text: description,
          href: url,
        },
      ]
    );
  }

  return payload;
};
