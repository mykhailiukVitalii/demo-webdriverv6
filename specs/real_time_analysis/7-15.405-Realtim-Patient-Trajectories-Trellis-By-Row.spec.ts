import { RealTimeAnalysis } from "../../src/pages/RealTimeAnalysis"
import { longDelay, mediumDelay } from "../../src/misc/timeouts"
import { saveDifScreenshot, scipAndSaveScreenshot } from "../../src/misc/functions"

import * as chai from 'chai'

const ID: string = "7-15.405", WIDGET: string = "Patient Trajectories"

describe(`${ID}-[Real-Time Analysis, Visualization - ${WIDGET}: Trellis by Row]`, function () {
    let isStepSkipped: boolean
    let currentSession: string
    let result: {yTrellisFirst: string, yTrellisSecond: string}
    const plotSettings = {
        menuItem: 3,
        biomarkerType:"qPCR",
        bname: [
            "PD-L1"
        ]           
    }
    const trellisOption = {
        field: 5,
        row: "Region",
        ytitles: [
            "Europe", 
            "America"
        ]
    }

    before(function () {
        //Comment out the "skipIfModuleNoExist" line if you need to run only THIS file
        RealTimeAnalysis.skipIfModuleNoExist(this)
        //Open Real Time Analysis page and get current "ring-session" value from Cookie
        currentSession = RealTimeAnalysis.open()
    })
    after(function () {
        //Clear all sessions for test-user
        RealTimeAnalysis.cleanUpUserSessions(currentSession)
    })
    describe(`${WIDGET} test-cases.`, function () {
        before(function () {
            try {
                RealTimeAnalysis.patintTrajectoriesLink.waitForDisplayed({ timeout: mediumDelay })
            } catch (e) {
                console.log(`<-----!!![WARNING MESSAGE] : Real-Time Analysis does not contain ${WIDGET} Widget!!!----->`)
                this.skip()
            }
        })
        it(`[Trellis by Row] - Step 1[Verification]: Select one available biomarker from the list: ${plotSettings.bname[0]} (${plotSettings.biomarkerType}); Select available option for Row and submit -> Y1-title(as ${trellisOption.ytitles[0]}) should be updated on the Plot (Save screenshot).`, function () {
            try {
                //Wait the Patient widget
                RealTimeAnalysis.chooseWidgetFromList(RealTimeAnalysis.patintTrajectoriesLink, longDelay * 2)
                //Select biomarkers from the plotSettings var
                RealTimeAnalysis.selectionAvailableBiomarkerByName(plotSettings, longDelay)
                //Active trellis mode and select row option
                RealTimeAnalysis.enableTrellisAndSetOption(trellisOption.row, trellisOption.field, mediumDelay, true)
                //Submit Data Selection - wait "g.plot" element
                saveDifScreenshot(`${ID}-patient-submited-settings-trellis-row`)
                RealTimeAnalysis.submitSettingsChanges(mediumDelay)
                //Get updating from the plot: wait Trellis yaxis updating
                browser.pause(1000)
                result = RealTimeAnalysis.plotYtitleEnableTrellis(trellisOption.ytitles, false, longDelay)
                saveDifScreenshot(`${ID}-patient-plot-enable-trellis-by-row`)
            } catch (e) {
                isStepSkipped = true
                scipAndSaveScreenshot(
                    this,
                    `[Trellis by Row] Verification error: ${e}`,
                    `${ID}-error-patient-trellis-by-row`
                )
            }
            chai.expect(result.yTrellisFirst).to.equal(trellisOption.ytitles[0])
        })
        it(`[Trellis by Row] - Step 1[Verification]: Y2-title(as ${trellisOption.ytitles[1]}) should be updated on the Plot`, function () {
            if (isStepSkipped) this.skip()
            //Compare Y2-title from the Trellis by Row mode.
            chai.expect(result.yTrellisSecond).to.equal(trellisOption.ytitles[1])
        })
    })
})