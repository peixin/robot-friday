const getPlatform = require("./platform");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { HOLIDAY_DATA_PATH, DATE_FORMAT } = require("./constant");

const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || "Asia/Shanghai";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(DEFAULT_TIMEZONE);

const sendMessage = async (messageType, payload, platforms) => {
  const results = platforms.map(async (platform) => {
    const Klass = getPlatform(platform);
    return await new Klass(messageType).generateMessage(payload).send();
  });

  return (await Promise.all(results)).every((result) => result);
};

const sample = (array) => {
  const length = array == null ? 0 : array.length;
  return length ? array[Math.floor(Math.random() * length)] : undefined;
};

const checkIsWeekend = (localDate) => localDate.day() < 1 || localDate.day() > 5;

const parseEnvList = (values, split = "|") => {
  return (values || "")
    .trim()
    .split(split)
    .map((value) => value.trim())
    .filter((value) => value);
};

let holidayMap = null;
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
  if (dateWithHoliday && dateWithHoliday.type === "holiday" && dateWithHoliday.range[0] === date) {
    return dateWithHoliday.name;
  }
  return null;
};

const checkIsWeekendWorkingDay = (localDate) => {
  const isWorkingDay = checkIsWorkingDay(localDate);
  const isWeekend = checkIsWeekend(localDate);

  return isWeekend && isWorkingDay;
};

module.exports = {
  sendMessage,
  sample,
  checkIsWeekend,
  parseEnvList,
  checkIsWorkingDay,
  checkIsHolidayFirstDay,
  checkIsWeekendWorkingDay,
};
