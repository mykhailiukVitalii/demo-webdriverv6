import { BasePO } from "./Base";
import { Table } from "../page-components/Table";
import { ShowinfoSubplot } from "../page-components/ShowinfoSubplot";
import { SelectionManager } from "../page-components/SelectionManager";

export class MasterSampleInventoryPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      buttons: "button.btn-primary",
      inputNameField: "input[placeholder='Enter subject selection name...']",
      fullButton: "button.btn-primary > span",
      createSelectionButton: "button=Create subject selection",
      msiHomeLink: ".home-list-item=Shipment Tracker",
      settingsButton: "span=Settings",
      showinfoButtonIn: "span=Show info",
      closeShowinfoButton: "button=Close",
    }
  }

  get createSubjectSelectionButton() {return $$(this.pageSelectors.buttons)[0]}

  get compareVersionButton() {return $$(this.pageSelectors.buttons)[1]}

  get fullShowInfoButton() {return $$(this.pageSelectors.fullButton)[2]}

  get inputNameField() {return $(this.pageSelectors.inputNameField)}

  get settingsButton() {return $(this.pageSelectors.settingsButton)}

  get showinfoButton() {return $(this.pageSelectors.showinfoButtonIn)}

  get showinfoButtonOut() {return $$(this.pageSelectors.buttons)[4]}

  get createSelectionButton() {return $(this.pageSelectors.createSelectionButton)}

  get closeShowinfoButton() {return $(this.pageSelectors.closeShowinfoButton)}

  open(): string {
    return super.open(`/sampleinventory`)
  }

  selectRowAndEnterSubjectName(option: { selectedRowByIndex: Array<number> }, delay: number = 5000): any {
    //Select row/rows from the Samle Inventory table
    const subjectIds = Table.selectRowFromMainTable(option, delay)
    //Input Subject Selection Name to the input field
    const selectionName = this.setSubjectSelectionName(delay)

    return {selectionName, subjectIds}
  }

  openSettingsModal(delay: number) {
    this.settingsButton.waitForDisplayed({ timeout: delay })
    this.settingsButton.click()
  }

  selectRowAndSelectColumnsInSettings(option: { selectedRowByIndex: Array<number>, countAfterClear: number, minTableLength: number }, delay: number = 5000): Array<String> {
    //Select row/rows from the Samle Inventory table
    Table.selectRowFromMainTable(option, delay)
    //Open Settings Modal window
    this.openSettingsModal(delay)
    //Click on the Clear Selection and confirm default count of the selected items
    const {countAfterClear, minTableLength} = option
    SelectionManager.clearSelectionAndCheckDefaultSelections(countAfterClear, minTableLength, delay)
    //Select 2 items for selection mode
    return SelectionManager.addedTwoColumnsToFileListing(delay, minTableLength)
  }

  confirmTableUpdating(delay: number = 500): Array<String>{    
    //Click on Settings update
    SelectionManager.submitSettingsUpdate(delay)
    //Get columns name list from the main table
    return Table.getColumnNameListFromMainTable(delay)
  }

  setSubjectSelectionName(delay: number = 5000) {
    const selectionName = `Sabject Selection e2e:${Date.now()}`
    this.inputNameField.waitForDisplayed({ timeout: delay })
    this.inputNameField.setValue(selectionName)

    return selectionName
  }

  submitCreateSubject(delay: number = 5000) {
    this.createSelectionButton.waitForClickable({ timeout: delay })
    this.createSelectionButton.click()
  }

  settingsByDefaultClickable(delay: number): boolean {
    //Wait when the button is clickable
    this.settingsButton.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.pageSelectors.settingsButton}" button should be clickable in ${delay}ms`
    })
    return true
  }

  showinfoByDefaultNoClickable(delay: number): boolean {
    //Wait when the button is clickable
    this.showinfoButtonOut.waitForDisplayed({
      timeout: delay,
      timeoutMsg: `Expected "${this.showinfoButtonOut.selector}" button should be no clickable in ${delay}ms`
    })

    return Boolean(this.showinfoButtonOut.getAttribute('disabled'))
  }

  submitCreateSelection(delay: number = 5000) {
    this.submitCreateSubject(delay)
    browser.acceptAlert()
    browser.pause(500)
    this.isSubjectNameFieldClear(delay)
  }

  isSubjectNameFieldClear(delay: number) {
    browser.waitUntil(
      () => this.inputNameField.getText() === "",
      {
        timeout: delay,
        timeoutMsg: `The Subject Selection input should be clear after submiting(wait ${delay}ms.)`
      }
    )
  }

  selectColumnFromMainTableAndCheckInfoButton(option: {selectedRowByIndex: Array<number>}, delay: number = 5000): boolean | string{
    let result: boolean
    //Select column from the Main Table
    Table.selectColumnFromTable(option, delay)
    browser.pause(300)

    if(!this.showinfoByDefaultNoClickable(delay) && this.showinfoButtonOut.isClickable()) result = true
    //Return 'Show Info' state or Alert message
    return result
  }

  openShowInfoSubplot(option: {selectedRowByIndex: Array<number>, dashboardName: string, dataselectionName: string, screenName: string}, delay: number = 5000): boolean {
    //Select column from the Main Table
    Table.selectColumnFromTable(option, delay)
    browser.pause(300)
    //Open Show Info modal
    this.clickShowInfo(delay)
    const {dashboardName, dataselectionName, screenName} = option
    ShowinfoSubplot.createNewDashboard(dashboardName, dataselectionName, screenName, delay)

    this.closeShowInfo(delay)

    return true
  }

  clickShowInfo(delay: number) {
    //Wait when the Show Info button is clickable
    this.showinfoButton.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.showinfoButton.selector}" button should be clickable in ${delay}ms`
    })
    this.showinfoButton.click()

    return true
  }

  closeShowInfo(delay: number) {
    //Wait when the 'Close' button is clickable
    this.closeShowinfoButton.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.closeShowinfoButton.selector}" button should be clickable in ${delay}ms`
    })
    this.closeShowinfoButton.click()

    return true
  }

  //TODO: move to BasePO class
  skipIfMasreSampleModuleNoExist(context: any): void {
    if (!browser.sharedStore.get('isMsiExist')) {
      console.log('[WARNING MESSAGE] : The current application does not contain a Shipment Tracker module! THIS TEST will be SKIPPED!!!')
      context.skip()
    }
  }
}

export const MasterSampleInventory = new MasterSampleInventoryPO()