import { saveDifScreenshot } from "../misc/functions"

export class ShowinfoSubplotCo {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            subplotContainer: ".plot-container.plotly",
            dashboardName: "input[placeholder='Dashboard Name']",
            dataselectionName: "input[placeholder='Dataselection name']",
            addDashboardButon: "button=Add" 
        }
    }

    get subplotContainer() { return $(this.pageSelectors.subplotContainer) }

    get dashboardName() { return $(this.pageSelectors.dashboardName) }

    get dataselectionName() { return $(this.pageSelectors.dataselectionName) }

    get addDashboardButon() { return $(this.pageSelectors.addDashboardButon) }

    waitSubplotContainer(delay: number): boolean {
        //Wait Subplot container
        this.subplotContainer.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.subplotContainer.selector}" subplot should be displayed (delay = ${delay}ms)`
        })

        return true
    }

    createNewDashboard(dashboard: string, dataselection: string, screenName: string, delay: number): void {
        this.waitSubplotContainer(delay)
        this.fillDashboardName(dashboard, delay)
        this.fillDataselectionName(dataselection, delay)
        saveDifScreenshot(screenName)
        this.dashboardSubmit(delay)
        browser.waitUntil(
            () => this.dashboardName.getText() === "",
            {
                timeout: delay,
                timeoutMsg: `[Create Dashboard]: After submiting the DashboardName field should be empty (delay = ${delay}ms)`
            }
        )
    }

    fillDashboardName(name: string, delay: number): string {
        //Wait Dashboard name field
        this.dashboardName.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.dashboardName.selector}" input field should be displayed (deley = ${delay}ms)`
        })
        //Set Dashboard name
        this.dashboardName.setValue(name)

        return name
    }

    fillDataselectionName(name: string, delay: number): string {
        //Wait Dataselection name field
        this.dataselectionName.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.dataselectionName.selector}" input field should be displayed (deley = ${delay}ms)`
        })
        //Set Dataselection name
        this.dataselectionName.setValue(name)

        return name
    }

    dashboardSubmit(delay: number): boolean {
        //Wait Add button and click name field
        this.addDashboardButon.waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "${this.addDashboardButon.selector}" button should be clickable (deley = ${delay}ms)`
        })
        this.addDashboardButon.click()

        return true
    }

}

export const ShowinfoSubplot = new ShowinfoSubplotCo()