const dayjs = require("dayjs");
const {
  postMessageToRobot,
  checkIsWeekendWorkingDay,
  checkIsWorkingDay,
  checkIsHolidayFirstDay,
  generateDiffMessage,
  generateWeekendWorkingMessage,
  generateHolidayGreeting,
  generateStandUpMeetingMessage,
} = require("./lib.js");

const main = async (event, context) => {
  const now = dayjs();
  let message = null;
  let result = true;

  if (event.Message === "WorkingDayOnWeekend") {
    const tomorrow = now.add(1, "day");
    if (checkIsWeekendWorkingDay(tomorrow)) {
      result = await postMessageToRobot(generateWeekendWorkingMessage());
      message = "tomorrow is weekend but need to working.";
    } else {
      message = "tomorrow is normal weekend.";
    }
  } else if (event.Message === "Diff") {
    if (checkIsWorkingDay(now)) {
      result = await postMessageToRobot(generateDiffMessage());
      message = "today is working day, diff.";
    } else {
      message = "today is not working day.";
    }
  } else if (event.Message === "HolidayGreeting") {
    const holidayName = checkIsHolidayFirstDay(now);

    if (holidayName) {
      result = await postMessageToRobot(generateHolidayGreeting(holidayName));
      message = `today is ${holidayName} first day.`;
    } else {
      message = "today is not holiday first day.";
    }
  } else if (event.Message === "StandUpMeeting") {
    if (checkIsWorkingDay(now)) {
      result = await postMessageToRobot(await generateStandUpMeetingMessage());
      message = "today is working day, stand up meeting.";
    } else {
      message = "today is not working day.";
    }
  }
  return { result, message };
};

// main({ Message: "StandUpMeeting" });

module.exports = { main };
