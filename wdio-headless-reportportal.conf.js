const reportportal = require('wdio-reportportal-reporter');
const RpService = require("wdio-reportportal-service");
let { chromeArgs } = require('./wdio-utils');
const path = require('path');
const fs = require('fs');
//Default wdio config
let wdioConfig = require("./wdio.conf").config;

let chromeDefaultArgs = [
    '--lang=en',
    '--no-sandbox',
    '--headless',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-popup-blocking',
    "--disable-dev-shm-usage",
];

const reportportalConfig = {
    reportPortalClientConfig: {
        token: process.env.PORTAL_TOKEN,
        endpoint: process.env.PORTAL_ENDPOINT,
        launch: 'superadmin_TEST_EXAMPLE',
        project: process.env.PORTAL_PROJECT,
        mode: 'DEFAULT',
        debug: false,
        description: "[Precision for Medicine] - Launch for basic test cases",
        attributes: [{key:"tags", value: "PFM"}]
    },
    reportSeleniumCommands: false, // add selenium commands to log
    seleniumCommandsLogLevel: 'debug', // log level for selenium commands
    autoAttachScreenshots: false, // automatically add screenshots
    screenshotsLogLevel: 'info', // log level for screenshots
    parseTagsFromTestTitle: false, // parse strings like `@foo` from titles and add to Report Portal
}
// Copying configuration
let headlessConfig = Object.assign({}, wdioConfig);
// Overriding some properties for CI runs
// if link A TEST_URL, use 'http://clojure:3020'... else localhost
headlessConfig.baseUrl = process.env.BASE_URL || "http://localhost:3020/apps/v2/p4m/bdm-demo/",
headlessConfig.suites.demo = [
    './specs/demo/demo1.spec.ts'
]
headlessConfig.capabilities[0] = {
    maxInstances: 1,
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: chromeDefaultArgs.concat(chromeArgs),
        excludeSwitches: ['enable-automation'],
        // disable asper while running tests
        prefs: {
            protocol_handler: { 
                excluded_schemes: { 
                    fasp: false 
                }                    
            } 
        }
    }
}
// console.log('Sync interval has been updated!')
headlessConfig.reporterSyncInterval = 20 * 1000 // in ms. default 1000
headlessConfig.reporterSyncTimeout = 20 * 1000 // in ms. default 5000
headlessConfig.services = [...headlessConfig.services, [RpService, {}]]
headlessConfig.reporters = [...headlessConfig.reporters, [reportportal, reportportalConfig]]
/**
 * Function to be executed after a test (in Mocha/Jasmine).
*/
headlessConfig.afterTest = function(test, context, {error, passed}){
    if (!passed) {
        const filename = `./screens-failed/fail-screnshot-${Date.now()}.png`;
        const outputFile = path.join(filename);
        browser.saveScreenshot(outputFile);
        reportportal.sendFileToTest(test, 'INFO', filename, fs.readFileSync(outputFile));
    }
}
 /**
 * Gets executed after all workers got shut down and the process is about to exit. An error
 * thrown in the onComplete hook will result in the test run failing.
 * @param {Object} exitCode 0 - success, 1 - fail
 * @param {Object} config wdio configuration object
 * @param {Array.<Object>} capabilities list of capabilities details
 * @param {<Object>} results object containing test results
*/
headlessConfig.onComplete = async function(exitCode, config) {
    const link = await RpService.getLaunchUrl(config);
    console.log(`Report portal link: ${link}`)
}

exports.config = headlessConfig;