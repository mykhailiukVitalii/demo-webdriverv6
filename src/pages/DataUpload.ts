import { BasePO } from "./Base"
import { UploadForm } from "../page-components/UploadForm"
import { Table } from "../page-components/Table"
import { FilterSection } from "../page-components/FilterPanel"
import { smallDelay } from "../misc/timeouts"

export class DataUploadPagePO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      selectedLabel: "label.control-label",
      noFilesMessage: ".list-group p",
      clearAllLink: "a.pull-right",
      selectedFolderIcon: "i.fa-folder",
      uploadTabs: "ul.container-tabs",
      selectionDropdown: ".selectize-input.not-full input",
      dropdownContent: ".selectize-dropdown-content"
    }
  }

  get selectedLabel() { return $(this.pageSelectors.selectedLabel) }

  get selectedFilesIcon() { return $(this.pageSelectors.selectedFilesIcon) }

  get selectedFolderIcon() { return $(this.pageSelectors.selectedFolderIcon) }

  get noFilesMessage() { return $(this.pageSelectors.noFilesMessage) }

  get uploadTabs() { return $(this.pageSelectors.uploadTabs).$('li').$('a') }

  get selectionDropdown() { return $(this.pageSelectors.selectionDropdown) }

  dropDownOption(id: number) {
    return $$(this.pageSelectors.dropdownContent)[id].$$('.option')
  }

  selectDropdownItem(menuId: number, index: number = 0) {
    //By defult using first item from the list (index = 0)
    this.dropDownOption(menuId)[index].click()
    browser.pause(smallDelay)
    browser.keys("Escape")
  }

  moveCursorToUploadButton(delay: number = 5000, pause: number = 1000) {
    this.moveCursorOnElement(UploadForm.confirmUploadButton, delay, pause)
  }

  fillInDataUploadForm(filepath: string, description: string, tag: string, delay: number = 5000) {
    //Click on the "Select files icon"
    this.clickOnElement(UploadForm.selectFilesIcon, delay)
    browser.pause(500)
    //Upload file to the App
    console.log('remotePath: ', filepath)
    this.setElementValue(UploadForm.uploadFile, filepath, delay)
    //Set file Description field
    console.log("File description: ", description)
    this.setElementValue(UploadForm.firstInputField, description, delay)
    //Set file TAG
    this.setElementValue(UploadForm.tagsInput, tag, delay)
    browser.pause(300)
    browser.keys("Enter")
    browser.pause(300)
  }

  confirmUploading(delay: number = 5000) {
    //Click on the "Upload button"
    this.clickOnElement(UploadForm.confirmUploadButton, delay)
    //Whait when element uploaded
    this.clearFilesMessage(delay)
  }

  confirmButton(delay: number = 5000) {
    return this.waitDisplayedElement(UploadForm.confirmUploadButton, delay)
  }

  clearFilesMessage(delay: number) {
    browser.waitUntil(
      () => UploadForm.filesList.getText() === "No files selected ...",
      {
        timeout: delay,
        timeoutMsg: `The List of files does not clear after file uploading (delay = ${delay}ms.)`
      })
  }

  filterTableByFilenameAndDescription(filename: string, description: string, delay: number) {
    //Open Table Filters panel
    this.clickOnElement(FilterSection.tableFilters, delay)
    //Set filename field(Filtering by File Name)
    this.setElementValue(FilterSection.filenameField, filename, delay)
    //Set Description(Filtering by Document Description)
    this.setElementValue(FilterSection.fileDescriptionField, description, delay)
  }

  displayMainTableItemsByName(name: string, delay: number = 5000) {
    return Table.waitTableUpdatingByName(name, delay)
  }

  open(): string {
    return super.open(`/dataupload`)
  }
}

export const DataUpload = new DataUploadPagePO()