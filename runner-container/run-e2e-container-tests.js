#!/usr/bin/node

const config = require("../wdio.conf");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const validUrl = require("valid-url");
var filenamifyUrl = require("filenamify-url");

const { getDateAndTime, dataFromArgsFile, log2Out, log2File, setPortalOptions } = require("../misc/functions");

const urls = dataFromArgsFile(2);
const userCommand = process.argv[3];

(async function run() {
  try {
    const commands = [
      "test:headless-home",
      "test:headless-all",
      "test:headless-biomarker-data",
      "test:headless-dashboard_management",
      "test:headless-rta",
      "test-reportportal:all",
      "test:headless-widget-dataset",
      "test-reportportal:widget-dataset",
      "test-reportportal:group-home"
      ];

    for (url of urls) {
      console.log(`Running tests for app ${url} in a separate container. This will take some time...`);
      // validate
      if (!validUrl.isWebUri(url)) {
        log2Out(url, "SKIPPED", `Invalid url "${url}"`);
        continue;
      }

      // run tests
      const command = userCommand ? userCommand.toLowerCase() : "";
      process.env.BASE_URL = url;
      let runCommand = "";

      // Makefile task have to contain "reportportal" snippet | TODO remake with more obviously condition
      if (process.argv[3] && process.argv[3].includes('reportportal')) {
        const {portalProject, portalEndpoint, tokenAccess} = await setPortalOptions();
        process.env.PORTAL_TOKEN = tokenAccess;
        process.env.PORTAL_ENDPOINT = portalEndpoint;
        process.env.PORTAL_PROJECT = portalProject;
      }

      switch (command) {
        case "all":
          console.log("===== USE command: npm run 'test:headless-all' =====");
          runCommand = commands[1];
          break;
        case "biomarker-data":
          console.log(
            "=====USE command:  npm run 'test:headless-biomarker-data' ====="
          );
          runCommand = commands[2];
          break;
        case "dashboard-management":
          console.log(
            "===== USE command:  npm run 'test:headless-dashboard_management' ====="
          );
          runCommand = commands[3];
          break;
        case "rta":
          console.log(
            "===== USE command:  npm run 'test:headless-rta' ====="
          );
          runCommand = commands[4];
          break;
        case "reportportal-all":
          console.log(
            "===== USE command:  npm run 'test-reportportal:all' ====="
          );
          runCommand = commands[5];
          break;
        case "widget-dataset":
          console.log(
            "===== USE command:  npm run 'test:headless-widget-dataset' ====="
          );
          runCommand = commands[6];
          break;
        case "reportportal-widget-dataset":
          console.log(
            "===== USE command:  npm run 'test-reportportal:widget-dataset' ====="
          );
          runCommand = commands[7];
          break;
        case "reportportal-grouphome":
          console.log(
              "===== USE command:  npm run 'test-reportportal:group-home' ====="
          );
          runCommand = commands[8];
          break;
        case "home":
          console.log("===== USE command:  npm run 'test:headless-home' =====");
          runCommand = commands[0];
          break;
        default:
          console.log(
            "===== USE DEFAULT command: npm run 'test:headless-home' ====="
          );
          runCommand = commands[0];
      }
      const { stdout, stderr, code } = shell.exec(`npm run ${runCommand}`, {silent: false});
      const logfile = filenamifyUrl(url, {replacement: '_'});

      if (code !== 0) {
        const s = "FAILED";
        const fpath = log2File(
          `${getDateAndTime()}-${logfile}`,
          s,
          `STDOUT:\n${stdout}\nSTDERR${stderr}`
        );
        log2Out(url, s, `Tests failed. Check "${fpath}" for details.`);
      } else {
        const s = "PASSED";
        const fpath = log2File(
          `${getDateAndTime()}-${logfile}`,
          s,
          `STDOUT:\n${stdout}\nSTDERR${stderr}`
        );
        log2Out(
          url,
          s,
          `All Tests passed successfully. Check "${fpath}" for details.`
        );
      }
    }
  } catch (err) {
    console.error("Unknown error", err);
  }
})();
