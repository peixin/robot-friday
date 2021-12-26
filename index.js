require("dotenv").config();
const dayjs = require("dayjs");
const service = require("./service");
const utils = require("./utils");
const { MessageType } = require("./message");

const platforms = utils.parseEnvList(process.env.PLATFORMS);
const main = async (event, context) => {
  const now = dayjs();
  let message = null;
  let result = true;

  if (event.Message === MessageType.WorkingDayOnWeekend) {
    const tomorrow = now.add(1, "day");
    if (utils.checkIsWeekendWorkingDay(tomorrow)) {
      const payload = service.generateWeekendWorkingMessage();

      result = await utils.sendMessage(event.Message, payload, platforms);
      message = "tomorrow is weekend but need to working.";
    } else {
      message = "tomorrow is normal weekend.";
    }
  } else if (event.Message === MessageType.Diff) {
    if (utils.checkIsWorkingDay(now)) {
      const payload = service.generateDiffMessage();

      result = await utils.sendMessage(event.Message, payload, platforms);
      message = "today is working day, diff.";
    } else {
      message = "today is not working day.";
    }
  } else if (event.Message === MessageType.HolidayGreeting) {
    const holidayName = utils.checkIsHolidayFirstDay(now);

    if (holidayName) {
      const payload = service.generateHolidayGreeting(holidayName);

      result = await utils.sendMessage(event.Message, payload, platforms);
      message = `today is ${holidayName} first day.`;
    } else {
      message = "today is not holiday first day.";
    }
  } else if (event.Message === MessageType.StandUpMeeting) {
    if (utils.checkIsWorkingDay(now)) {
      const payload = await service.generateStandUpMeetingMessage();

      result = await utils.sendMessage(event.Message, payload, platforms);
      message = "today is working day, stand up meeting.";
    } else {
      message = "today is not working day.";
    }
  }

  console.log(`${result}:${message}`);
  return { result, message };
};

// main({ Message: "StandUpMeeting" });

// const _main = async () => {
//   // test date: 2021-10-08, 2021-10-01
//   const messages = [
//     MessageType.Diff,
//     MessageType.StandUpMeeting,
//     MessageType.WorkingDayOnWeekend,
//     MessageType.HolidayGreeting,
//   ];

//   for (const _messageType of messages) {
//     await main({ Message: _messageType });
//   }
// };
// _main();

module.exports = { main };
