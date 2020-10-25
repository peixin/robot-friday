const { isWorkingDay, postMessageToRobot } = require("./src/index.js");

const main = async (event, context) => {
  if (isWorkingDay()) {
    const result = await postMessageToRobot();
    return { code: 0, result };
  } else {
    return { code: 0, result:"today is not working day." };
  }
};


module.exports = main;

// if(require.main === module) {
//   main().then(console.log)
// }
