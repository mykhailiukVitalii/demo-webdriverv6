import { BdmPage } from "../../src/pages/GeneralBdmPage"
import { saveDifScreenshot, scipAndSaveScreenshot, findByContainsText } from "../../src/misc/functions"
import { longDelay } from "../../src/misc/timeouts"
import * as chai from 'chai'

const ID: string = "1-1.101"

describe(`${ID}-[HOME PAGE]: Main elements`, function () {
    let currentSession: string
    
    before(function () {
        //Open BDM app page and get current "ring-session" value from Cookie
        currentSession =  BdmPage.open()
        try {
            //if logo element exist - continue tests.
            BdmPage.closeMenu(longDelay)
        }
        catch(e) {
            scipAndSaveScreenshot(this, `Home Page Render error: ${e}`, `${ID}-error-home-page`)
        }        
    })
    after(function () {
        //Clear all sessions for test-user
        BdmPage.cleanUpUserSessions(currentSession)
    })
    it('[Verification]: Header part - The QuartzBio Platform logo should be visible (Save screenshot).', function () {
        saveDifScreenshot(`${ID}-screenshot-home-page-verification`)
        expect($(".dph-logo").$("a")).toHaveAttribute("style", 'background-image: url("static/images/Quartzbio_Logo_Final_KO.png");')
    })
    it('[Verification]: Header part - Navigation menu collapse should be visible', function () {
        expect($(".dev-page-sidebar-collapse-icon")).toBeDisplayed()
    })
    it('[Verification]: Header part - "Logged in as:" should be visible', function () {
        expect($("ul.pull-right").$$("li")[1].$("div")).toHaveText("Logged in as:")
    })
    it('[Verification]: Footer part - text "© 2017-2021" should be visible', function () {
        expect($(".dev-page-footer").$$("span")[1]).toHaveTextContaining("© 2017-2021")
    })
    it('[Verification]: Footer part - text "Precision for Medicine" should be visible', function () {
        expect($(".dev-page-footer").$$("strong")[0]).toHaveText("Precision for Medicine")
    })
    it('[Verification]: Footer part - text ". All rights reserved." should be visible', function () {
        expect($(".dev-page-footer").$$("span")[2]).toHaveTextContaining("All rights reserved.")
    })
    it('[Verification]: Footer part - link "Privacy Policy" should be visible', function () {
        expect($(".dev-page-footer").$$("span")[3].$("a")).toHaveText("Privacy Policy")
    })
    it('[Verification]: Module header "Favorite Dashboards" should be visible: the length should be 1.', function () {
        chai.expect(findByContainsText(".widget-news-content h3", "Favorite Dashboards")).to.have.lengthOf(1)
    })
    it('[Verification]: Module header "Dashboard Management" should be visible: the length should be 1.', function () {
        chai.expect(findByContainsText(".widget-news-content h3", "Dashboard Management")).to.have.lengthOf(1)
    })    
})