import { BasePO } from "./Base";
import { ModalAddTrackingNumber } from "../page-components/ModalAddTrackingNumber";
import { Modal } from "../page-components/Modal";
import { Element } from "@wdio/sync";

export class ShipmentTrackerPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      addNumberButton: "button=Add Tracking Number",
      activeNumbers: "a.go-to-tracker",
      tableWrapper: ".dataTables_wrapper",
      entriesInfo: ".dataTables_info",
      tableBody: "tbody",
      selectingCheckboxes: "td.select-checkbox",
      showEntriesDropdown: ".dataTables_length select",
      inactiveTrackingTab: "a=Inactive Tracking Numbers",
      activeTrackingTab: "a=Active Tracking Numbers",
      trackingMapTab: "a=Tracking Map",
      shipmentHomeLink: ".home-list-item=Shipment Tracker",
      trackingMapPoints: "div[role='button']"
    }
  }

  get shipmentHomeLink() { return $(this.pageSelectors.shipmentHomeLink) }

  get addNumberButton() { return $(this.pageSelectors.addNumberButton) }

  get showEntriesDropdown() { return $(this.pageSelectors.showEntriesDropdown) }

  get activeNumbers() { return $$(this.pageSelectors.activeNumbers) }

  get entriesInfo() { return $(`${this.pageSelectors.tableWrapper} ${this.pageSelectors.entriesInfo}`) }

  get tableBodyRow() { return $(`${this.pageSelectors.tableBody}`).$("td") }

  get tableSelectingCheckboxes() { return $$(`${this.pageSelectors.tableBody} ${this.pageSelectors.selectingCheckboxes}`) }

  get inactiveTrackingTab() { return $(`${this.pageSelectors.inactiveTrackingTab}`) }

  get activeTrackingTab() { return $(`${this.pageSelectors.activeTrackingTab}`) }

  get trackingMapTab() { return $(`${this.pageSelectors.trackingMapTab}`) }

  get trackingMapPoints() { return $$(`${this.pageSelectors.trackingMapPoints}`) }

  open(): string {
    return super.open(`/track`)
  }

  clickOnAddNumberButton(delay: number = 5000) {
    this.addNumberButton.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.pageSelectors.addNumberButton}" element should be clickable after ${delay}ms`
    })
    this.addNumberButton.click()
  }

  goToInactiveTab(delay: number = 5000) {
    this.inactiveTrackingTab.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.pageSelectors.inactiveTrackingTab}" element should be clickable after ${delay}ms`
    })
    this.inactiveTrackingTab.click()
  }

  goToActiveTab(delay: number = 5000) {
    this.activeTrackingTab.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.pageSelectors.activeTrackingTab}" element should be clickable after ${delay}ms`
    })
    this.activeTrackingTab.click()
  }

  goToTrackingMapTab(delay: number = 5000) {
    this.trackingMapTab.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.pageSelectors.trackingMapTab}" element should be clickable after ${delay}ms`
    })
    this.trackingMapTab.click()
  }

  addServiceNumberAndSabmit(service: string, trackingNumber: string, delay: number = 5000) {
    this.clickOnAddNumberButton(delay)
    ModalAddTrackingNumber.openSeviceTypeMenu(delay)
    ModalAddTrackingNumber.selectService(service, delay)
    ModalAddTrackingNumber.inputTrackingNumber(trackingNumber, delay)
    ModalAddTrackingNumber.submitAddingNumber(delay)
    ModalAddTrackingNumber.modalWindowClosed(delay)
  }

  addNumberAndSabmitOnly(service: string, trackingNumber: string, delay: number = 5000) {
    this.clickOnAddNumberButton(delay)
    ModalAddTrackingNumber.openSeviceTypeMenu(delay)
    ModalAddTrackingNumber.selectService(service, delay)
    browser.pause(500)
    ModalAddTrackingNumber.inputTrackingNumber(trackingNumber, delay)
    browser.pause(500)
    ModalAddTrackingNumber.submitAddingNumber(delay)
  }

  editServiceNumberAndSubmit(trackingNumber: string, delay: number = 5000) {
    console.log("Active Number for updating: ", trackingNumber)
    ModalAddTrackingNumber.editTrackingNumber(trackingNumber, delay)
    ModalAddTrackingNumber.submitAddingNumber(delay)
    ModalAddTrackingNumber.modalWindowClosed(delay)
  }

  getFirstExistServiseRow(service: string) {
    let row: Element

    let rows = $$("tbody tr")
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].$$("td").find(n => n.getText() === service)) {
        row = rows[i]
        break
      }
      else continue
    }
    return row
  }

  getFirstExistRow(number: string): any { //TODO: concat with getFirstExistServiseRow()
    let row: any

    let rows = $$("tbody tr")
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].$$(".go-to-tracker").find(n => n.getText() === number)) {
        row = rows[i]
        break
      }
      else continue
    }
    return row
  }

  findCellWithCurrentStatus(number: string, message: string): boolean {
    let isMessageExist: boolean = false
    //Find row with current number
    const row = this.getFirstExistRow(number)
    if(row) {
      row.$$("td").map(n => {
        if(n.getText().includes(message)) isMessageExist = true
      })
    } 
    return isMessageExist
  }

  selectExistNumber(number: string) {
    //Find row with current number
    const row = this.getFirstExistRow(number)
    if(row) {
      row.$(this.pageSelectors.selectingCheckboxes).waitForClickable({timeout: 500})
      row.$(this.pageSelectors.selectingCheckboxes).click()
    }
  }

  expect2PointOnMap(delay: number) {
    browser.waitUntil(
      () => this.trackingMapPoints[0].isDisplayed() === true,
      {
        timeout: delay,
        timeoutMsg: `Expected "${this.pageSelectors.trackingMapPoints}" first point should be displayed after ${delay}ms.`
      })
    return this.trackingMapPoints.length
  }

  firstExistServiceNumber(service: string) {
    const row = this.getFirstExistServiseRow(service)
    if (row) return row.$(this.pageSelectors.activeNumbers).getText()
    else throw new Error('The Active Table does not contain any matches entries.')
  }

  opendEditingForExistNumber(service: string) {
    const row = this.getFirstExistServiseRow(service)    
    if (row) {
      console.log("Number before editing: ", row.$(this.pageSelectors.activeNumbers).getText())
      return row.$(".edit-number").click()
    }
    else throw new Error('The Active Table does not contain any matches entries for editing.')
  }

  findActiveNumber(trackingNumber: string) {
    return this.activeNumbers.find(number => number.getText() === trackingNumber)
  }

  numberFromTables(delay: number = 5000): Array<string> {
    this.tableBodyRow.waitForDisplayed({ timeout: delay })
    const activeNumbers = this.activeNumbers.map(n => n.getText())
    this.goToInactiveTab(delay)
    const inactiveNumbers = this.activeNumbers.map(n => n.getText())
    this.goToActiveTab(delay)

    return activeNumbers.concat(inactiveNumbers)
  }

  selectNoExistNumber(availableList: Array<string>, delay: number = 5000) {
    const existList = this.numberFromTables(delay)
    browser.pause(500)

    const list = availableList.filter(n => existList.indexOf(n) === -1)
    if (list.length > 0) return list
    else throw new Error('The list of available numbers does not contain matching entries.')
  }

  isNumberExistOnTable(trackingNumber: string, delay: number = 5000): void {
      browser.waitUntil(
        () => {
          this.findActiveNumber(trackingNumber).waitForDisplayed({ timeout: 5000})

          return this.findActiveNumber(trackingNumber).isDisplayed() === true
        },
        {
          timeout: delay,
          timeoutMsg: `The Tracking Number should be added to Active Numbers table after ${delay}ms.`
        })
  }

  compareRowsAndEntriesCount(delay: number = 5000): void {
    browser.pause(300)
    const currentEntries = this.currentEntriesCount(delay)
    console.log("Current count of entries: ", currentEntries)
    const rows = this.tableSelectingCheckboxes.length
    console.log("Current count of rows: ", rows)
    browser.waitUntil(
      () => rows === currentEntries,
      {
        timeout: delay,
        timeoutMsg: `Count of the 'showing items' should be equal to the number of records in the Active table after ${delay}ms.`
      })
  }

  currentEntriesCount(delay: number = 5000) {
    this.entriesInfo.waitForDisplayed({
      timeout: delay,
      timeoutMsg: `Expected "${this.pageSelectors.entriesInfo}" element should be displayed after ${delay}ms`
    })

    return Number(this.entriesInfo.getText().split(' ').slice(-2)[0])
  }

  showEntriesValue(delay: number = 5000) {
    this.showEntriesDropdown.waitForClickable({
      timeout: delay,
      timeoutMsg: `Expected "${this.pageSelectors.showEntriesDropdown}" dropdown menu should be clickable after ${delay}ms`
    })
    this.showEntriesDropdown.click()

    return $$(`${this.pageSelectors.showEntriesDropdown} option`).map(m => m.getText())
  }

  getModalExceptionMessage(delay: number = 5000) {
    //If modal window throw an Error - close window
    if (Modal.isModalWindowDisplayed(delay)) return Modal.getModalErrorMessage()
    else throw new Error('"User exception" Modal window is not displayed(with modal message). Check current functionality manually')
  }

  skipIfShipmentModuleNoExist(context: any): void {
    if (!browser.sharedStore.get('isShipmentExist')) {
      console.log('[WARNING MESSAGE] : The current application does not contain a Shipment Tracker module! THIS TEST will be SKIPPED!!!')
      context.skip()
    }
  }
}

export const ShipmentTracker = new ShipmentTrackerPO()