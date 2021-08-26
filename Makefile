TOPLEVEL := $(or $(TOPLEVEL),..)

include $(TOPLEVEL)/dockers/shared.mk

################# CONSTANTS ###########################################
DOCKER_COMPOSE=docker-compose
DEMO_DOCKER_COMPOSE_FILE=../demo/docker-compose.yml
DEMO_DOCKER_COMPOSE_OVERRIDE_FILE=../demo/docker-compose.override.yml
# currently we are reusing the demo docker-compose.yml and docker-compose.override.yml
E2E_EXEC=$(DOCKER_COMPOSE) -f $(DEMO_DOCKER_COMPOSE_FILE) -f $(DEMO_DOCKER_COMPOSE_OVERRIDE_FILE) exec e2e
E2E_CMD=cd runner-container && node run-e2e-container-tests.js container-urls.txt
######################### e2e TESTS ###############################

# go inside the test container

e2e/exec-bash:
	$(E2E_EXEC) bash

# Running all e2e tests using command: `npm run tests:run:headless:all`

e2e/exec-run-test:
	$(E2E_EXEC) npm test

# Running e2e tests for the Home Page suite only using the list of App UPLs[container-urls.txt]: `node run-e2e-container-tests.js container-urls.txt`

e2e/exec-run-test-using-list:
	$(E2E_EXEC) sh -c "$(E2E_CMD)"

# Running e2e tests for all suites using the list of App UPLs[container-urls.txt]: `node run-e2e-container-tests.js container-urls.txt all`

e2e/exec-run-test-using-list-all:
	$(E2E_EXEC) sh -c "$(E2E_CMD) all"


# Running e2e tests for different Data Selection options: `npm run tests:run:headless-widget-dataset`

e2e/exec-run-test-using-list-widget-dataset:
	$(E2E_EXEC) sh -c "$(E2E_CMD) widget-dataset"

# Running e2e tests for different Data Selection options and send to Dashboard: `tests:run:reportportal:widget-dataset`

e2e/exec-run-test-using-list-widget-dataset-to-dashboard:
	$(E2E_EXEC) sh -c "$(E2E_CMD) reportportal-widget-dataset"

# Running e2e tests for the Dashboard Management suite using the list of App UPLs[container-urls.txt]: `node run-e2e-container-tests.js container-urls.txt dashboard-management`

e2e/exec-run-test-using-list-dashboard:
	$(E2E_EXEC) sh -c "$(E2E_CMD) dashboard-management"

# Running e2e tests for the Biomarker Data suite using the list of App UPLs[container-urls.txt]: `node run-e2e-container-tests.js container-urls.txt biomarker-data`

e2e/exec-run-test-using-list-biomarker-data:
	$(E2E_EXEC) sh -c "$(E2E_CMD) biomarker-data"

# Running e2e tests for the Real Time Analysis suite using the list of App UPLs[container-urls.txt]: `node run-e2e-container-tests.js container-urls.txt rta`

e2e/exec-run-test-using-list-rta:
	$(E2E_EXEC) sh -c "$(E2E_CMD) rta"

# Running e2e tests for the Home Page suite only with reporting using Dashboard: `npm run tests:run:reportportal`

e2e/exec-run-test-with-dashboard:
	$(E2E_EXEC) npm run tests:run:reportportal

# Running e2e tests with reporting: `npm run tests:run:reportportal:all`

e2e/exec-run-test-with-reportportal-all:
	$(E2E_EXEC) sh -c "$(E2E_CMD) reportportal-all"

e2e/exec-run-test-with-reportportal-grouphome:
	$(E2E_EXEC) sh -c "$(E2E_CMD) reportportal-grouphome"

# Running e2e tests from a qbp server instance (dev, staging, prod, ...)

e2e/run-full-tests-from-qbp-server-using-list:	
	docker run --rm -it --network host \
	-v $(PWD):/home/docker/e2e-tests \
	qbp_e2e.$(UID) sh -c "$(E2E_CMD) all"

e2e/run-homepage-tests-from-qbp-server-using-list:	
	docker run --rm -it --network host \
	-v $(PWD):/home/docker/e2e-tests \
	qbp_e2e.$(UID) sh -c "$(E2E_CMD)"
