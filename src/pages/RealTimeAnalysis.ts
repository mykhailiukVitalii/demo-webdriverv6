import { BasePO } from "./Base";
import { PlotSettingsForm } from "../page-components/PlotSettings";
import { Modal } from "../page-components/Modal";
import { Dropdown } from "../page-components/Dropdowns";
import { Widget } from "../page-components/WidgetContainer";
import { Chart } from "./Chart";
import { Button } from "../page-components/Buttons";
import { saveDifScreenshot } from "../../src/misc/functions";
import { plotLongDelay } from "../../src/misc/timeouts"

import { Element, ElementArray } from "@wdio/sync";

export class RealTimeAnalysisPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      realTimeModuleHeader: "h3=Real-time Analysis and Visualization",
      volcanoHeader: "h3=Volcano plot",
      volcanoLink: ".widget-news-content a[href='#/charts/bdm/volcano']",
      volcanoFooterLink: ".widget-news-footer [href='#/charts/bdm/volcano']",
      correlationLink: ".widget-news-footer a[href='#/charts/bdm/heatmap']",
      studySummaryLink: ".widget-news-footer a[href='#/charts/bdm/study-summary']",
      scatterLink: ".widget-news-footer a[href='#/charts/bdm/scatter']",
      pcaLink: ".widget-news-footer a[href='#/charts/bdm/pca']",
      patintTrajectoriesLink: ".widget-news-footer a[href='#/charts/bdm/spaghetti']",
      swimmerLink: ".widget-news-footer a[href='#/charts/clinicaldata/swimmer']",
      waterfallLink: ".widget-news-footer a[href='#/charts/clinicaldata/waterfall-widget']",
      clusteringLink: ".widget-news-footer a[href='#/charts/bdm/clustering']",
      survivalAnalysisLink: ".widget-news-footer a[href='#/charts/bdm/kaplan-meier']",
      expressionLink: ".widget-news-footer a[href='#/charts/bdm/expression-heatmap']",
      sampleInventoryLink: ".widget-news-footer a[href='#/charts/bdm/sampleinventory']",
      radarLink: ".widget-news-footer a[href='#/charts/bdm/radar']"
    }
  }

  get realTimeModuleHeader() { return $(this.pageSelectors.realTimeModuleHeader) }

  get volcanoPlotHeader() { return $(this.pageSelectors.volcanoHeader) }

  get volcanoLink() { return $(this.pageSelectors.volcanoLink) }

  get volcanoFooterLink() { return $(this.pageSelectors.volcanoFooterLink) }

  get correlationLink() { return $(this.pageSelectors.correlationLink) }

  get studySummaryLink() { return $(this.pageSelectors.studySummaryLink) }

  get scatterLink() { return $(this.pageSelectors.scatterLink) }

  get pcaLink() { return $(this.pageSelectors.pcaLink) }

  get patintTrajectoriesLink() { return $(this.pageSelectors.patintTrajectoriesLink) }

  get swimmerLink() { return $(this.pageSelectors.swimmerLink) }

  get waterfallLink() { return $(this.pageSelectors.waterfallLink) }

  get clusteringLink() { return $(this.pageSelectors.clusteringLink) }

  get survivalAnalysisLink() { return $(this.pageSelectors.survivalAnalysisLink) }

  get expressionLink() { return $(this.pageSelectors.expressionLink) }

  get sampleInventoryLink() { return $(this.pageSelectors.sampleInventoryLink) }

  get radarLink() { return $(this.pageSelectors.radarLink) }

  waitStudyLinkAndClick(elemntDelay: number = 15000, plotDelay: number = 10000): void {
    this.studySummaryLink.waitForClickable({ timeout: elemntDelay })
    browser.pause(plotDelay)
    this.studySummaryLink.scrollIntoView()
    this.studySummaryLink.click()
  }

  skipIfModuleNoExist(context: any): void {
    if (!browser.sharedStore.get('isRealTimeExist')) {
      console.log('[WARNING MESSAGE] : The current application does not contain a Real-Time Analysis module! THIS TEST will be SKIPPED!!!')
      context.skip()
    }
  }

  chooseWidgetFromList(widgetLink: Element, delay: number = 5000): void {
    //Select Widget from the available List
    this.scrolToElementAndClickWithPause(widgetLink, delay)
    //Wait when Modal settings form is displayed (".modal-content")
    this.waitDisplayedElement(PlotSettingsForm.modalContent, delay)
  }

  chooseWidgetFromListWithPlot(widgetLink: Element, delay: number = 5000): void {
    //Select Widget from the available List
    this.scrolToElementAndClickWithPause(widgetLink, delay)
    // //Wait when Plot is displayed ("g.plot")
    Chart.waitChartLegendSection(delay)
  }

  openSelectionMenuAndHideLegend(delay: number = 5000) {
    //Open Plot Settings modal window
    this.clickOnElement(Widget.chartSettingsButton, delay)
    //Click on the "Hide legends" checkbox and click on it
    this.clickOnElement(PlotSettingsForm.hideLegendCheckbox, delay)
    browser.pause(300)
    this.clickOnElement(Button.submitButton, delay)
    //Default pause
    browser.pause(3000)
  }

  openSelectionMenuAndHideLegendAsRadar(delay: number = 5000) {
    Widget.chartLegend.waitForDisplayed({ timeout: delay })
    //Open Plot Settings modal window
    this.clickOnElement(Widget.chartSettingsButton, delay)
    browser.pause(300)
    this.scrolToElementAndClick(PlotSettingsForm.radarhideLegendCheckbox, delay)
    //Confirm changes by clicking on the "Submit"
    browser.pause(300)
    this.clickOnElement(Button.submitButton, delay)
    //Default pause
    browser.pause(3000)
  }

  openSelectionMenuAndActivateZaxisWaterfall(delay: number = 5000) {
    //Open Plot Settings modal window
    this.clickOnElement(Widget.chartSettingsButton, delay)
    this.clickOnElement($$(".checkbox-inline")[1], delay)
    browser.pause(300)
    this.clickOnElement(Button.submitButton, delay)
    //Default pause
    browser.pause(1500)
  }

  openSelectionMenuAndSelectFirstOption(fieldNumber: number, delay: number = 5000) {
    const index = 0
    //Open Selection drop down menu
    this.clickOnElement(Dropdown.selectionDropdown, delay)
    //Select item from exist selection menu
    this.selectItemFromSelectionMenu(fieldNumber, index, delay)
    //If menu contains biomarkers - select all
    if (PlotSettingsForm.availableBiomarkerArray.length === 0) throw new Error('Patient Trajectories plot does not contain items in the Available Biomarkers section!')
    //Select all by clicking on the Select all link
    this.clickOnElement(PlotSettingsForm.biomarkerSelectAllLink, delay)
  }

  selectTwoAvailableBiomarkers(delay: number = 5000, menuNumber: number = 3): void {
    //Open Selection drop down menu and select first Biomarker type (index=0)
    const index = 0
    this.clickOnElement(Dropdown.selectionDropdown, delay)
    //Select item from exist selection menu (by default Data Selection dropdown number = 3 for Scatterplot )
    this.selectItemFromSelectionMenu(menuNumber, index, delay)
    //To generate a 2D plot - need at least 2 biomarkers
    if (PlotSettingsForm.availableBiomarkerArray.length < 3) throw new Error('Selected Biomarker must contain more than 2 available biomarkers!')
    //Select the first available biomarker from the list (index = 0)
    browser.pause(1000)
    PlotSettingsForm.selectBiomarkerListItem(0)
    //Select the second available biomarker from the list (index = 0)
    browser.pause(1000)
    PlotSettingsForm.selectBiomarkerListItem(0)
  }

  selectionFirstAvailableBiomarker(fieldNumber: number, delay: number = 5000) {
    //Open Selection drop down menu and select first Biomarker type (index=0)
    const index = 0
    this.clickOnElement(Dropdown.selectionDropdown, delay)
    //Select item from exist selection menu
    this.selectItemFromSelectionMenu(fieldNumber, index, delay)
    //If menu contains biomarkers - select all
    if (PlotSettingsForm.availableBiomarkerArray.length < 1) throw new Error('Selected Biomarker must contain more than 1 available biomarkers!')
    //Select the first available biomarker from the list (index = 0)
    browser.pause(1000)
    PlotSettingsForm.selectBiomarkerListItem(0)
  }

  setReferenceLineData(options: {yValue: string[], yLabel: string[]}, delay: number = 5000, isAdditional: boolean = false): void {
    const { yValue, yLabel } = options
    //Set Values
    this.setElementValue(PlotSettingsForm.referenceInputYByIndex(0), yValue[0], delay)
    this.setElementValue(PlotSettingsForm.referenceInputYByIndex(2), yValue[1], delay)
    //Set Labels
    this.setElementValue(PlotSettingsForm.referenceInputYByIndex(1), yLabel[0], delay)
    this.setElementValue(PlotSettingsForm.referenceInputYByIndex(3), yLabel[1], delay)

    if(isAdditional) {
      //Set Values for Reference Line Y2
      this.setElementValue(PlotSettingsForm.referenceInputY2ByIndex(0), yValue[2], delay)
      this.setElementValue(PlotSettingsForm.referenceInputY2ByIndex(2), yValue[3], delay)
      //Set Labels for Reference Line Y2
      this.setElementValue(PlotSettingsForm.referenceInputY2ByIndex(1), yLabel[0] + "y2", delay)
      this.setElementValue(PlotSettingsForm.referenceInputY2ByIndex(3), yLabel[1] + "y2", delay)
    }
  }

  isReferenceLine2Exist(delay: number = 5000): boolean {
    let result: boolean = false

    result = browser.waitUntil(
        () => PlotSettingsForm.referenceLineY2.isDisplayed() === true,
        {
          timeout: delay,
          timeoutMsg: `"Reference Line Y2" section does not eist on the Plot Settings form (${delay}ms).`
        }
      ).valueOf()
      PlotSettingsForm.referenceLineY2.scrollIntoView()

    return result
  }

  getCurrentAnnotation(isAll: boolean = false, delay: number = 5000) {
    let result = { referenaceLable1: "", referenaceLable2: "", referenaceLable3: "", referenaceLable4: "" }
    //Get Current reference annotation for Primary Y Selection and Secondary Y Selection
    if (isAll) {
      result.referenaceLable3 = this.waitDisplayedElement(Widget.referenceAnnotationsText[2], delay).getText()
      result.referenaceLable4 = this.waitDisplayedElement(Widget.referenceAnnotationsText[3], delay).getText()
    }
    //Get Current reference annotation only for Primary Y Selection
    result.referenaceLable1 = this.waitDisplayedElement(Widget.referenceAnnotationsText[0], delay).getText()
    result.referenaceLable2 = this.waitDisplayedElement(Widget.referenceAnnotationsText[1], delay).getText()

    return result
  }

  selectionAvailableBiomarkerByName(options: { menuItem: number, biomarkerType: string, bname: string[] }, delay: number = 5000, getBiomarkers: boolean = false, isSecondary: boolean = false): string[] {
    let availableBiomarkers: string[] = []
    const { menuItem, biomarkerType, bname } = options;
    //Select available Biomarker by type for Primary / Secondary Y Selection
    (isSecondary)
      ? this.selectAvailableBiomarkerType(menuItem, biomarkerType, delay, true)
      : this.selectAvailableBiomarkerType(menuItem, biomarkerType, delay)

    if (getBiomarkers) {
      availableBiomarkers = this.getAvailableBiomarkersList()
      console.log("Plot available biomarkers: ", availableBiomarkers)
    }
    //Select Available biomarker by name
    bname.forEach((element) => {
      PlotSettingsForm.selectAvailableBiomarkerByName(element, delay)
    })

    return availableBiomarkers
  }

  selectAvailableBiomarkerType(menuItem: number, biomarkerType: string, delay: number, isSecondary: boolean = false) {
    (isSecondary) 
      ? this.clickOnElement(Dropdown.selectionDropdownAsSecondary, delay)
      : this.clickOnElement(Dropdown.selectionDropdown, delay)
    //Select item from exist selection menu
    this.selectItemSelectionByName(menuItem, biomarkerType, delay)
  }

  getAvailableBiomarkersList(): string[] {
    return PlotSettingsForm.getAvailableBiomarkerList()
  }

  updateSettingsWithOptions(settings: { settingsLable: string, optionNames: string[], defaultToResult: boolean, closeDefault: boolean }, delay: number = 5000): string[] {
    const items: string[] = []

    const menu = {
      menuElement: $(`label=${settings.settingsLable}`).parentElement().nextElement().$(".selectize-control").$(".selectize-input"),
      label: settings.settingsLable
    }

    try {
      if (menu.menuElement.$(".item").isDisplayed()) {
        const menutext = menu.menuElement.$(".item").getText().split("×")[0].trim()
        console.log("Default menu item: ", menutext);
        if (settings.defaultToResult) {
          items.push(menutext)
        }
        if (settings.closeDefault) {
          this.clickOnElement(menu.menuElement.$(".item a.remove"), delay)
        }
      }
    } catch (e) {
      console.log("Menu does not contain default .item")
    }
    settings.optionNames.map(name => {
      //Open menu for selecting
      this.clickOnElement(menu.menuElement, delay)
      //Select option
      items.push(this.selectOptsByNames(menu, name, delay))
    })
    //Select item from exist selection menu
    return items
  }

  selectOptsByNames(menu: { menuElement: Element, label: string }, name: string, delay: number): string {
    let itemName: string
    //If Selection menu contains items - select first element
    const content = menu.menuElement.nextElement().$(".selectize-dropdown-content").$$(".option")
    //menu must contain more than 1 item
    if (content.length === 0) throw new Error(`Plot Settings does not contain .option for the ${menu.label} menu!`)
    //
    const item = content.find(item => item.getText().toLowerCase().includes(name.toLowerCase()))
    if (!item) throw new Error(`Item with ${name} does not exist in the ${menu.label} menu!`)
    itemName = item.getText()
    this.clickOnElement(item, delay)
    browser.pause(500)
    browser.keys("Escape")
    browser.pause(500)

    return itemName
  }

  enableTrellisAndSetOption(columntype: string, field: number, delay: number = 5000, byRow: boolean = false) {
    this.clickOnElement(PlotSettingsForm.trellisModeCheckbox, delay)
    if (byRow) {
      //TODO: use selector label=Row for all Plot
      this.clickOnElement(PlotSettingsForm.trellisModeRowInput, delay)
      //Use available type from the Column dropdown-menu(index of filed = 5 for Study Summary)
      this.selectItemSelectionByName(field, columntype, delay)
    } else {
      this.clickOnElement(PlotSettingsForm.trellisModeColumnInput, delay)
      //Use available type from the Column dropdown-menu(index of filed = 6 for Study Summary)
      this.selectItemSelectionByName(field, columntype, delay)
    }
  }

  enableTrellisAndSetBothOption({ columType, columnField, rowType, rowField }, delay: number = 5000) {
    this.clickOnElement(PlotSettingsForm.trellisModeCheckbox, delay)
    //Set Row option
    this.clickOnElement(PlotSettingsForm.trellisModeRowInput, delay)
    //Use available type from the Column dropdown-menu(index of filed = 5 for Study Summary)
    this.selectItemSelectionByName(rowField, rowType, delay)
    browser.pause(500)
    //Set Column option
    this.clickOnElement(PlotSettingsForm.trellisModeColumnInput, delay)
    //Use available type from the Column dropdown-menu(index of filed = 6 for Study Summary)
    this.selectItemSelectionByName(columnField, columType, delay)
  }

  enableBMContributionOption(delay: number = 5000) {
    this.clickOnElement(PlotSettingsForm.biomarkerContributionMode, delay)
  }

  enable95ConfOption(delay: number = 5000) {
    this.clickOnElement($("label*=95% Confidence").parentElement().nextElement().$(".checkbox-inline").$("label"), delay)
  }

  plotYtitleEnableTrellis(name: string[], both: boolean = false, delay: number = 5000): { yTrellisFirst: string, yTrellisSecond: string } {
    let yTrellisFirst: string, yTrellisSecond: string

    if (both) {
      yTrellisFirst = Chart.waitPlotRenderEqualUpdate(Widget.plotYaxisTrellisRowLabel, name[0], delay).getText()
      browser.pause(500)
      yTrellisSecond = Chart.waitPlotRenderEqualUpdate(Widget.plotYaxisTrellisBothSecondLabel, name[1], delay).getText()
    }
    else {
      yTrellisFirst = Chart.waitPlotRenderEqualUpdate(Widget.plotYaxisTrellisRowLabel, name[0], delay).getText()
      browser.pause(500)
      yTrellisSecond = Chart.waitPlotRenderEqualUpdate(Widget.plotSecondYaxisTrellisRowLabel, name[1], delay).getText()
    }

    return { yTrellisFirst, yTrellisSecond }
  }

  plotXtitleEnableTrellis(name: string[], both: boolean = false, delay: number = 5000): { xTrellisFirst: string, xTrellisSecond: string } {
    let xTrellisFirst: string, xTrellisSecond: string

    if (both) {
      xTrellisFirst = Chart.waitPlotRenderEqualUpdate(Widget.plotXaxisTrellisBothLabel, name[0], delay).getText()
      browser.pause(500)
      xTrellisSecond = Chart.waitPlotRenderEqualUpdate(Widget.plotSecondXaxisTrellisBothLabel, name[1], delay).getText()
    }
    else {
      xTrellisFirst = Chart.waitPlotRenderEqualUpdate(Widget.plotXaxisTrellisColumnLabel, name[0], delay).getText()
      browser.pause(500)
      xTrellisSecond = Chart.waitPlotRenderEqualUpdate(Widget.plotSecondXaxisTrellisRowLabel, name[1], delay).getText()
    }

    return { xTrellisFirst, xTrellisSecond }
  }

  submitSettingsChanges(delay: number = 5000): void {
    this.clickOnElement(Button.submitButton, delay)
    //Default pause
    browser.pause(3000)
    //Wait when points are displayed("g.plot" selector)
    Chart.waitChartPlotContainer(plotLongDelay)
  }

  submitSettingsAs3DChanges(delay: number = 5000): void {
    this.clickOnElement(Button.submitButton, delay)
    //Default pause
    browser.pause(3000)
    //Wait 3D canvas element "#scene > canvas"
    Chart.wait3dCanvasPoints(delay)
  }

  currentXYplotLabels(delay: number = 5000): { xtitle: string, ytitle: string } {
    const xtitle = this.waitDisplayedElement($("g.g-xtitle"), delay).getText()
    console.log("currentXTitles: ", xtitle)
    browser.pause(300)
    const ytitle = this.waitDisplayedElement($("g.g-ytitle"), delay).getText()
    console.log("currentYTitles: ", ytitle)
    return { xtitle, ytitle }
  }

  swapXYaxis({ xtitle, ytitle }, delay: number = 5000): boolean {
    this.clickOnElement($("button[title='Swap axes']"), delay)
    //Wait Y-label updating
    Chart.yAxisUpdating(xtitle, delay)
    //Wait Y-label updating
    Chart.xAxisUpdating(ytitle, delay)

    return true
  }

  setXrangeSettings({ min, max }, delay: number = 5000): void {
    //Set X Range min value
    this.setElementValue(PlotSettingsForm.xRangeMinInput, min, delay)
    browser.pause(500)
    //Set X Range max value
    this.setElementValue(PlotSettingsForm.xRangeMaxInput, max, delay)
    browser.pause(500)
  }

  setYrangeSettings({ min, max }, delay: number = 5000): void {
    //Set Y Range min value
    this.setElementValue(PlotSettingsForm.yRangeMinInput, min, delay)
    browser.pause(500)
    //Set Y Range max value
    this.setElementValue(PlotSettingsForm.yRangeMaxInput, max, delay)
    browser.pause(500)
  }

  setYPrimaryRangeSettings({ min, max }, delay: number = 5000): void {
    //Set Y Range min value
    this.setElementValue(PlotSettingsForm.yAxisMinInput, min, delay)
    browser.pause(500)
    //Set Y Range max value
    this.setElementValue(PlotSettingsForm.yAxisMaxInput, max, delay)
    browser.pause(500)
  }

  xRangeValueOnPlot(delay: number = 5000): string[] {
    this.waitDisplayedElement(Widget.plotXRanges[Widget.plotXRanges.length - 1], delay)

    return Widget.plotXRanges.map((range) => range.getText())
  }

  yRangeValueOnPlot(delay: number = 5000): string[] {
    this.waitDisplayedElement(Widget.plotYRanges[Widget.plotYRanges.length - 1], delay)

    return Widget.plotYRanges.map((range) => range.getText())
  }

  updatePlotUsing3dOption(delay: number = 5000) {
    //Open Plot Settings modal window
    this.clickOnElement(Widget.chartSettingsButton, delay)
    console.log("3D generation using 3 biomarkers...")
    if (PlotSettingsForm.availableBiomarkerArray.length < 1) throw new Error('3D generation: Selected Biomarker must contain more than 1 available biomarkers!')
    //Select the third available biomarker from the list (index = 0)
    PlotSettingsForm.selectBiomarkerListItem(0)
    this.clickOnElement(Button.submitButton, delay)
    //Default pause
    browser.pause(3000)
  }

  selectItemFromSelectionMenu(fieldNumber: number, index: number, delay: number): void {
    //If Selection menu contains items - select first element
    const selection = Dropdown.selectionMenu(fieldNumber)
    //By defult using first item
    if (selection.length === 0) throw new Error('Widget does not contain items for the Selection option!')
    this.clickOnElement(selection[index], delay)
    browser.pause(500)
    browser.keys("Escape")
    browser.pause(500)
  }

  selectItemSelectionByName(fieldNumber: number, name: string, delay: number): void {
    //If Selection menu contains items - select first element
    const selection = Dropdown.selectionMenu(fieldNumber)
    //By defult using first item
    if (selection.length === 0) throw new Error('Widget does not contain items for the Data Selection option!')
    const item = selection.find(item => item.getText().toLowerCase().includes(name.toLowerCase()))
    if (!item) throw new Error(`Item with ${name} does not exist in the dropdown-content!`)
    this.clickOnElement(item, delay)
    browser.pause(500)
    browser.keys("Escape")
    browser.pause(500)
  }

  openSettingsAndUpdateOne(fieldNumber: number, screenname: string, delay: number = 5000): string {
    let noDefaultIndex: number, updatedVariable: string

    const { selection: variable, defaultVariable } = this.openSettingsBeforeVariableUpdating(fieldNumber, delay)
    saveDifScreenshot(screenname)
    if (variable.length === 0) throw new Error('Plot does not contain items for the Variable updating!')
    //Get an item different from the default     
    variable.forEach((item, index) => {
      if (item.getText() !== defaultVariable) {
        updatedVariable = item.getText()
        noDefaultIndex = index
      }
    })
    if (Boolean(!updatedVariable)) throw new Error(`Variable field does not contain additional options: updatedXVariable: ${updatedVariable}, noDefaultIndex: ${noDefaultIndex}.`)
    this.waitClickableElement(variable[noDefaultIndex], delay)
    console.log("Select no default variable: ", updatedVariable)
    //Select new Variable
    this.selectItemFromSelectionMenu(fieldNumber, noDefaultIndex, delay)
    //Confirm changes by clicking on the "Submit"
    this.clickOnElement(Button.submitButton, delay)
    //Default pause
    browser.pause(3000)

    return updatedVariable
  }

  openSettingsBeforeVariableUpdating(fieldNumber: number, delay: number = 5000): { selection: ElementArray, defaultVariable: string } {
    //Open Settings menu
    this.clickOnElement(PlotSettingsForm.chartSettingsButton, delay)
    // //Get option list Elements
    return this.defaultMenuItems(fieldNumber, delay)
  }

  defaultMenuItems(fieldNumber: number, delay: number = 5000): { selection: ElementArray, defaultVariable: string } {
    //Get default variable
    const defaultVariable = this.waitClickableElement(Dropdown.defaultSelectizeItem(fieldNumber), delay).$$(".item")[0].getText()
    //Open dropdown menu
    this.clickOnElement(Dropdown.defaultSelectizeItem(fieldNumber), delay)
    //Get option list Elements
    return { selection: Dropdown.selectionMenu(fieldNumber), defaultVariable }
  }

  changeClickMethod(fieldNumber: number, method: string, delay: number = 5000) {
    //Open drop down menu
    this.clickOnElement(Dropdown.defaultSelectizeItem(fieldNumber), delay)
    //Get option list Elements
    this.selectItemSelectionByName(fieldNumber, method, delay)
  }

  additionalSettingSectionDisplayed(delay: number = 5000): { plotLines: ElementArray, legendLines: ElementArray } {
    const lines = $$("g.lines path.js-line"), legendLines = $$("g.legendlines path.js-line")
    this.waitDisplayedElement(lines[0], delay)
    browser.pause(500)
    this.waitExistElement(legendLines[0], delay)

    return {
      plotLines: lines,
      legendLines: legendLines
    }

  }

  confirmLegendTextForItem(indexes: number[], delay: number = 5000): string[] {
    let result: string[] = []
    indexes.map(ind => {
      this.waitDisplayedElement($$("text.legendtext.user-select-none")[ind], delay)
      result.push($$("text.legendtext.user-select-none")[ind].getText())
    })

    return result
  }

  openFilesModalAndActiveSubjectSelectionTab(delay: number = 5000): boolean {
    const points = Widget.plotPoints
    if (points.length === 0) throw new Error("Plot should contain at least one point for the test.")
    points[0].click({ button: 1, x: 5, y: 5 })
    this.waitDisplayedElement(Modal.modalBody, delay)
    //Click on Subject Selection TAB
    this.clickOnElement(Modal.subjectFilesTab, delay)
    //Download option is available
    this.waitClickableElement(Modal.downloadOption, delay)

    return true
  }

  openFilesModalAndGetGnomadName(delay: number = 5000): string[] {
    const points = Widget.plotPoints
    if (points.length === 0) throw new Error("Plot should contain at least one point for the test.")
    points[0].click({ button: 1, x: 5, y: 5 })
    this.waitDisplayedElement(Modal.modalBody, delay)
    //Get GNOMAD attributes
    this.waitDisplayedElement(Widget.gnomadAttributes[0], delay)

    return Widget.gnomadAttributes.map(element => element.getText())
  }

  open(): string {
    return super.open(`/bdm-charts`)
  }
}

export const RealTimeAnalysis = new RealTimeAnalysisPO()