import { BasePO } from "./Base";
import { FilterSection } from "../page-components/FilterPanel";
import { Button } from "../page-components/Buttons";
import { Table } from "../page-components/Table";
import { SelectionManager } from "../page-components/SelectionManager";
import { ElementArray, Element } from "@wdio/sync";

export class DataDownloadPagePO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      navigationTab: "ul.tabs-nav",
      checkboxSelectedItem: ".dataTables_sizing",
      downloadBtn: "button i.fa-download",
      markedCheckbox: "i._checkbox.fa-check-square-o",
      mainTableSelectElement: "table.table td.select-checkbox",
      checkAllCheckbox: "i.fa-square-o._checkall",
      prosessAllCheckbox: "[data-column-index='0'].sorting_disabled",
      emptyDataTables: "td.dataTables_empty",
      selectItemInTable: "table.table td.select-checkbox",
      downloadItemName: "tr.selected[id='1']",
      selectOptionArea: ".selectize-dropdown-content",
      processedTab: "li=Processed Data"
    }
  }

  get clinicalDataTab() { return $$(this.pageSelectors.navigationTab)[0].$('li') }

  get rawDataTab() { return $$(this.pageSelectors.navigationTab)[1].$$('li')[0] }

  get processwdDataTab() { return $$(this.pageSelectors.navigationTab)[1].$$('li')[1] }

  get prosessAllCheckbox() { return $$(this.pageSelectors.prosessAllCheckbox) }

  get selectOptionArea() { return $$(this.pageSelectors.selectOptionArea) }

  get firstSelectionTableItem() { return $$(this.pageSelectors.checkboxSelectedItem)[0].$("i.fa") }

  get firstFileTableItem() { return $("[id='1'] .select-checkbox i.fa") }

  get emptyDataTables() { return $(this.pageSelectors.emptyDataTables) }

  get subjectSelectionFilterLabel() { return $$(this.pageSelectors.filterLabel) }

  get subjectSelectionFilterField() { return $$(this.pageSelectors.filterInputField) }

  get markedCheckbox() { return $$(this.pageSelectors.markedCheckbox) }

  get checkAllCheckbox() { return $$(this.pageSelectors.checkAllCheckbox) }

  get mainTableSelectElement() { return $$(this.pageSelectors.mainTableSelectElement) }

  get downloadButton() { return $(this.pageSelectors.downloadBtn) }

  get processedTab() { return $(this.pageSelectors.processedTab) }

  selectFilterFields(filterId: number) {
    return $$(this.pageSelectors.inputFilterField)[filterId].$(this.pageSelectors.filterInputField)
  }

  selectItemInRawTable(itemId: number) {
    return $$(this.pageSelectors.selectItemInTable)[itemId]
  }

  getDownloadItemName(itemId: number) {
    return $$(this.pageSelectors.downloadItemName)[0].$$("td")[itemId].getText()
  }

  openSelectionFilterPanel(delay: number) {
    this.moveCursorOnElement(FilterSection.tableFilters, delay, 1500)
    this.clickOnElement(FilterSection.tableFilters, delay)
  }

  openClinicalSubjectIdInput(delay: number) {
    this.clickOnElement(FilterSection.clinicalSubjectidField.$("input"), delay)
  }

  selectFirstSubjectFromClinicalData(delay: number = 5000) {
    const index = 0
    this.waitDisplayedElement(FilterSection.clinicalSubjectidField, delay)
    //"Subject Selection" filter should contain the ".clinical_subjects-subjectid" input field
    this.openClinicalSubjectIdInput(delay)

    if (FilterSection.clinicalSubjectidAvailableOptions.length > 0) {
      FilterSection.clinicalSubjectidAvailableOptions[index].click()
      browser.pause(500)
      browser.keys('Escape')
      browser.pause(500)
    } else {
      throw new Error('Dropdown menu with "Subject ID" items does not contain any option. Recheck section manualy and run again!')
    }
  }

  waitClinicalStudyidInputField(delay: number) {
    this.waitDisplayedElement(FilterSection.clinicalStudyidField, delay)
  }

  getUnmarkedCheckboxes(delay: number = 5000): ElementArray {
    return Table.unmarkedCheckboxes(delay)
  }

  selectRowFromSecondTableByFileType(name: string, delay: number = 5000): void { //TODO: maybe updated
    const index = 0
    Table.waitFirstRow(delay)
    //Wait until Main table is loaded and select first row
    Table.selectOneRowFromMainTable(index, 1)
    const tileImage = Table.filterRowByItemsName(name)
    if (tileImage) {
      tileImage.click()
      browser.pause(500)
    } else throw new Error('Raw Data table must contain at least 1 "tile-image" element. Check condition and run again!')
    //Wait when the button=Preview is clickable
    this.clickOnElement(Button.downloadPreview, delay)
    browser.pause(500)
  }
  //TODO:
  clearToDefaultSettingsItems(defaultNumber: number, minLength: number, delay: number = 5000): Array<String> {
    const index = 0
    //Open ProcessedData preview and select data
    this.selectRowFromMainAndSecondTable(index, delay)
    //Return default item
    return this.openAndSelectAdditionalSettings(defaultNumber, minLength, delay)//TODO: set using button
  }

  //TODO:
  clearToDefaultRawSettingsItems(defaultNumber: number, minLength: number, delay: number = 5000): Array<String> {
    const index = 0
    //Open ProcessedData preview and select data
    this.selectRowFromMainAndSecondTable(index, delay)
    //Return default item
    return this.openAndSelectSettings(defaultNumber, minLength, delay)//TODO: set using button
  }

  selectRowFromMainAndSecondTable(index: number, delay) {
    Table.waitFirstRow(delay)
    //Wait until Main table is loaded and select first row
    Table.selectOneRowFromMainTable(index, 1)
    //Wait until Processed Data TAB contains elements
    Table.selectOneRowFromSecondDataTable(index, 1)
  }

  getDownloadTileImageFile(name: string, delay: number): string {
    const index = 0
    Table.waitFirstRow(delay)
    //Wait until Main table is loaded and select first row
    Table.selectOneRowFromMainTable(index, 1)
    browser.pause(500)
    this.clickOnElement($$(".panel-title > a")[1], delay)
    //Filtering by Subject ID drop down items
    if (!(FilterSection.clinicalSampleFileViews.length > 0)) throw new Error('Dropdown menu with "file type" does not contain any item. Recheck section and run again!')
    this.setElementValue(FilterSection.clinicalSampleFileViewInput, name, delay)
    browser.keys('Enter')
    browser.keys('Escape')
    browser.pause(500)
    Table.selectOneRowFromSecondDataTable(index, 1)
    browser.pause(500)
    // get the value of the 'href' attibute on the download link e.g. '/some-file.txt'
    const path = $$("tbody")[1].$("tr.selected").$$("td")[7].getText()
    console.log("Filepath for downloading: ", path)

    return path
  }

  activateRawFileOption(delay: number = 5000): void {
    //Wait when the button=Preview is clickable
    this.clickOnElement(Button.downloadBtn, delay)
    browser.pause(500)
    this.clickOnElement($("a=Raw Files"), delay)    
  }

  openProcessedTab(delay: number): void {
    //Open ProcessedData preview
    Table.waitFirstRow(delay)
    //Actvate Processed Data TAB
    this.clickOnElement(this.processedTab, delay)
  }

  openAndSelectAdditionalSettings(defaultNumber: number, minLength: number, delay: number): Array<String> {
    //Click on the Settings button
    this.clickOnElement(Button.downloadAdditionalSettings, delay)
    SelectionManager.clearSelectionAndCheckDefaultSelections(defaultNumber, minLength, delay)

    return SelectionManager.defaultColumnsArray()
  }

  openAndSelectSettings(defaultNumber: number, minLength: number, delay: number): Array<String> {
    //Click on the Settings button
    this.clickOnElement(Button.downloadSettings, delay)
    SelectionManager.clearSelectionAndCheckDefaultSelections(defaultNumber, minLength, delay)

    return SelectionManager.defaultColumnsArray()
  }

  previewColumnListAfterSelectingAdditionalColumns(defaultColumns: Array<String>, delay: number = 5000): { updatedList: Array<String>, tableColumnsList: Array<String> } {
    const addedList = SelectionManager.addedTwoColumnsToFileListingWithSelectedList(defaultColumns.length + 2,delay, 3)
    //Open ProcessedData preview
    Button.openProcessedPreviewDataWindow(delay)

    return this.updatedAndDefaultList(addedList, delay)
  }

  previewRawColumnListAfterSelectingAdditionalColumns(defaultColumns: Array<String>, delay: number = 5000): { updatedList: Array<String>, tableColumnsList: Array<String> } {
    const addedList = SelectionManager.addedTwoColumnsToFileListingWithSelectedList(defaultColumns.length + 2,delay, 3)
    //Open ProcessedData preview
    Button.openFileListingWindow(delay)

    return this.updatedAndDefaultList(addedList, delay)
  }

  updatedAndDefaultList(newList: Array<String>, delay: number = 5000): { updatedList: Array<String>, tableColumnsList: Array<String> } {

    return { 
      updatedList: newList,
      tableColumnsList: Table.getColumnsListFromFileListPreview(delay, 1000)
    }
  }

  isProcessedBtnUnclickable(delay: number = 5000): boolean {
    this.waitDisplayedElement(Button.downloadProcessedBtn, delay)
    this.unclickableCondition(Button.downloadProcessedBtn, delay)

    return true
  }

  isDownloadPreviewBtnUnclickable(delay: number = 5000): boolean {
    this.waitDisplayedElement(Button.downloadPreviewData, delay)
    this.unclickableCondition(Button.downloadPreviewData, delay)

    return true
  }

  isPreviewBtnUnclickable(delay: number = 5000): boolean {
    this.waitDisplayedElement(Button.downloadPreview, delay)
    this.unclickableCondition(Button.downloadPreview, delay)

    return true
  }

  isDownloadBtnUnclickable(delay: number = 5000): boolean {
    this.waitDisplayedElement(Button.downloadBtn, delay)
    this.unclickableCondition(Button.downloadBtn, delay)

    return true
  }

  unclickableCondition(element: Element, delay: number) {
    browser.waitUntil(
      () => element.isClickable() === false,
      {
        timeout: delay,
        timeoutMsg: `Expected "${element.selector}" button should be no clickable (${delay}ms.)`
      }
    )
  }

  isAdditionalSettingsBtnClickable(delay: number = 5000): boolean {
    this.waitClickableElement(Button.downloadAdditionalSettings, delay)

    return true
  }

  isSettingsBtnClickable(delay: number = 5000): boolean {
    this.waitClickableElement(Button.downloadSettings, delay)

    return true
  }

  open(): string {
    return super.open(`/datadownload`)
  }
}

export const DataDownload = new DataDownloadPagePO()