import { ShipmentTracker } from "../../src/pages/ShipmentTracker"
import { longDelay, mediumDelay } from "../../src/misc/timeouts"
import { saveDifScreenshot, scipAndSaveScreenshot, compareElementList } from "../../src/misc/functions"
import * as chai from 'chai'

const ID: string = "14-14.102"

describe(`${ID}-[Main suite: Shipment Tracker - Exist FEDEX Number]`, function () {
    let currentSession: string
    
    before(function () {
        //Comment out the "if" section if you need to run only THIS file
        ShipmentTracker.skipIfShipmentModuleNoExist(this)
        //Open Shipment Tracker page and get current "ring-session" value from Cookie
        currentSession = ShipmentTracker.open()
    })
    after(function () {
        //Clear all sessions for test-user
        ShipmentTracker.cleanUpUserSessions(currentSession)
    })
    it('[Precondition]: Wait until the menu disappears.', function () {
        //Wait for the collapse menu to clossed
        ShipmentTracker.closeMenu(longDelay)
    })
    it("[Verification]: By default the 'show entries' dropdow nmenu includes next options: 15, 25, 50, 100 (Save screenshot).", function () {
        const defaultList = ["15", "25", "50", "100"]
        //Get List of available 'show entries' options
        const entriesList = ShipmentTracker.showEntriesValue(mediumDelay)
        saveDifScreenshot(`${ID}-screenshot-available-show-entries-list`)
        chai.expect(compareElementList(defaultList, entriesList)).to.be.true
    })
    it("[Verification]: Enter the number that already exists in the ‘Active Tracking Number’ TAB - The Error modal window is shown and contains the message: 'The tracking number you have entered already exists in the system.' (Save screenshot).", function () {
        const exception = "The tracking number you have entered already exists in the system."
        try {
            //Find exist number
            const number = ShipmentTracker.firstExistServiceNumber("FEDEX")
            console.log("Existing Fedex Number in the Active Table: ", number)            
            //Fill in Add Tracking Number form using existing in the Active Table tracking number
            ShipmentTracker.addNumberAndSabmitOnly("fedex", number, longDelay)
            const originalError = ShipmentTracker.getModalExceptionMessage(longDelay)
            saveDifScreenshot(`${ID}-screenshot-shipment-modal-with-exist-userexception-message`)
            console.log(`Original error from the Error Modal: ${originalError}`)
            chai.expect(originalError).to.equal(exception)
        } catch (e) {
            scipAndSaveScreenshot(this, `Verification error: ${e}`, `${ID}-error-exist-userexception-message`)
        }
    })
})