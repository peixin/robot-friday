const dayjs = require("dayjs");
const {
  postMessageToRobot,
  checkIsWeekendWorkingDay,
  checkIsWorkingDay,
  generateDiffMessage,
  generateWeekendWorkingMessage,
} = require("./lib.js");

const main = async (event, context) => {
  const now = dayjs();
  let message = null;
  let result = true;

  if (event.Message === "workingDayOnWeekend") {
    const tomorrow = now.add(1, "day");
    if (checkIsWeekendWorkingDay(tomorrow)) {
      result = await postMessageToRobot(generateWeekendWorkingMessage());
      message = "tomorrow is weekend but need to working.";
    } else {
      message = "tomorrow is normal weekend.";
    }
  } else if (event.Message === "diff") {
    if (checkIsWorkingDay(now)) {
      result = await postMessageToRobot(generateDiffMessage());
      message = "today is working day, diff.";
    } else {
      message = "today is not working day.";
    }
  }

  return { result, message };
};

module.exports = { main };
