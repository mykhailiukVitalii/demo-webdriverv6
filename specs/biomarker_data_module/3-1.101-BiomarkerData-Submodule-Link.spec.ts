import { BdmPage } from "../../src/pages/GeneralBdmPage"
import { longDelay } from "../../src/misc/timeouts"
import { saveDifScreenshot, findByContainsText } from "../../src/misc/functions"

const ID: string = "3-1.101"

describe(`${ID}-[Main suite: Home Page Submodule Layout]`, function () {
    let currentSession: string

    before(function () {
         //Open BDM app page and get current "ring-session" value from Cookie
        BdmPage.open()
    })
    after(function () {
       //Clear all sessions for test-user
       BdmPage.cleanUpUserSessions(currentSession)
    })    
    describe('Move cursor on the "Biomarker Data Management" Access Module', function () {
        it('[Precondition]: Wait until the "Biomarker Data Management" is displayed.', function () {
            // Move cursor on the "Biomarker Data Management"
            const widgetSubmoduleItem = findByContainsText(".widget-news-content h3", "Biomarker Data Management")[0]
            widgetSubmoduleItem.waitForDisplayed({ timeout: longDelay })
            widgetSubmoduleItem.moveTo()
            browser.pause(1500)
        })
        //List of DEFAULT fields that can be expanded as necessary
        it('[Verification]: Left submodules: the first element is labeled “Data Upload"', function () {
            saveDifScreenshot(`${ID}-screenshot-biomarkerdata-access-submodules-items`)
            expect(BdmPage.dataUploadLink).toHaveText("Data Upload")
        })
        it('[Verification]: Left submodules: the second element is labeled “Data Download"', function () {
            expect(BdmPage.dataDownloadLink).toHaveText("Data Download")
        })
        it('[Verification]: Left submodules: the third element is labeled “Transfer Logs"', function () {
            expect(BdmPage.dataTransferLogLink).toHaveText("Transfer Logs")
        })
    })
})