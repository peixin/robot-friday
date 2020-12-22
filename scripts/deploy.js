const fs = require("fs");
const path = require("path");
const tencentcloud = require("tencentcloud-sdk-nodejs");
const rootDir = path.dirname(__dirname);

const { name, version } = require(path.join(rootDir, "package.json"));
const { Client } = tencentcloud.scf.v20180416;

const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_CLOUD_OPS_SECRET_ID,
    secretKey: process.env.TENCENT_CLOUD_OPS_SECRET_KEY
  },
  region: "ap-guangzhou",
  profile: {
    signMethod: "HmacSHA256",
    httpProfile: {
      reqMethod: "POST",
      reqTimeout: 60
    }
  }
};
let client = new Client(clientConfig);

const getCode = () => {
  const packageFileName = `${name}-v${version}.zip`;
  const code = fs.readFileSync(packageFileName).toString("base64");
  return code;
};

const updateCode = async () => {

  const request = {
    Version: "2018-04-16",
    Namespace: "default",
    Handler: "index.main",
    FunctionName: "robot-friday",
    InstallDependency: "TRUE",
    ZipFile: getCode()
  };
  const response = await client.UpdateFunctionCode(request);

  console.log(response);
};

updateCode();


