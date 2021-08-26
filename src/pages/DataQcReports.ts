import { BasePO } from "./Base";
import { Dropdown } from "../page-components/Dropdowns";
import { saveDifScreenshot } from "../../src/misc/functions";

export class DataQcReprtsPagePO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      menuFormGroup: ".form-group",
      selectGroupLable: "label",
      downloadButtonWithToggle: "button[data-toggle='dropdown']",
      downloadToggleMenu: "ul.dropdown-menu",
      downloadToggleItems: "a[role='menuitem']",
      reportPrecisionLogo: ".brand",
      reportNavbar: "#navbar",
      contantMain: "#content_main"
    }
  }
  
  get selectReportLable() {return $(this.pageSelectors.menuFormGroup).$(this.pageSelectors.selectGroupLable)}

  get reportPrecisionBrand() {return $(this.pageSelectors.reportPrecisionLogo)}

  get contantMain() {return $(this.pageSelectors.contantMain)}

  get downloadToggleButton() {return $(this.pageSelectors.downloadButtonWithToggle)}

  get downloadReportPdfOption() {return $(this.pageSelectors.downloadToggleMenu).$$(this.pageSelectors.downloadToggleItems)[0]}

  get downloadReportHTMLOption() {return $(this.pageSelectors.downloadToggleMenu).$$(this.pageSelectors.downloadToggleItems)[1]}

  checkReportGroupLabelText(label: string): void {
    expect(this.selectReportLable).toHaveText(label)
  }

  menuitemDataValue(delay: number = 5000): string {
    Dropdown.selectedDropdownMenuItem.waitForExist({ timeout: delay })

    return Dropdown.selectedDropdownMenuItem.getAttribute('data-value')
  }

  isReportDefaultItemHtml(extension: string = '.html', delay: number = 5000): boolean {
    if (Dropdown.toggleMenuItems.length < 1) throw new Error(`Dropdown reports menu should contain more than 1 item to select!`)
    this.waitDisplayedElement(Dropdown.defaultMenuItem, delay)
    expect(Dropdown.defaultMenuItem).toHaveAttributeContaining('data-value', extension)

    return true    
  }

  checkReportDownloadButtonIsDispalyed(delay: number = 5000): void {
    this.downloadToggleButton.waitForDisplayed({ timeout: delay })
  }

  isToggleMenuPdfOptionClickable(screenName: string, delay: number = 5000): boolean {
    this.openDownloadToggleMenu(delay)
    expect(this.downloadReportPdfOption).toHaveText("PDF")
    this.waitClickableCursor(delay)
    saveDifScreenshot(screenName)
    //Close toggle menu 
    this.clickOnElement(this.downloadToggleButton, delay)

    return true
  }

  isToggleMenuHtmlOptionClickable(screenName: string, delay: number = 5000): boolean {
    this.openDownloadToggleMenu(delay)
    expect(this.downloadReportHTMLOption).toHaveText("HTML")
    this.waitClickableCursor(delay)
    saveDifScreenshot(screenName)
    //Close toggle menu 
    this.clickOnElement(this.downloadToggleButton, delay)

    return true
  }

  waitClickableCursor(delay: number) {
    browser.waitUntil(
      () => this.downloadReportHTMLOption.getCSSProperty('cursor').value !== 'not-allowed',
      {
        timeout: delay,
        timeoutMsg: `Mouse pointer shoud not have the 'not-allowed' style (delay = ${delay}ms)`
      }
    )
  }

  downloadHtmlReport(delay: number = 5000): void {
    this.openDownloadToggleMenu(delay)
    this.clickOnElement(this.downloadReportHTMLOption, delay)
  }

  openDownloadToggleMenu(delay: number = 5000): void {
    this.downloadToggleButton.waitForClickable({ timeout: delay })
    this.downloadToggleButton.click()
  }

  waitContantMainBlockIsDisplayed(delay: number = 5000): void {
    this.contantMain.waitForDisplayed({
      timeout: delay,
      timeoutMsg: `Expect ${this.pageSelectors.contantMain} should be displayed after ${delay}.`
    })
  }
  
  open(): string {
    return super.open(`/qc_report`)
  }
}

export const DataQcReprts = new DataQcReprtsPagePO()