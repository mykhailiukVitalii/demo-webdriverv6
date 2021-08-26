import { BdmPage } from "../../src/pages/GeneralBdmPage"
import { RealTimeAnalysis } from "../../src/pages/RealTimeAnalysis"
import { longDelay } from "../../src/misc/timeouts"

describe('[Main suite: Real-time Analysis and Visualization Module is exist?]', function () {   
    let currentSession: string

    after(function () {
        //Clear all sessions for test-user
        RealTimeAnalysis.cleanUpUserSessions(currentSession)
    })
    it('Go to the Home Application page.', function () {
        currentSession = BdmPage.open()
    })
    it('Does the application contain a Real-time Analysis module?', function () {             
        try {            
            RealTimeAnalysis.realTimeModuleHeader.waitForExist({ timeout: longDelay })
            browser.sharedStore.set('isRealTimeExist', true)
            console.log('<-----!!![WARNING MESSAGE] : The current application contains module Real-time Analysis and Visualization!!!----->')            
        } catch (e) {
            browser.sharedStore.set('isRealTimeExist', false)
            console.log('<-----!!![WARNING MESSAGE] : The current application does not contain a Real-time Analysis and Visualization module!!!----->')
            this.skip()
        }        
    })
})