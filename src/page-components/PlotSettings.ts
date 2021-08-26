import { smallDelay, shortDelay } from "../misc/timeouts"
import { ElementArray, Element } from "@wdio/sync"
import { Dropdown } from "./Dropdowns"

export class PlotSettings {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            footerButtons: ".modal-footer button",
            dropdownContent: ".selectize-dropdown-content",
            settingsInput: ".selectize-input",
            modalContent: ".modal-content",
            selectionDropdown: ".selectize-input.not-full input",
            availableBiomarkerArray: ".biomarkers-manager .biomarker",
            biomarkerManagerLinkArray: ".biomarkers-manager a",
            hideLegendCheckbox: ".checkbox-inline",
            chartSettingsButton: "button[title='Chart Settings']",
            closeModalIcon: ".modal.in .modal-header .close",
            selectizeBiomarkerElement: ".selectize-input.items.not-full",
            selectedVariables: "[class$='singleValue']",
            existSelectizeBiomarker: ".item a.remove",
            dataSelectionLabel: "label=Data Selection",
            referenceLineYByLabel: "label=Reference Line Y",
            referenceLineY2ByLabel: "label=Reference Line Y2",
            trellisModeByLabel: "label*=TRELLIS",
            trellisRowByLable: "label*=Row",
            trellisColumnByLable: "label*=Column",
            biomarkerContributionByLable: "label*=Biomarkers contribution",
            xRangeByLable: "label=X Range",
            yRangeByLable: "label=Y Range",
            yAxisConfByLable: "label=Y Axis Configuration",
        }
    }

    get submitButton() { return $$(this.pageSelectors.footerButtons)[0] }

    get modalContent() { return $(this.pageSelectors.modalContent) }

    get selectedVariables() { return $(this.pageSelectors.selectedVariables) }

    get chartSettingsButton() { return $(this.pageSelectors.chartSettingsButton) }

    get selectionDropdown() { return $(this.pageSelectors.selectionDropdown) } //TODO: to Dropowns

    get selectionDropdownItems() { return $$(this.pageSelectors.selectionDropdown) } //TODO: to Dropowns

    get hideLegendCheckbox() { return $(this.pageSelectors.hideLegendCheckbox) }

    get radarhideLegendCheckbox() { return $$(this.pageSelectors.hideLegendCheckbox)[1] }

    get availableBiomarkerArray() { return $$(this.pageSelectors.availableBiomarkerArray) }

    get firstBiomarker() { return $$(this.pageSelectors.availableBiomarkerArray)[0] }

    get firstSelectizeBiomarkerElement() { return $$(this.pageSelectors.selectizeBiomarkerElement)[0] } //TODO: to Dropowns

    get firstSelectizeItem() { return $$(this.pageSelectors.selectizeBiomarkerElement)[0].$(".item") }

    get secondSelectizeBiomarkerElement() { return $$(this.pageSelectors.selectizeBiomarkerElement)[1] } //TODO: to Dropowns

    get existSelectizeBiomarkerElement() { return this.firstSelectizeBiomarkerElement.$(this.pageSelectors.existSelectizeBiomarker) } //TODO: to Dropowns

    get existSecondSelectizeBiomarkerElement() { return this.secondSelectizeBiomarkerElement.$(this.pageSelectors.existSelectizeBiomarker) } //TODO: to Dropowns

    get biomarkerSelectAllLink() { return $$(this.pageSelectors.biomarkerManagerLinkArray)[0] }

    get dataSelectionLabel() { return $(this.pageSelectors.dataSelectionLabel) }

    get referenceLineY() { return $$(this.pageSelectors.referenceLineYByLabel)[0] }

    get referenceLineY2() { return $$(this.pageSelectors.referenceLineY2ByLabel)[0] }

    get trellisModeCheckbox() { return $(this.pageSelectors.trellisModeByLabel).parentElement().nextElement().$(".checkbox-inline").$("label") }

    get trellisModeRowInput() { return $(this.pageSelectors.trellisRowByLable).parentElement().nextElement().$(".selectize-input.items.has-options") }

    get trellisModeColumnInput() { return $(this.pageSelectors.trellisColumnByLable).parentElement().nextElement().$(".selectize-input.items.has-options") }

    get biomarkerContributionMode() { return $(this.pageSelectors.biomarkerContributionByLable).parentElement().nextElement().$(".checkbox-inline").$("label") }

    get xRangeMinInput() { return $(this.pageSelectors.xRangeByLable).parentElement().nextElement().$$(".form-group")[0].$(".input-group").$("input") }

    get yRangeMinInput() { return $(this.pageSelectors.yRangeByLable).parentElement().nextElement().$$(".form-group")[0].$(".input-group").$("input") }

    get yAxisMinInput() { return $(this.pageSelectors.yAxisConfByLable).parentElement().nextElement().$$(".form-group")[0].$(".input-group").$("input") }

    get xRangeMaxInput() { return $(this.pageSelectors.xRangeByLable).parentElement().nextElement().$$(".form-group")[1].$(".input-group").$("input") }

    get yRangeMaxInput() { return $(this.pageSelectors.yRangeByLable).parentElement().nextElement().$$(".form-group")[1].$(".input-group").$("input") }

    get yAxisMaxInput() { return $(this.pageSelectors.yAxisConfByLable).parentElement().nextElement().$$(".form-group")[1].$(".input-group").$("input") }

    getFirstBiomarkerName(): string {
        const name = this.firstBiomarker.getText()
        console.log('Selected biomarker: ', name)

        return name
    }
    referenceInputYByIndex(index: number) {
        return this.referenceLineY.parentElement().nextElement().$$(".input-group")[index].$("input")
    }
    referenceInputY2ByIndex(index: number) {
        return this.referenceLineY2.parentElement().nextElement().$$(".input-group")[index].$("input")
    }
    //TODO: move to single page such as 7-15.201
    waitModalSettingFormIsDisplayed(delay: number = 5000) {
        //Wait when Modal settings form is displayed (".modal-content")
        this.modalContent.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.modalContent}" element should be rendered in ${delay}ms`
        })
    }
    //TODO: move to single page such as 7-15.201
    openPrimarySelectionMenu(delay: number = 5000) {
        //Open Primary Y selection drop down menu
        Dropdown.selectionDropdown.waitForClickable({ timeout: delay })
        Dropdown.selectionDropdown.click()
    }
    //TODO: move to single page such as 7-15.201
    openMenuWithDeleay(index: number, delay: number = 5000) {
        //Open Primary Y selection drop down menu
        Dropdown.selectionDropdownItems[index].waitForClickable({ timeout: delay })
        Dropdown.selectionDropdownItems[index].click()
    }

    submitSettings(delay: number = 5000): void {
        this.submitButton.waitForDisplayed({ timeout: delay })
        this.submitButton.click()
        //Default pause
        browser.pause(3000)
    }
    //TODO: move to single page such as 7-15.201
    removeExistingBiomarker(): void {
        Dropdown.existSelectizeBiomarkerElement.click()
    }
    
    removeExistingBiomarkerFromSecondSelectize(): void {
        Dropdown.existSecondSelectizeBiomarkerElement.click()
    }
    //TODO: move to single page such as 7-15.201
    isExistBiomarkerDisplayed(): boolean {
        return Dropdown.existSelectizeBiomarkerElement.isDisplayed()
    }   
    //TODO: move to single page such as 7-15.201  
    isExistBiomarkerFromSecondSelectizeDisplayed(): boolean {
        return Dropdown.existSecondSelectizeBiomarkerElement.isDisplayed()
    }

    openChartSettingsWindow(delay: number = 5000): void {
        //Wait Chart Settings Button
        $(this.pageSelectors.chartSettingsButton).waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.chartSettingsButton}" element should be clickable(delay = ${delay}ms).`
        })
        //Click on the element
        $(this.pageSelectors.chartSettingsButton).click();
    }

    closeModalWindow(delay: number = 5000): void {
        //WaitClose modal icon
        $(this.pageSelectors.closeModalIcon).waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.closeModalIcon}" element should be clickable(delay = ${delay}ms).`
        })
        //Click on the element
        $(this.pageSelectors.closeModalIcon).click();
    }

    dropDownOption(id: number) {
        return $$(this.pageSelectors.dropdownContent)[id].$$('.option')
    }

    settingsInputField(id: number) {
        return $$(".selectize-input")[id]
    }

    selectDropdownItem(menuId: number, index: number = 0) {
        //By defult using first item from the list (index = 0)
        this.dropDownOption(menuId)[index].click()
        browser.pause(smallDelay)
        browser.keys("Escape")
        browser.pause(500)
    }

    selectAvailableBiomarkerByName(bname: string, delay: number): Element {
        if (this.availableBiomarkerArray.length === 0) throw new Error('Widget Plot Settings does not contain Available Biomarkers for selecting!')
        //Find biomarker from the list
        const biomarker = this.availableBiomarkerArray.find(item => item.getText().includes(bname))
        if(!biomarker) throw new Error(`Available biomarker with name = ${bname} does not exist in the list!`)
        browser.pause(500)

        return this.selectAvailableBiomarker(biomarker, delay)
    }

    getAvailableBiomarkerList(): string[] {
        const availableBiomarkers: string[] = []
        browser.pause(300)
        if (this.availableBiomarkerArray.length === 0) throw new Error('Widget Plot Settings does not contain Available Biomarkers for selecting!')
        //Find biomarker from the list
        const biomarker = this.availableBiomarkerArray.map(item => {
            availableBiomarkers.push(item.getText())
        })
        browser.pause(500)

        return availableBiomarkers
    }

    selectAvailableBiomarker(element: Element, delay: number): Element {
        element.waitForClickable({ 
            timeout: delay,
            timeoutMsg: `Expected "${element.selector}" element should be rendered (delay=${delay})`
         })
        element.click()
        browser.pause(300)

        return element
    }

    //TODO:
    selectBiomarkerListItem(index: number) {
        this.availableBiomarkerArray[index].waitForClickable({ timeout: shortDelay })
        this.availableBiomarkerArray[index].click()
        browser.pause(smallDelay)
    }

    selectOptionItem(option: number,item: number) {
        //Select biomarker
        const options = this.dropDownOption(option)
        options[item].scrollIntoView()
        options[item].waitForClickable({ timeout: shortDelay })
        this.selectDropdownItem(option, item)
        //fix
        $(".modal-title=Plot Settings").click()
    }    
    //TODO: move to single page such as 7-15.201
    openDropdownMenu(): void {
        browser.waitMediumDelayAndClick(Dropdown.firstSelectizeBiomarkerElement, ".selectize-input.items.not-full[0]")
    }
    //TODO: move to single page such as 7-15.201
    openSecondDropdownMenu(): void {
        browser.waitMediumDelayAndClick(Dropdown.secondSelectizeBiomarkerElement, ".selectize-input.items.not-full[1]")
    }

    openMenuAndGetItemsList(index: number) {
        // If Data Selection menu contains item - select first element
        const dataSelection: ElementArray = PlotSettingsForm.dropDownOption(index)        
        const items = dataSelection.map(function (element) {
            return element.getAttribute('innerText')
        })
        //Close modal window
        this.closeModalWindow()

        return items
    }
    
    selectAllAvailableBiomarkersReturnedLastBiomarkerName(): string {
        //Get last biomarker name
        const biomarkerList = this.availableBiomarkerArray
        const name = biomarkerList[biomarkerList.length -1].getText()
        //Select all by clicking on the Select all link
        browser.waitMediumDelayAndClick(this.biomarkerSelectAllLink)
        
        return name
    }

    selectedValueForAllSelectedBiomakers(): string {
        //Get last biomarker name
        const variables = this.selectedVariables.getText()
        //Select all by clicking on the Select all link
        browser.waitMediumDelayAndClick(this.biomarkerSelectAllLink)
        
        return variables
    }

    selectAllAvailableBiomarkersFromSecondManagerReturnedLastBiomarkerName(): string {
        //Get last biomarker name
        const biomarkerList = $$(".biomarkers-manager")[3].$$(".biomarker")
        const name = biomarkerList[biomarkerList.length -1].getText()
        //Select all by clicking on the Select all link
        browser.waitMediumDelayAndClick($$("a=Select All")[1])
        
        return name
    }

    waitFirstBiomarkerItem(delay: number = 5000): void {
        this.firstSelectizeItem.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected ".selectize-input.items.not-full > .item" element should be rendered in ${delay}ms`
        })
    }

}

export const PlotSettingsForm = new PlotSettings()

