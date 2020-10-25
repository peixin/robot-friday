const request = require("request");
const ROBOT_KEY =
  process.env.ROBOT_KEY || "";
const TIMEZONE_OFFSET = process.env.TIMEZONE_OFFSET || 0;
const HOLIDAY_DATA_PATH = "../chinese-holidays-data/data/${year}.json";
const ONE_DAY_TIMES = 60 * 60 * 24 * 1000;
const DATE_FORMAT = "yyyy-MM-dd";

Date.prototype.format = function (format) {
  const date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[k]
          : ("00" + date[k]).substr(("" + date[k]).length)
      );
    }
  }
  return format;
};

const getLocalDate = () => {
  const timezoneOffset = TIMEZONE_OFFSET * 60 * 60 * 1000;
  const localTime = new Date(new Date("2020-10-10").getTime() + timezoneOffset);
  return localTime;
};

const getHolidayData = (year) => {
  let jsonData;
  try {
    jsonData = require(HOLIDAY_DATA_PATH.replace("${year}", year));
  } catch {
    console.warn(`not find json data file for ${year}`)
    return {};
  }
  
  const holidayMap = {};

  jsonData.forEach((item) => {
    const [start, end] = item.range;
    if (!end) {
      holidayMap[start] = item;
    } else {
      const startDate = new Date(start);
      const endDate = new Date(end);

      for (
        let rangeDate = startDate.getTime();
        rangeDate <= endDate.getTime();
        rangeDate += ONE_DAY_TIMES
      ) {
        holidayMap[new Date(rangeDate).format(DATE_FORMAT)] = item;
      }
    }
  });

  return holidayMap;
};

const isWorkingDay = () => {
  const localDate = getLocalDate();
  const year = localDate.getFullYear();
  const date = localDate.format(DATE_FORMAT);
  const isWeekend = localDate.getDay() < 1 || localDate.getDay() > 5;
  const holidayMap = getHolidayData(year);
  const dateWithHoliday = holidayMap[date];
  const isWorkingDay = !!(
    (!isWeekend && (!dateWithHoliday || dateWithHoliday.type !== "holiday")) ||
    (isWeekend && dateWithHoliday && dateWithHoliday.type !== "holiday")
  );

  console.log("TIMEZONE_OFFSET:", TIMEZONE_OFFSET);
  console.log("localDate:", localDate);
  console.log("toISOString:", localDate.toISOString());
  console.log("format:", localDate.format(DATE_FORMAT));
  console.log("isWeekend:", isWeekend);
  console.log("isWorkingDay:", isWorkingDay);
  return isWorkingDay;
};

const postMessageToRobot = async (event, context) => {
  const options = {
    url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${ROBOT_KEY}`,
    json: {
      msgtype: "text",
      text: {
        content: "今天 diff 吗？",
      },
    },
  };

  const result = await request.post(options);
  return "ok";
};

module.exports = {
  isWorkingDay,
  postMessageToRobot
};
