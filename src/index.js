const axios = require("axios");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const ROBOT_KEY = process.env.ROBOT_KEY || "";
const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || "Asia/Shanghai";
const HOLIDAY_DATA_PATH = "../chinese-holidays-data/data/${year}.json";
const DATE_FORMAT = "YYYY-MM-DD";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(DEFAULT_TIMEZONE);

const getHolidayData = (year) => {
  let jsonData;
  try {
    jsonData = require(HOLIDAY_DATA_PATH.replace("${year}", year));
  } catch {
    console.warn(`not find json data file for ${year}`);
    return {};
  }

  const holidayMap = {};

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

const isWorkingDay = () => {
  const localDate = dayjs();
  const year = localDate.year();
  const date = localDate.format(DATE_FORMAT);
  const isWeekend = localDate.day() < 1 || localDate.day() > 5;
  const holidayMap = getHolidayData(year);
  const dateWithHoliday = holidayMap[date];
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

const postMessageToRobot = async (event, context) => {
  const options = {
    baseURL: "https://qyapi.weixin.qq.com/cgi-bin/webhook",
    url: `/send`,
    params: {
      key: ROBOT_KEY
    },
    data: {
      msgtype: "text",
      text: {
        content: "今天 diff 吗？",
      },
    },
  };
  const {status, data} = await axios.post(options);
  return status === 200;
};

module.exports = {
  isWorkingDay,
  postMessageToRobot,
};
