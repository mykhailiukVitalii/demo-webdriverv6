import { BasePO } from "./Base";
import { Element } from "@wdio/sync";

export class CreateDashboardPagePO extends BasePO {
    private pageSelectors: any;

    constructor() {
        super();
        this.pageSelectors = {
            dashboardNamePart: "h2 span",
            createIcon: "i.fa.fa-clipboard",
            middleEmptyTextPart: ".text-center h2",
            topButtonSection: "button.btn-primary",
            tabsContainer: "ul.container-tabs",
            moduleHeader: ".container-tab.active h3",
            submoduleHeader: ".active a.tile-default",
            addWidgetBtn: "button[title='Add Widget']",
            modalAddWindowTitle: "h4.modal-title",
            changeNameIcon: ".fa.fa-pencil",
            changeNameField: "h2 input[type='text']",
            modalWindowContainer: ".modal-dialog",
            modalWindowHeader: ".modal-header h4",
            plotWidgetLink: ".widgets-container.clearfix",
            widgetSummaryTitle: ".widget .title.pull-left",
            widgetSummaryClose: ".widget .pull-right i.fa-close",
            plotContainer: ".plot-container .svg-container",
            changeNameConfirmBtn: "h2 button.btn-primary"
        }
    }

    get dashboardNamePart() { return $(this.pageSelectors.dashboardNamePart) }

    get topCreateIcon() { return $$(this.pageSelectors.createIcon)[0] }

    get middleCreateIcon() { return $$(this.pageSelectors.createIcon)[1] }

    get middleTextPart() { return $(this.pageSelectors.middleEmptyTextPart) }

    get addWidgetButton() { return $$(this.pageSelectors.topButtonSection)[0] }

    get addWidgetBtn() { return $(this.pageSelectors.addWidgetBtn) }

    get widgetSummaryTitle() { return $(this.pageSelectors.widgetSummaryTitle) }

    get widgetSummaryClose() { return $(this.pageSelectors.widgetSummaryClose) }
    
    get plotContainer() { return $(this.pageSelectors.plotContainer) }

    get generateReportButton() { return $$(this.pageSelectors.topButtonSection)[1] }

    get undoButton() { return $$(this.pageSelectors.topButtonSection)[2] }

    get previewButton() { return $$(this.pageSelectors.topButtonSection)[3] }

    get shareButton() { return $$(this.pageSelectors.topButtonSection)[4] }

    get copyButton() { return $$(this.pageSelectors.topButtonSection)[5] }

    get tabsContainer() { return $(this.pageSelectors.tabsContainer) }

    get modalWindowHeader() { return $(this.pageSelectors.modalWindowHeader) }

    get modalWindowContainer() { return $(this.pageSelectors.modalWindowContainer).$(".modal-content") }

    get plotWidgetLink() { return $(this.pageSelectors.plotWidgetLink) }

    get modalAddWindowTitle() { return $(this.pageSelectors.modalAddWindowTitle) }

    get changeNameIcon() { return $(this.pageSelectors.changeNameIcon) }

    get changeNameField() { return $(this.pageSelectors.changeNameField) }

    get changeNameConfirmBtn() { return $(this.pageSelectors.changeNameConfirmBtn) }

    activeSubModuleLink(headerId: number) { return $$(this.pageSelectors.submoduleHeader)[headerId] }

    tabLink(tabId: number) { return $(this.pageSelectors.tabsContainer).$$("li")[tabId].$("a") }

    activeModuleHeader(headerId: number) { return $$(this.pageSelectors.moduleHeader)[headerId] }

    activeSubModuleHeader(headerId: number) { return $$(this.pageSelectors.submoduleHeader)[headerId].$("p") }

    waitTopIcon(timeout: number = 5000) {
        this.dashboardNamePart.waitForExist({ timeout: timeout })
    }

    selectWidget(widget: string, delay: number = 5000): boolean {
        this.clickOnElement($(`a.tile-default=${widget}`), delay)

        return true
    }

    openAddWidgetWindow(timeout: number = 3000): void {
        this.addWidgetBtn.waitForClickable({ timeout: timeout })
        this.addWidgetBtn.click()
        this.modalAddWindowTitle.waitForExist({ timeout: timeout, timeoutMsg: "'Add Widget' window is not dispalyed" })
    }

    activateTab(tabId: number, timeout: number = 3000): void {
        this.tabLink(tabId).waitForExist({ timeout: timeout })
        this.tabLink(tabId).click()
    }

    activateChangeNameArea(timeout: number = 5000): void {
        this.dashboardNamePart.moveTo()
        this.changeNameIcon.waitForClickable({ timeout: timeout })
        this.changeNameIcon.click()
        this.changeNameField.waitForExist({ timeout: timeout, timeoutMsg: "'Change Dashboard Name' input field is not dispalyed" })
    }

    changeNameAndSave(name: string, timeout: number = 5000): void {
        this.changeNameField.setValue(name)
        this.changeNameConfirmBtn.waitForClickable({ timeout: timeout })
        this.changeNameConfirmBtn.click()
    }

    loadCreatePageAndOpenAddWidgetWindow(timeout: number = 5000): string {
        //Load Create Dashboard page
        const session = this.open()
        //Move cursor on the "Add Widget" button
        this.addWidgetBtn.waitForDisplayed({ timeout: timeout })
        this.addWidgetBtn.moveTo()
        browser.pause(1500)
        this.openAddWidgetWindow(timeout)

        return session
    }

    fillInSelectizeInputField(selectedBiomarker: string, isFillingY: boolean = false): void {
        //Fill in only Y biomarker if selected isFillingY = true
        if(isFillingY) {
            $$('.selectize-input.not-full input')[0].setValue(selectedBiomarker)
            browser.keys("Enter")
            browser.keys("Escape")
            $$('.biomarkers-manager a')[0].click()
        } else {
            $$('.selectize-input.not-full input')[1].setValue(selectedBiomarker)
            browser.keys("Enter")
            browser.keys("Escape")
            $$('.biomarkers-manager a')[2].click()
        }
    }

    waitModalContainerDisplayed(delay: number = 5000): boolean {
        this.waitDisplayedElement(this.modalWindowContainer, delay)

        return true
    }

    isModalAddWindowTitleDisplayedAfterOpening(delay: number = 5000): boolean {
        this.openAddWidgetWindow(delay)
        this.waitDisplayedElement(this.modalAddWindowTitle, delay)

        return true
    }

    setDashboardName(delay: number = 5000): string {
        const dashboardName = `Test e2e Dashboard ${Date.now()}`
        CreateDashboardPage.activateChangeNameArea(delay)
        CreateDashboardPage.changeNameAndSave(dashboardName, delay)
        browser.pause(1500)

        return dashboardName
    }

    savePlotSettings(delay: number = 5000): void {
        this.clickOnElement($('.modal-footer button.btn-primary'), delay)
    }

    open(): string {
        return super.open(`/newdashboard`)
    }
}

export const CreateDashboardPage = new CreateDashboardPagePO()