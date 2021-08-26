Mocha WebdriverIO WEB Testing
====================
WEB tests with Mocha, WebdriverIO v6 and PageObject

## Features
- UI-test suites: WebdriverIO v6 / Mocha / Typescript;
- Using Page Object
- Dashboard: using reportportal.io

## [Local Machine]
## RUN Demo suites using headless config
## First step - start server from the demo/ folder

`cd /demo && make full-start` OR `cd /demo && make start/quick/repl`

## Second step - install all dependencies to run tests

`npm i`

## End - run demo tests with headless options

`cd demo/ && make e2e/run-test-using-list`

## [e2e_demo Container]

**0. Pulling E2E image from project-repo:docker.tib.aws.precisionformedicine.com/qbp/platform-dev**
- (SET  /dockers/base/Makefile => IMAGES=e2e and SET  /dockers/Makefile => IMAGES_TO_FIX=e2e). Run into /dockers/ folder:
  `make pull_images`

**1. Full start PROJECT using re-init DB:**
- stop previously created containers(if exist from folder /demo):
  `make quick_stop down`
- delete data from DB(folder /demo): 
  `make volumes/delete/all`
- ***!!!!!!! if needed - update submodule***
  `git submodule update --recursive`
-  re-build PROJECT(folder /demo):
  `make full-start`
-  re-init DB(open folder /demo in new console TAB): 
  `make bdm/setup`

  **2. Running tests using URLS list:**
- open  e2e-tests/runner-container folder, find container-urls.txt and leave `http://clojure:3020/apps/v2/p4m/bdm-demo/` for master or SET production/staging link
- run tests for HOME page in container(folder /demo): 
  `make e2e/run-test-using-list`

**2.1 Running other modules:**
-  Run tests for /biomarker_data_module & /dashboard_management_module & /real_time_analysis  specs:
  `make e2e/run-test-using-list-all` 
-  Run tests for /widget_dataset specs:
   `make e2e/run-test-using-list-widget-dataset`