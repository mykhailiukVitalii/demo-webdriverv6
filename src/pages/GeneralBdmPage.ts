import { BasePO } from "./Base"
import { DataSelection } from "../page-components/DataSelection"
import { Dropdown } from "../page-components/Dropdowns"
import { Table } from "../page-components/Table"
import { ElementArray } from "@wdio/sync";

export class BdmPagePO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      h1header: "h1.text-center",
      rightPartItems: ".pull-right li",
      widgetNews: ".widget-news-content",
      menuSidebar: "a.dev-page-sidebar-collapse",
      leftNavigationMenu: "ul.dev-page-navigation",
      createDashboardLink: "a[href='#/newdashboard']",
      loadDashboardsLink: "a[href='#/list-dashboards']",
      biomarkerUploadDataItem: "a[href='#/dataupload']",
      biomarkerDownloadDataItem: "a[href='#/datadownload']",
      biomarkerTransferDataItem: "a[href='#/transferlogs']",
      biomarkerQcDataItem: "a[href='#/qc_report']",
      widgetNewsTitle: ".widget-news-content h3",
      dataUploadLink: ".home-list-item[href='#/dataupload']",
      dataDownloadLink: ".home-list-item[href='#/datadownload']",
      dataTransferLogLink: ".home-list-item[href='#/transferlogs']",
      dataInventoryLink: ".home-list-item[href='#/charts/bdm/datainventory']",
      dataQcReporterLink: ".home-list-item[href='#/qc_report']",
      dataPatientprofilesLink: ".home-list-item[href='#/patientprofiles']",
      msiHomeLink: ".home-list-item=Master Sample Inventory",
      dataSelectionIcon: "li a i.fa-database",
      logoImage: "img.company-logo"
    }
  }

  get h1header() {return $(this.pageSelectors.h1header)}

  get logoImage() {return $(this.pageSelectors.logoImage)}

  get dataSelectionIcon() {return $(this.pageSelectors.dataSelectionIcon)}

  get rightLogoItems() {return $$(this.pageSelectors.rightPartItems)[0].$('img')}

  get rightUserNameHeader() {return $$(this.pageSelectors.rightPartItems)[1].$$('div')[0]}

  get rightUserName() {return $$(this.pageSelectors.rightPartItems)[1].$('strong')}

  get h3WidgetSimpleInventory() {return $$(this.pageSelectors.h3WidgetNews)[1].$('h3')}

  get h3WidgetTitle() {return $$(this.pageSelectors.widgetNewsTitle)}

  get menuSidebar() {return $(this.pageSelectors.menuSidebar)}

  get biomarkerUploadDataItem() {return $(this.pageSelectors.biomarkerUploadDataItem)}

  get biomarkerDownloadDataItem() {return $(this.pageSelectors.biomarkerDownloadDataItem)}

  get biomarkerTransferDataItem() {return $(this.pageSelectors.biomarkerTransferDataItem)}

  get biomarkerQcDataItem() {return $(this.pageSelectors.biomarkerQcDataItem)}

  get createDashboardLink() {return $(this.pageSelectors.createDashboardLink)}

  get loadDashboardsLink() {return $(this.pageSelectors.loadDashboardsLink)}

  get leftNavigationMenuWithChildItem() {return $$(this.pageSelectors.leftNavigationMenu)[0]}

  get dataUploadLink() {return $(this.pageSelectors.dataUploadLink)}

  get dataDownloadLink() {return $(this.pageSelectors.dataDownloadLink)}

  get dataTransferLogLink() {return $(this.pageSelectors.dataTransferLogLink)}

  get dataQcReporterLink() {return $(this.pageSelectors.dataQcReporterLink)}

  get dataPatientprofilesLink() {return $(this.pageSelectors.dataPatientprofilesLink)}

  get dataInventoryLink() {return $(this.pageSelectors.dataInventoryLink)}

  get msiHomeLink() { return $(this.pageSelectors.msiHomeLink) }

  openSideBar(timeout: number = 5000): void {
    this.menuSidebar.waitForExist({ timeout: timeout })
    this.menuSidebar.click()
  }

  openDataSelection(delay: number): void {
    this.clickOnElement(this.dataSelectionIcon, delay)
  }

  applySubjectSelection(subjectSelection: string, count: number, delay: number = 5000) { 
    //Open Data Selection modal
    this.openDataSelection(delay)
    //Go to the Subject Selection TAB
    DataSelection.activateSubjectSelectionTab(delay)
    //Wait Subject Selection result table
    DataSelection.selectionRenderCondition(delay)
    //Fill in search field using Subject Selection name and check count of returned result
    return DataSelection.applySelectionUsingFillSearch(subjectSelection, count, delay)
  }

  setSampleSelectionName(selectionName: string, delay: number = 5000): string {
    //Open Data Selection modal
    this.openDataSelection(delay)
    //Wait Sample Selection result table
    DataSelection.selectionRenderCondition(delay)
    //Add new Sample Selection
    this.clickOnElement(DataSelection.addSelectionIcon, delay)
    //Open Edit Sample Selection name form
    DataSelection.setSubjectName(selectionName)
    //Return updated Sample Selectio name
    return DataSelection.selectionTitle.getText()
  }

  setAvailableBiomarkerList(options: {dropdown: number, selectionName: string, count: number}, delay: number = 5000): string[] {
    let biomarkers: string[]
    //Select Biomarker type
    const {dropdown, selectionName, count} = options
    this.clickOnElement(Dropdown.defaultSelectizeItem(dropdown), delay)
    //Select item from exist selection menu
    this.selectItemSelectionByName(dropdown, selectionName, delay)
    //Add new biomarker to the List
    this.addBiomarkers(count, delay)
    //Get current biomakers list
    biomarkers = this.biomarkersList()   

    return biomarkers
  }
  
  biomarkersList(): string[] {
    let selectedBiomarkers: string[] = []
    const biomarkers = $(".selected-biomarkers").$$("div")[1].$$("span")
    biomarkers.forEach(element => {
      selectedBiomarkers.push(element.getText())          
    })

    return selectedBiomarkers
  }

  addBiomarkers(count: number, delay: number): boolean {
    // let selectedBiomarkers: string[]
    const biomarkersList = $(".selectize-form-group")
    this.clickOnElement(biomarkersList.$("input"), delay)
    browser.pause(200)
    const item = 1
    for (let index = 0; index < count; index++) {
      this.clickOnElement(biomarkersList.$(".available-biomarkers").$$(".available-biomarker-item")[item], delay)
    }

    return true        
  }

  //TODO: refactor as simple component
  selectItemSelectionByName(fieldNumber: number, name: string, delay: number): void {
    //If Selection menu contains items - select first element
    const selection = Dropdown.selectionMenu(fieldNumber)
    //By defult using first item
    if (selection.length === 0) throw new Error('Sample Selection does not contain any Biomarker type!')
    const item = selection.find(item => item.getText().toLowerCase().includes(name.toLowerCase()))
    if(!item) throw new Error(`Item with ${name} does not exist in the dropdown-content!`)
    this.clickOnElement(item, delay)
  }

  findSubjectIdInTable(subjectRows: ElementArray, subjectIds: Array<string>): number {
    return DataSelection.subjectidsFromTable(subjectRows, subjectIds)
  }

  menuSubmoduleItem(index: number, timeout: number = 5000) {
    const item = this.leftNavigationMenuWithChildItem.$$('li.has-child')[index].$('a').$('span')
    item.waitForExist({ timeout: timeout })

    return item
  }

  open(): string {
    //return session-ring cookies
    return super.open(`/`)
  }

}

export const BdmPage = new BdmPagePO()