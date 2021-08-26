import { DataDownload } from "../../src/pages/DataDownload"
import { saveDifScreenshot } from "../../src/misc/functions"
import { mediumDelay, longDelay } from "../../src/misc/timeouts"

const ID: string = "3-1.103"

describe(`${ID}-[Biomarker Data Management: Data Download]`, function () {
    let currentSession: string

    before(function () {
        //Open Data Download page and get current "ring-session" value from Cookie
        currentSession = DataDownload.open()
    })
    after(function () {
        //Clear all sessions for test-user
        DataDownload.cleanUpUserSessions(currentSession)
    })
    it('[Precondition]: Wait for the side menu to hide.', function () {
        //Close menu
        DataDownload.closeMenu(longDelay)
    })
    it('[Verification]: Left Side: "Clinical Data" TAB is displayed', function () {
        DataDownload.clinicalDataTab.waitForExist({ timeout: mediumDelay })
        expect(DataDownload.clinicalDataTab).toHaveText("Clinical Data")
    })
    it('[Verification]: "Clinical Data" section contains BASE table with info', function () {
        expect($$(".dataTables_wrapper")[0]).toBeDisplayed()
    })
    it('[Verification]: Right Side: "Raw Data" TAB is displayed', function () {
        expect(DataDownload.rawDataTab).toHaveText("Raw Data")
    })
    it('[Verification]: Right Side: "Raw Data" TAB is activated by default', function () {
        DataDownload.rawDataTab.scrollIntoView()
        saveDifScreenshot(`${ID}-screenshot-data-download-raw-active-by-default`)
        expect(DataDownload.rawDataTab).toHaveElementClass("active")
    })
    it('[Verification]: Right Side: "Processed Data" TAB is displayed', function () {
        expect(DataDownload.processwdDataTab).toHaveText("Processed Data")
    })
    it('[Verification]: If item in table "Clinical Data" is not selected, No data message is displayed in Raw Data table.', function () {
        DataDownload.rawDataTab.click()
        DataDownload.emptyDataTables.waitForExist({ timeout: longDelay })
        saveDifScreenshot(`${ID}-screenshot-data-download-empty-raw-data-section`)
        expect(DataDownload.emptyDataTables).toHaveText("No data available in table")
    })
    it('[Verification]: If item in table "Clinical Data" is not selected, No data message is displayed in Processed Data table.', function () {
        DataDownload.processwdDataTab.click()
        DataDownload.emptyDataTables.waitForExist({ timeout: longDelay })
        saveDifScreenshot(`${ID}-screenshot-data-download-empty-processed-data-section`)
        expect(DataDownload.emptyDataTables).toHaveText("No data available in table")
    })
})