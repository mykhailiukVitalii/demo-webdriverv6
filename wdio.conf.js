process.env.TS_NODE_FILES = true;
require("ts-node").register({ files: true });

let { chromeArgs } = require('./wdio-utils');
let chromeDefaultArgs = [
  "--lang=en",
  "--silent",
  "--disable-popup-blocking",
  "--disable-extensions",
];

// Max time for single test case execution
let timeout = process.env.DEBUG ? 99999999 : 240000;
const elementTimeout = 20000;

let sendDataToDahboard = process.env.SEND_TO_REPORTPORTAL ? true : false;

exports.config = {
  sendDataToDahboard: sendDataToDahboard,
  // ====================
  // Runner Configuration
  // ====================
  runner: "local",
  //
  // =====================
  // Server Configurations
  // =====================
  //hostname: 'localhost',
  port: 4444,
  path: "/wd/hub",
  //
  // ==================
  // Specify Test Files
  // ==================
  specs: ["./specs/**/*.ts"],
  suites: {
    dashboard_management: ["./specs/dashboard_management_module/*.spec.ts"],
    biomarker_data: [
      "./specs/biomarker_data_module/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
      //'./specs/biomarker_data_module/3-1.131-BiomarkerData-One-Filter-Clinical-Select.spec.ts'
    ],
    home: ["./specs/home_module/*.spec.ts"],
    real_time_analysis: [
      "./specs/real_time_analysis/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
      // './specs/real_time_analysis/7-15.713-Realtime-Base-Study-Summary-Add-Reference-Two-Lines.spec.ts'
    ],
    real_time_analysis_part_2: [
      "./specs/real_time_analysis_part_2/*.spec.ts"
    ],
    widget_dataset: [
      "./specs/widget_dataset/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
    ],
    msi: [
      "./specs/master_sample_inventory/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
      // './specs/master_sample_inventory/14-4-402-SIM-Master-Sample-Inventory-Create-Subject-Selection.spec.ts'
    ],
    sim: [
      "./specs/sim_module/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
      //'./specs/sim_module/14-3.101-SIM-Patient-Forms-Main-Elements.spec.ts'
    ],
    shipment: [
      "./specs/shipment_tracker/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
      // './specs/shipment_tracker/14-14.107-Shipment-Tracker-Add-Exist-Fedex-Tracking-Number.spec.ts'
    ],
    query_tracker: [
      "./specs/query_tracker/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
      // './specs/query_tracker/14.15.401-SIM-Query-Tracker-Reopen-Link.spec.ts'
    ],
    fcytometry: [
      "./specs/flow_cytometry/*.spec.ts",
      //or run simple file using debug mode and full path to file, e.g:
      // './specs/flow_cytometry/6-1.201-Flow-Cytometry-Choose-Population-Cross-Sample.spec.ts'
    ],
  },
  // Patterns to exclude.
  // exclude: [
  // ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [
    {
      // maxInstances can get overwritten per capability. So if you have an in-house Selenium
      // grid with only 5 firefox instances available you can make sure that not more than
      // 5 instances get started at a time.
      maxInstances: 1,
      browserName: "chrome",
      "goog:chromeOptions": {
        args: chromeDefaultArgs.concat(chromeArgs),
        excludeSwitches: ["enable-automation"],
        // disable asper while running tests
        prefs: {
          protocol_handler: {
            excluded_schemes: {
              fasp: false
            }
          }
        }
      }
      // If outputDir is provided WebdriverIO can capture driver session logs
      // it is possible to configure which logTypes to include/exclude.
      // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
      // excludeDriverLogs: ['bugreport', 'server'],
    }
  ],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "warn",
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: process.env.BASE_URL || "http://localhost:3020/apps/v2/p4m/bdm-demo/",
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: elementTimeout,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count: connectionRetryCount: 3, -//default value
  connectionRetryCount: 2,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  // //services: ['selenium-standalone'],
  services: [["selenium-standalone"], "shared-store"],
  // services: [
  //     ['chromedriver', {
  //         args: ['--silent']
  //     }],
  //     [TimelineService]
  // ],
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: "mocha",
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  //reporters: ['spec'],
  reporters: [
    "spec",
  ],
  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: "bdd",
    timeout: timeout,
  },
  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: function (config, capabilities) {
    console.log(`[Version 05.20.2021-1.1: mocha_timeout=${timeout}] Tests execution will take some time...`);
  },
  /**
   * Gets executed before a worker process is spawned and can be used to initialise specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {String} cid      capability id (e.g 0-0)
   * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {[type]} specs    specs to be run in the worker process
   * @param  {[type]} args     object that will be merged with the main configuration once worker is initialised
   * @param  {[type]} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  beforeSession: function (config, capabilities, specs) {
    require("expect-webdriverio").setOptions({ wait: 15000, interval: 500 });
    console.log("Send Data To Dashboard? : ", this.sendDataToDahboard);
  },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before: function (capabilities, specs) {
    browser.setWindowSize(1920, 1080);
    //browser.maximizeWindow();
    //TODO: remove from config file
    browser.addCommand("waitMediumDelayAndClick", function (element, selector = null) {
      let message = `Could not click on element: "${element}" after delay = 5000. Double-check the presence of the element on the page.`
      if (selector) message = `Selector: "${selector}" after delay = 5000. Double-check the presence of the element on the page.`
      try {
        //Wait selector using medium timeline
        element.waitForClickable({ timeout: 5000 });
        //Click on the element
        element.click();
      } catch (e) {
        throw new Error(message)
      }
    })
  },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Hook that gets executed before the suite starts
   * @param {Object} suite suite details
   */
  // beforeSuite: function (suite) {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  beforeTest: function (test, context) {
    browser.setTimeout({ implicit: 500 });
  },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context) {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function (test, context, { error, result, duration, passed, retries }) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine).
   */
  // afterTest: function(test, context, { error, result, duration, passed, retries }) {
  // },
  // afterTest: function (test, context, { error, passed }) {
  //   // if (!passed) {
  //   //   //const filename = `./screens-failed/fail-screnshot-${Date.now()}.png`
  //   //   //browser.saveScreenshot(filename)
  //   // }
  // },
  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  onComplete: function (exitCode, config, capabilities, results) {
    console.log(
      "<-----WEB APP URL----->",
      process.env.URL_POSTFIX || `Default baseUrl: ${this.baseUrl}"`
    );
  },
  /**
   * Gets executed when a refresh happens.
   * @param {String} oldSessionId session ID of the old session
   * @param {String} newSessionId session ID of the new session
   */
  //onReload: function(oldSessionId, newSessionId) {
  //}
};
