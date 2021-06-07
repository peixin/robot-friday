const axios = require("axios");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const DATE_FORMAT = "YYYY-MM-DD";
const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || "Asia/Shanghai";
const HOLIDAY_DATA_PATH = "./chinese-holidays-data/data/${year}.json";
const ROBOT_KEY = process.env.ROBOT_KEY || "";

let holidayMap = null;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(DEFAULT_TIMEZONE);

const sample = (array) => {
  const length = array == null ? 0 : array.length;
  return length ? array[Math.floor(Math.random() * length)] : undefined;
};

const getHolidayData = (localDate) => {
  if (holidayMap) {
    return holidayMap;
  }
  const year = localDate.year();
  holidayMap = {};
  let jsonData;
  try {
    jsonData = require(HOLIDAY_DATA_PATH.replace("${year}", year));
  } catch {
    console.warn(`not find json data file for ${year}`);
    return {};
  }

  jsonData.forEach((item) => {
    let [start, end] = item.range;
    if (!end) {
      end = start;
    }
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    const diff = endDate.diff(startDate, "day");
    for (let i = 0; i <= diff; i++) {
      const itemDate = startDate.add(i, "day");
      holidayMap[itemDate.format(DATE_FORMAT)] = item;
    }
  });
  return holidayMap;
};

const checkIsWeekend = (localDate) =>
  localDate.day() < 1 || localDate.day() > 5;

const checkIsWorkingDay = (localDate) => {
  const holidayMap = getHolidayData(localDate);
  const date = localDate.format(DATE_FORMAT);
  const dateWithHoliday = holidayMap[date];
  const isWeekend = checkIsWeekend(localDate);
  const isWorkingDay = !!(
    (!isWeekend && (!dateWithHoliday || dateWithHoliday.type !== "holiday")) ||
    (isWeekend && dateWithHoliday && dateWithHoliday.type !== "holiday")
  );

  console.log("localDate:", localDate.format());
  console.log("toISOString:", localDate.toISOString());
  console.log("format:", localDate.format(DATE_FORMAT));
  console.log("isWeekend:", isWeekend);
  console.log("isWorkingDay:", isWorkingDay);
  return isWorkingDay;
};

const checkIsHolidayFirstDay = (localDate) => {
  const holidayMap = getHolidayData(localDate);
  const date = localDate.format(DATE_FORMAT);
  const dateWithHoliday = holidayMap[date];
  if (
    dateWithHoliday &&
    dateWithHoliday.type === "holiday" &&
    dateWithHoliday.range[0] === date
  ) {
    return dateWithHoliday.name;
  }
  return null;
};

const checkIsWeekendWorkingDay = (localDate) => {
  const isWorkingDay = checkIsWorkingDay(localDate);
  const isWeekend = checkIsWeekend(localDate);

  return isWeekend && isWorkingDay;
};

const postMessageToRobot = async (data) => {
  console.log("data:");
  console.log(JSON.stringify(data));
  const options = {
    method: "post",
    baseURL: "https://qyapi.weixin.qq.com/cgi-bin/webhook",
    url: `/send`,
    params: {
      key: ROBOT_KEY,
    },
    data,
  };
  const { status } = await axios.request(options);
  return status === 200;
};

const parseMention = (mentions) =>
  (mentions || "")
    .trim()
    .split("|")
    .map((mobile) => mobile.trim())
    .filter((mobile) => mobile);

const generateDiffMessage = () => {
  const mentionedMobileList = parseMention(process.env.MENTIONED_MOBILE_LIST);
  const mentionedList = parseMention(process.env.MENTIONED_LIST);

  const payload = {
    msgtype: "text",
    text: {
      content: "今天 diff 吗？",
    },
  };

  if (mentionedMobileList.length) {
    payload.text["mentioned_mobile_list"] = mentionedMobileList;
  }

  if (mentionedList.length) {
    payload.text["mentioned_list"] = mentionedList;
  }

  return payload;
};

const getBingDailyImage = async () => {
  const { data } = await axios.get(
    "http://bing.getlove.cn/latelyBingImageStory"
  );
  const image = data[0];
  if (image) {
    return {
      picurl: `https://www.bing.com${image["url"]}`,
      url: `https://www.bing.com${image["copyrightLink"]}`,
      description: image["copyright"],
    };
  } else {
    return {
      picurl:
        "https://img1.baidu.com/it/u=3070195245,3772896671&fm=26&fmt=auto&gp=0.jpg",
      url: "https://en.wikipedia.org/wiki/Stand-up_meeting",
      description:
        'A stand-up meeting (or simply "stand-up") is a meeting in which attendees typically participate while standing. The discomfort of standing for long periods is intended to keep the meetings short.',
    };
  }
};

const generateStandUpMeetingMessage = async () => {
  const imageInfo = await getBingDailyImage();

  const payload = {
    msgtype: "news",
    news: {
      articles: [
        {
          title: "站会了!",
          url: imageInfo.url,
          picurl: imageInfo.picurl,
          description: imageInfo.description,
        },
      ],
    },
  };
  return payload;
};

const generateWeekendWorkingMessage = () => {
  return {
    msgtype: "text",
    text: {
      content: "温馨提示，明天要上班的哦！",
      mentioned_list: ["@all"],
    },
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
  if (!holidayInfo) {
    return {
      msgtype: "text",
      text: {
        content: `${holidayName}${greeting}`,
      },
    };
  } else {
    return {
      msgtype: "news",
      news: {
        articles: [
          {
            title: `${holidayName}${greeting}`,
            description: sample(holidayInfo.desc),
            url: holidayInfo.link,
            picurl: holidayInfo.pic,
          },
        ],
      },
    };
  }
};

module.exports = {
  checkIsWorkingDay,
  checkIsWeekendWorkingDay,
  postMessageToRobot,
  generateDiffMessage,
  generateWeekendWorkingMessage,
  checkIsHolidayFirstDay,
  generateHolidayGreeting,
  generateStandUpMeetingMessage,
};
