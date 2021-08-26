const fs = require("fs");
const shell = require("shelljs");
const EOL = require("os").EOL;
const fetch = require('node-fetch');

export const readUrlsFileSync = (filename) => {
  let urls = [];
  try {
    if (fs.existsSync(filename)) {
      // run sync function to read file
      const dataJson = JSON.parse(
        fs.readFileSync(filename, { encoding: "utf8" })
      );
      urls = dataJson.URLS;
    } else {
      console.error(`File that URL_LIST path: ${filename} does not exist`);
    }
  } catch (err) {
    console.error(err);
  }

  return urls;
};

export const dataFromArgsFile = (index) => {
  let data = [];
  const path = process.argv[index];
  try {
    if (fs.existsSync(path)) {
      data = fs
        .readFileSync(path, "utf8")
        .split(EOL)
        .filter((s) => s);
    } else {
      console.error(
        `File containing a list of URLs [path: ${path}] does not exist!`
      );
    }
  } catch (err) {
    console.error(err);
  }

  return data;
};

export const simpleResultFileHandler = (fileName, message) => {
  fs.appendFile(fileName, message, (err) => {
    if (err) throw err;
    console.log(`====== Data has been added to ${fileName}! ======`);
  });
};

export const deleteFileHandler = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      console.log(`Remove exists ${path} before testing!`);
    } else {
      console.error(
        "File that contains simple test-suit info does not exist before!"
      );
    }
  } catch (err) {
    console.error(err);
  }
};

export const getDateAndTime = () => {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  const date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  const year = date_ob.getFullYear();
  // current hours
  let hours = date_ob.getHours();
  // current minutes
  let minutes = date_ob.getMinutes();

  return `${year}-${month}-${date}_${hours}_${minutes}`
};

export const execCommand = (command, resultFilePath, appName) => {
  const { exec, echo } = shell;

  if (exec(command).code !== 0) {
    echo(
      "Errors: Test scripts contains fail tests or errors. For more information, see the logs."
    );
    simpleResultFileHandler(
      resultFilePath,
      `[${getDateAndTime()}]:${appName} : Test suite has one or more errors. Status = FAIL \n`
    );
  } else {
    console.log("===== Test passed without errors =====");
    simpleResultFileHandler(
      resultFilePath,
      `[${getDateAndTime()}]:${appName} : All test from the test suite are Passed. Stataus = PASS \n`
    );
  }
};

export const log2Out = (url, s, m) => {
  console.log(`${url} [${s}]\t${m}`);
}

export const log2File = (fname, s, m) => {
  var dir = "./container-log";
  const flogfile = `${dir}/${fname}-${s}.log`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(flogfile, m, {
    flag: "w",
    encoding: "utf8",
  });
  return flogfile;
}

export const setPortalOptions = async function () {
  let url = process.env.RP_ENDPOINT
  let username = process.env.RP_USER;
  let password = process.env.RP_PASS;
  let project = process.env.RP_PROJECT;
  let basic_cred = 'ui:uiman'; // Basic report portal username and password for authorization header
  let buff = new Buffer.from(basic_cred);
  let basic_cred_base64 = buff.toString('base64');

  try {
    const fetch_bearer = await fetch(url + "/uat/sso/oauth/token", {
      "headers": {
        "authorization": "Basic " + basic_cred_base64, // Default credential in base64 to get token access
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": 'grant_type=password&username=' + username + '&password=' + password,
      "method": "POST"
    })
    const fetch_bearer_res = await fetch_bearer.json()
    const bearer = fetch_bearer_res['access_token']
    const fetch_api_token = await fetch(url + "/uat/sso/me/apitoken", {
      "headers": {"authorization": 'bearer ' + bearer},
      "method": "POST",
    })
    const fetch_api_token_res = await fetch_api_token.json();
    return {
      portalProject: project || username + '_personal',
      tokenAccess: fetch_api_token_res['access_token'],
      portalEndpoint: url + '/api/v1'
    }
  } catch(e) {
    (["ENOTFOUND"].includes(e.code)) 
        ? console.log(`Error code ${e.code}: Reportportal Service is not running. Error message: ${e.message}`)
        : console.log(e)
  }
}

export const extractAuthParams = (authString) => {
  let [user, pass] = authString.split(":");

  return {
    auth: {
      user, pass
    }
  };
};