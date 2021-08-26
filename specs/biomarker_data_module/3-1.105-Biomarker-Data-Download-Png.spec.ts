import { DataDownload } from "../../src/pages/DataDownload"
import { Modal } from "../../src/page-components/Modal"
import { saveDifScreenshot, scipAndSaveScreenshot, waitForFileExist, rmTempdir, mkTempdir, setChromeConfigForDownloading } from "../../src/misc/functions"
import { mediumDelay, longDelay } from "../../src/misc/timeouts"

import * as chai from 'chai'
import * as path from 'path'

const tempfolder = "/tempDownload", downloadDir = path.join(__dirname, tempfolder)
const ID: string = "3-1.105"

describe(`${ID}-[Biomarker Data Management: Data Download]`, function () {

    let isStepSkipped: boolean = false, filepath: string = ""
    let currentSession: string

    before(function () {
        //Сlear temp folder
        rmTempdir(downloadDir)
        // Download File function: make sure that the download directory is existing
        mkTempdir(downloadDir)
        //Open Data Downlod page
        currentSession = DataDownload.open()
    })
    after(function () {
        //Сlear temp folder, comment out if necessary check the file locally
        rmTempdir(downloadDir)
        //Clear all sessions for test-user
        DataDownload.cleanUpUserSessions(currentSession)
    })
    it('[Precondition]: Wait until the menu disappears.', function () {
        //Close menu
        DataDownload.closeMenu(longDelay)
    })
    it('["Download File"] - Step 1: Select one element from the Clinical Data table; Open "Files Selection"(Raw Data) section; Fill in the "file type" field using tile-image (Save screenshot).', function () {
        if (isStepSkipped) this.skip()

        const filetype = "tile-image"
        try {
            filepath = DataDownload.getDownloadTileImageFile(filetype, longDelay)
            saveDifScreenshot(`${ID}-screenshot-data-download-selected-raw-file`)
        } catch (e) {
            isStepSkipped = true
            scipAndSaveScreenshot(this, `Step 1 error: ${e}`, `${ID}-error-step-1-screenshot-data-download-image`)
        }        
    })
    it('["Download File"] - Step 2: Scroll down to the Download Btn; Select Raw Files and save file(download image to local storage) (Save screenshot).', function () {
        if (isStepSkipped) this.skip()

        const fileName = path.basename(filepath)
        let isFileExist: boolean = false

        try {            
            //Wait when the button=Preview is clickable
            DataDownload.activateRawFileOption(mediumDelay * 2)
            browser.sendCommand('Page.setDownloadBehavior', { 'behavior': 'allow', 'downloadPath': downloadDir })
            browser.pause(1000)
            //If modal window throw an Error - close window
            if (Modal.isModalWindowDisplayed()) {
                Modal.getErrorMessageAndClose(mediumDelay)
                saveDifScreenshot(`${ID}-screenshot-data-download-modal-message`)
            } else {
                const filePath = path.join(downloadDir, `/${fileName}`)
                //Asynch method that waits for the file to be downloaded
                browser.call(async function () {
                    // call our custom function that checks for the file to exist(20 retries = 60sec)
                    isFileExist = await waitForFileExist(filePath, 20)
                })
            } 
        } catch (e) {
            scipAndSaveScreenshot(this, `Step 2 Download error: ${e}`, `${ID}-error-step-2-download-image`)
        }
        chai.expect(isFileExist).to.be.true
    })
})