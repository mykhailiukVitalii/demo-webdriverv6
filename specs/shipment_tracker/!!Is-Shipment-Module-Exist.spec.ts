import { BdmPage } from "../../src/pages/GeneralBdmPage"
import { longDelay } from "../../src/misc/timeouts"
import { ShipmentTracker } from "../../src/pages/ShipmentTracker"

describe('[Main suite: Shipment-Tracker Module is exist?]', function () {
    let currentSession: string

    after(function () {
        //Clear all sessions for test-user
        ShipmentTracker.cleanUpUserSessions(currentSession)
    })
    it('Go to the Home Application page.', function () {
        //Open Home page and get current "ring-session" value from Cookie
        currentSession = BdmPage.open()
    })   
    it('Does the application contain a Shipment-Tracker module?', function () {      
        try {            
            ShipmentTracker.shipmentHomeLink.waitForExist({ timeout: longDelay })
            browser.sharedStore.set('isShipmentExist', true)
            console.log('<-----!!![MESSAGE] : Current application contains Shipment-Tracker module!!!----->')            
        } catch (e) {
            browser.sharedStore.set('isShipmentExist', false)
            console.log('<-----!!![WARNING MESSAGE] : The current application does not contain a Shipment-Tracker module!!!----->')
            this.skip()
        }        
    })
})
