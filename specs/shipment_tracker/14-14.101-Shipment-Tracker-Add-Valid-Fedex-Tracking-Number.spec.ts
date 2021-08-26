import { ShipmentTracker } from "../../src/pages/ShipmentTracker"
import { longDelay, mediumDelay } from "../../src/misc/timeouts"
import { saveDifScreenshot, scipAndSaveScreenshot } from "../../src/misc/functions"

const ID: string = "14-14.101"

describe(`${ID}-[Main suite: Shipment Tracker - Add valid Fedex Number]`, function () {
    let isStepSkipped: boolean
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
    it("[Verification]: Add a new FEDEX tracking number: 'Add Tracking Number' should be closed after submiting and Tracking number should be added to Active Number table (Save screenshot).", function () {
        //Wait until button Add Tracking Number is Clickable
        const fedexValidNumbers = [ "170554596908", "170554634980", "113875250275",
                                    "124980326412", "113867913179", "113867913168", "815285101970"]
        try {
            const validNumber = ShipmentTracker.selectNoExistNumber(fedexValidNumbers, 2 * mediumDelay)[0]        
            console.log("Fedex Number to be used for the test: ", validNumber)            
            //Fill in Add Tracking Number form using no-existing in the Active Table tracking number
            ShipmentTracker.addServiceNumberAndSabmit("fedex", validNumber, longDelay)
            ShipmentTracker.isNumberExistOnTable(validNumber, 2 * mediumDelay)
            saveDifScreenshot(`${ID}-screenshot-shipment-tracker-valid-number-added`)
        } catch (e) {
            isStepSkipped = true
            scipAndSaveScreenshot(this, `Verification error: ${e}`, `${ID}-error-valid-number-not-added`)
        }        
    })
    it("[Verification]: User has the ability to change the number of 'show entries' in the Active table (Save screenshot).", function () {
        if (isStepSkipped) this.skip()
        
        ShipmentTracker.compareRowsAndEntriesCount(mediumDelay)
    })
})