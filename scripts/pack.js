const path = require("path");
const { execSync: execSyncOrigin } = require("child_process");

const rootDir = path.dirname(__dirname);
const info = require(path.join(rootDir, "package.json"));
const packageFileName = `${info.name}-v${info.version}`;

const showResult = (fn) => (...args) => {
  const result = fn(...args);
  if (result) {
    console.log(result.toString());
  }
  return result;
};

let execSync = showResult(execSyncOrigin);

const cleanPack = (cleanAll = false) => {
  execSync(`rm -rf ${packageFileName}.tgz package`);
  if (cleanAll) {
    execSync(`rm -rf ${packageFileName}.zip`);
  }
};

cleanPack(true);
execSync("yarn pack");

// tar xzf robot-friday-v1.0.0.tgz && zip a.zip $(tar tf robot-friday-v1.0.0.tgz | sed -e "s/package/./")
execSync(
  `tar xzf ${packageFileName}.tgz && zip ${packageFileName}.zip $(tar tf ${packageFileName}.tgz | sed -e "s/package/./")`
);

cleanPack();
