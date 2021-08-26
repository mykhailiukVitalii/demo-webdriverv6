import { BasePO } from "./Base"
import { Table } from "../page-components/Table"
import { Dropdown } from "../page-components/Dropdowns"
import { Button } from "../page-components/Buttons"
import { ModalChoosePopulation } from "../page-components/ModalChoosePopulation"
import { saveDifScreenshot } from "../../src/misc/functions"
import { Element } from "@wdio/sync"

export class FlowCytometryPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      fcytometryHomeLink: ".home-list-item=Flow Cytometry",
      containerWrapper: ".wrapper",
      gatingInfo: "h4 > code",
      svgPlots: ".svgplot",
      gateNodes: "g.node",
      gateXyPlot: ".gate-image.xyplot",
      gateXySmallPlot: ".gate-image-small.xyplot",
      gateDensityPlot: ".gate-image.densityplot",
      pageTabs: "[role='tab']",
      collaborationTab: "a=Collaboration",
      crossViewerTab: "a=Cross-Sample Viewer",
      gateCommentField: "textarea.form-control",
      gateCommentMessages: ".timeline-item-data p"
    }
  }

  get fcytometryHomeLink() { return $(this.pageSelectors.fcytometryHomeLink) }

  get collaborationTab() { return $(this.pageSelectors.collaborationTab) }

  get crossViewerTab() { return $(this.pageSelectors.crossViewerTab) }

  get gateCommentField() { return $(this.pageSelectors.gateCommentField) }

  get gateCommentMessages() { return $$(this.pageSelectors.gateCommentMessages) }

  get xyPlotTab() { return $$(this.pageSelectors.pageTabs)[4].parentElement() }

  get gateCommentsTab() { return $$(this.pageSelectors.pageTabs)[2].parentElement() }

  get densityPlotTab() { return $$(this.pageSelectors.pageTabs)[5].parentElement() }

  get gatingVisit() { return $(this.pageSelectors.containerWrapper).$$(this.pageSelectors.gatingInfo)[1] }

  get gatingSample() { return $(this.pageSelectors.containerWrapper).$$(this.pageSelectors.gatingInfo)[2] }

  get singleSelections() { return $(this.pageSelectors.containerWrapper).$$(this.pageSelectors.svgPlots)[0].$$(this.pageSelectors.gateNodes) }

  get gateXyPlot() { return $(this.pageSelectors.containerWrapper).$(this.pageSelectors.gateXyPlot) }

  get gateXySmallPlot() { return $(this.pageSelectors.containerWrapper).$$(this.pageSelectors.gateXySmallPlot) }

  get gateDensityPlot() { return $(this.pageSelectors.containerWrapper).$(this.pageSelectors.gateDensityPlot) }

  open(): string {
    return super.open(`/flowcytometry`)
  }

  skipIfFcytometryModuleNoExist(context: any): void {
    if (!browser.sharedStore.get('isFcytometryExist')) {
      console.log('[WARNING MESSAGE] : The current application does not contain a Flow Cytometry module! THIS TEST will be SKIPPED!!!')
      context.skip()
    }
  }

  choseSampleIdAndSelectNode(delay: number = 5000): Element {
    //Wait Main Table render
    Table.waitFirstRow(delay)
    //Select first Sample ID from table
    const link = Table.selectFirstRowByLink()
    //Gating Browser Sample should be displayed
    this.waitGateSampleLabel(link, delay * 2)
    //Select Gate node from the available nodes
    const node = this.selectSingleSelection(delay).$("text")

    return node
  }

  waitGateSampleLabel(name: string, delay: number) {
    browser.waitUntil(
      () => this.gatingSample.getText() === "Sample: " + name,
      {
        timeout: delay,
        timeoutMsg: `The Gating Browser Sample info include Sample=${name} (${delay}ms).`
      }
    )
  }

  waitNodePathUpdated(name: string, delay: number) {
    this.waitDisplayedElement(Table.gateNodePath, delay)

    browser.waitUntil(
      () => Table.gateNodePath.getText().split("/").pop().toLocaleLowerCase() === name,
      {
        timeout: delay,
        timeoutMsg: `The Gating selection menu should contain the selected node name=${name} (${delay}ms).`
      }
    )

    return Table.gateNodePath
  }

  gatePlotInfo(delay: number = 5000): Element {
    browser.pause(300)
    this.waitDisplayedElement(this.gateXyPlot.$("img"), delay)
    browser.pause(300)

    return this.gateXyPlot.$("img")
  }

  gateSmallPlotInfo(delay: number = 5000): Element {
    browser.pause(300)
    this.waitDisplayedElement(this.gateXySmallPlot[0].$("img"), delay)
    browser.pause(300)

    return this.gateXySmallPlot[0].$("img")
  }

  gateDensityPlotInfo(delay: number = 5000): Element {
    browser.pause(300)
    this.waitDisplayedElement(this.gateDensityPlot.$$("img")[0], delay)
    browser.pause(300)

    return this.gateDensityPlot.$$("img")[0]
  }

  defaultActiveTab(): boolean {
    return (this.xyPlotTab.getAttribute("class") === "active")
      ? true
      : false
  }

  activateDensityPlot(delay: number): boolean {
    this.clickOnElement(this.densityPlotTab.$("a"), delay)
    browser.pause(300)
    browser.waitUntil(
      () => this.densityPlotTab.getAttribute("class") === "active",
      {
        timeout: delay,
        timeoutMsg: `The Density Plot Tab should be active after clicking(${delay}ms).`
      }
    )

    return (this.densityPlotTab.getAttribute("class") === "active")
      ? true
      : false
  }

  selectDropdownSelection(delay: number = 5000): Element {
    //Wait Main Table render
    Table.waitFirstRow(delay)
    //Select first Sample ID from table
    const link = Table.selectFirstRowByLink()
    //Gating Browser Sample should be displayed
    this.waitGateSampleLabel(link, delay * 2)
    //Open Selection drop down menu
    // this.clickOnElement(Dropdown.selectionDropdown, delay)//TODO:v6 component
    this.clickOnElement(Dropdown.selectionFlowDropdown, delay)
    //Select item from exist selection menu
    this.selectItemFromGatesDropdown()
    const item = Dropdown.defaultMenuForSelectingItem

    return item
  }


  activateCrossSampleTab(delay: number = 5000) {
    //activate the Cross-Sample Viewer TAB
    this.clickOnElement(this.crossViewerTab, delay)
    browser.pause(300)
    //By default the Generate Report is disabled     
    browser.waitUntil(
      () => $("button=Generate Report").isClickable() === false,
      {
        timeout: delay,
        timeoutMsg: `The Density Plot Tab should be active after clicking(${delay}ms).`
      }
    )
    if(!$("button=Generate Report").getAttribute("disabled")) throw new Error('Generate Report button should be unclickable by default!')
    //By default the Choose Population and Sample is clickable
    this.waitClickableElement($("button=Choose Population and Samples"), delay)
  }

  choosePopulationAndSamples(option: { selectedRowByIndex: Array<number>, screenName: string }, delay: number = 5000): void {
    this.activateCrossSampleTab(delay)
    //Click on the Choose Population and Samples button
    this.clickOnElement($("button=Choose Population and Samples"), delay)
    //Chose modal should be opened
    this.waitDisplayedElement(ModalChoosePopulation.chooseModalTitle, delay)
    //Select rows from the Subject table
    Table.selectRowFromMainTable(option, delay)
    browser.pause(300)
    saveDifScreenshot(option.screenName)
    //close modal window
    this.clickOnElement(ModalChoosePopulation.closeModalIcon, delay)
  }

  activeGateCommentsAndSendOne(comment: string, delay: number = 5000): Element {
    //activate the Gate Comments TAB
    this.clickOnElement(this.gateCommentsTab, delay)
    browser.pause(300)
    browser.waitUntil(
      () => this.gateCommentsTab.getAttribute("class") === "active",
      {
        timeout: delay,
        timeoutMsg: `The Density Plot Tab should be active after clicking on it(${delay}ms).`
      }
    )
    this.waitDisplayedElement(this.gateCommentField, delay)
    const countComments = this.gateCommentMessages.length
    console.log("Count before: ", countComments)
    this.setElementValue(this.gateCommentField, comment, delay)
    // Add comment
    this.clickOnElement(Button.addButton, delay)
    browser.pause(300)
    //wait comment should be present
    browser.waitUntil(
      () => this.gateCommentMessages.length === countComments + 1,
      {
        timeout: delay,
        timeoutMsg: `The number of comments should be increased (${delay}ms).`
      }
    )
    console.log("Count after: ", this.gateCommentMessages.length)
    this.gateCommentMessages[this.gateCommentMessages.length - 1].scrollIntoView()
    //and message should be updated
    browser.waitUntil(
      () => this.gateCommentMessages[this.gateCommentMessages.length - 1].getText() === comment,
      {
        timeout: delay,
        timeoutMsg: `The comment message should be shown as a timeline-item (${delay}ms).`
      }
    )

    return this.gateCommentMessages[this.gateCommentMessages.length - 1]
  }   

  collaborationByName(name: string, delay: number = 5000): Element {
    this.clickOnElement(this.collaborationTab, delay)
    //Wait table updating
    return Table.mainFilterRowByItemsName(name)
  }

  selectItemFromGatesDropdown(): void {
    //If Selection menu contains items - select first element
    const selection = Dropdown.selectionMenu(0)
    //Generate random index
    const max = selection.length - 1
    const index = Math.floor(Math.random() * (max -1)) + 1
    // const index = 3
    //By defult using first item
    if (selection.length === 0) throw new Error('Gates Dropdown does not contain items for the Single Selection option!')
    selection[index].click()
    browser.pause(300)
  }

  selectSingleSelection(delay: number): Element {
    const max = this.singleSelections.length - 1
    const index = Math.floor(Math.random() * (max - 1)) + 1
    const node = this.singleSelections[index]
    this.clickOnElement(node, delay)

    return node
  }
}

export const FlowCytometry = new FlowCytometryPO()