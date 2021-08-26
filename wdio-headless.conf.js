let wdioConfig = require("./wdio.conf").config;
let { chromeArgs } = require('./wdio-utils');
// Copying configuration
let ciConfig = Object.assign({}, wdioConfig);

// Overriding some properties for CI runs
// Additional information for chrome capabilities
let chromeDefaultArgs = [
    '--lang=en',
    '--no-sandbox',
    '--headless',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-popup-blocking',
    '--disable-dev-shm-usage',
];

ciConfig.baseUrl = process.env.BASE_URL || "http://localhost:3020/apps/v2/p4m/bdm-demo/", //or 'http://clojure:3020' use Docker server URL.
ciConfig.suites.demo = [
    './specs/demo/demo1.spec.ts'
],
ciConfig.capabilities[0] = {
    maxInstances: 1,
    browserName: 'chrome',
    'goog:chromeOptions': {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        //args: ['--lang=en', '--silent', '--headless', '--disable-gpu', '--no-sandbox', '--disable-extensions'],
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
};

exports.config = ciConfig;