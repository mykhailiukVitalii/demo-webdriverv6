import { RealTimeAnalysis } from "../../src/pages/RealTimeAnalysis"
import { Chart } from "../../src/pages/Chart"
import { longDelay, mediumDelay } from "../../src/misc/timeouts"
import { saveDifScreenshot, scipAndSaveScreenshot } from "../../src/misc/functions"

import * as chai from "chai"

const ID: string = "7-15.401", PLOT: string = "Patient Trajectories Plot"

describe(`${ID}-[Main suite: Real-Time Analysis, Visualization - ${PLOT}]`, function () {
    let isStepSkipped: boolean
    let currentSession: string
    const plotSettings = {
        menuItem: 3,
        biomarkerType:"qPCR",
        bname: [
            "EGFR"
        ]           
    }
    const options = {
        yOption: {
            min: "20",
            max: "24"
        }
    }
    let yPlotRange: string[]

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
    describe(`${PLOT} test-cases.`, function () {
        before(function () {
            try {
                RealTimeAnalysis.patintTrajectoriesLink.waitForDisplayed({ timeout: mediumDelay })
            } catch (e) {
                console.log(`<-----!!![WARNING MESSAGE] : Real-Time Analysis does not contain ${PLOT} Widget!!!----->`)
                this.skip()
            }
        })
        it(`[Patient Trajectories Generation] - Step 1[Verification]: Select one available biomarker from the list: ${plotSettings.bname[0]} (${plotSettings.biomarkerType}); Set Y axis Configuration and submit -> Plot should be displayed and Y Range min = ${options.yOption.min}.`, function () {
            try {
                //Wait the Patient Trajectories widget
                RealTimeAnalysis.chooseWidgetFromList(RealTimeAnalysis.patintTrajectoriesLink, longDelay * 2)
                //Select biomarkers from the plotSettings var
                RealTimeAnalysis.selectionAvailableBiomarkerByName(plotSettings, longDelay)
                //Set y min/max value
                RealTimeAnalysis.setYPrimaryRangeSettings(options.yOption, mediumDelay)
                //Submit Data Selection updating - wait "g.plot" element
                saveDifScreenshot(`${ID}-patient-submited-settings-yprimary-range`)
                RealTimeAnalysis.submitSettingsChanges(longDelay)
                //Wait yAxis Range updating
                browser.pause(1000)
                yPlotRange = RealTimeAnalysis.yRangeValueOnPlot(mediumDelay * 2)
                saveDifScreenshot(`${ID}-patient-plot-yprimary-rendering`)
            } catch (e) {
                isStepSkipped = true
                scipAndSaveScreenshot(
                    this,
                    `[Patient Trajectories Generation] Step 1 error: ${e}`,
                    `${ID}-error-patient-xy-range-plot`
                )
            }
            chai.expect(yPlotRange[0]).to.equal(options.yOption.min)
        })
        it(`[Patient Trajectories Generation] - Step 1[Verification]: Y Range max should be  = ${options.yOption.max}.`, function () {
            if (isStepSkipped) this.skip()
            
            chai.expect(yPlotRange.pop()).to.equal(options.yOption.max)
        })     
    })
    describe("Patient Trajectories: Set 'X Variable' Settings.", function () {        
        it('[Set Settings] - Step 1: Set the X Variable from the Plot Settings modal and confirm that the changes are applied on the Plot.', function () {
            if (isStepSkipped) this.skip()

            let newVariable: string
            try {
                newVariable = RealTimeAnalysis.openSettingsAndUpdateOne(
                    2,
                    `${ID}-screenshot-real-time-patient-plot-options-list-for-xvariable`,
                    longDelay )
                //Wait until the text of element X Variable is updated
                Chart.waitFirstXLabelEqualFirstBiomarker(newVariable, longDelay)
                //Successful screenshot
                saveDifScreenshot(`${ID}-screenshot-real-time-updated-xvariable-valuepatient-plot`)
            } catch (e) {
                scipAndSaveScreenshot(
                    this,
                    `[Set Settings] - Step 1 error: ${e}`,
                    `${ID}-error-set-xvariable-screenshot-patient-plot`
                )
            }
        })        
    })
})