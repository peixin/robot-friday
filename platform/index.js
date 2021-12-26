module.exports = (platform) => {
  switch (platform) {
    case "lark":
      return require("./lark");
      break;
    case "wecom":
      return require("./wecom");
      break;
  }
};
