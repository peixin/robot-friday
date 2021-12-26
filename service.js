const axios = require("axios");
const utils = require("./utils");

const generateDiffMessage = () => {
  const mentionedMobileList = utils.parseEnvList(process.env.MENTIONED_MOBILE_LIST);
  const mentionedList = utils.parseEnvList(process.env.MENTIONED_LIST);
  const userOpenIds = utils.parseEnvList(process.env.MENTIONED_USER_IDS);

  return { userOpenIds, mentionedList, mentionedMobileList, message: "今天 diff 吗？" };
};

const _getBingDailyImage = async () => {
  let imageInfo = null;
  try {
    const { data } = await axios.get("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN");
    imageInfo = data["images"][0];
  } catch (e) {
    console.error(e);
  }

  if (imageInfo) {
    return {
      picurl: `https://www.bing.com${imageInfo["url"]}`.replace(/1920x1080/g, "1024x768"),
      url: imageInfo["copyrightlink"],
      description: imageInfo["copyright"],
    };
  } else {
    return {
      picurl: "https://img1.baidu.com/it/u=3070195245,3772896671&fm=26&fmt=auto&gp=0.jpg",
      url: "https://en.wikipedia.org/wiki/Stand-up_meeting",
      description:
        'A stand-up meeting (or simply "stand-up") is a meeting in which attendees typically participate while standing. The discomfort of standing for long periods is intended to keep the meetings short.',
    };
  }
};

const generateStandUpMeetingMessage = async () => {
  const imageInfo = await _getBingDailyImage();
  imageInfo.title = "站会了!";
  return imageInfo;
};

const generateWeekendWorkingMessage = () => {
  return {
    message: "温馨提示，明天要上班的哦！",
  };
};

const generateHolidayGreeting = (holidayName) => {
  let greeting = "快乐";

  if (["清明节", "端午节"].includes(holidayName)) {
    greeting = "安康";
  }

  let jsonData = [];
  try {
    jsonData = require("./holidays-info.json");
  } catch {
    console.warn(`no holidays-info.json`);
  }

  const holidayInfo = jsonData.find((info) => info.name === holidayName);
  const payload = { title: `${holidayName}${greeting}` };

  if (holidayInfo) {
    Object.assign(payload, {
      description: utils.sample(holidayInfo.desc),
      url: holidayInfo.link,
      picurl: holidayInfo.pic,
    });
  }
  return payload;
};

module.exports = {
  generateDiffMessage,
  generateWeekendWorkingMessage,
  generateHolidayGreeting,
  generateStandUpMeetingMessage,
};
