const axios = require("axios");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const DATE_FORMAT = "YYYY-MM-DD";
const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || "Asia/Shanghai";
const HOLIDAY_DATA_PATH = "./chinese-holidays-data/data/${year}.json";
const ROBOT_KEY = process.env.ROBOT_KEY || "";
const MENTIONED_MOBILE_LIST = (process.env.MENTIONED_MOBILE_LIST || "")
  .trim()
  .split("|")
  .map((mobile) => mobile.trim())
  .filter((mobile) => mobile);

let holidayMap = null;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(DEFAULT_TIMEZONE);

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

const checkIsWeekendWorkingDay = (localDate) => {
  const isWorkingDay = checkIsWorkingDay(localDate);
  const isWeekend = checkIsWeekend(localDate);

  return isWeekend && isWorkingDay;
};

const postMessageToRobot = async (data) => {
  console.log("data:");
  console.log(data);
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

const generateDiffMessage = () => {
  return {
    msgtype: "text",
    text: {
      content: "今天 diff 吗？",
      mentioned_mobile_lists: MENTIONED_MOBILE_LIST,
    },
  };
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

module.exports = {
  checkIsWorkingDay,
  checkIsWeekendWorkingDay,
  postMessageToRobot,
  generateDiffMessage,
  generateWeekendWorkingMessage
};
