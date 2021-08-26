import { BasePO } from "./Base";
import { Table } from "../page-components/Table";
import { Button } from "../page-components/Buttons";
import { FilterSection } from "../page-components/FilterPanel";
import { Element } from "@wdio/sync";

export class QueryTrackerPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      queryHomeLink: ".home-list-item=Query Tracker",
      openQueriesTab: "a=Open Queries",
      closedQueriesTab: "a=Closed Queries",
      modalEdit: ".modal-body textarea",
      modalEditClose: ".modal-header",
      modalContent: ".modal-content",
    }
  }

  get openQueriesTab() {return $(this.pageSelectors.openQueriesTab)}

  get closedQueriesTab() {return $(this.pageSelectors.closedQueriesTab)}

  get queryHomeLink() { return $(this.pageSelectors.queryHomeLink) }

  get modalEdit() { return $(this.pageSelectors.modalEdit) }

  get modalContent() { return $(this.pageSelectors.modalContent) }

  get modalEditClose() { return $(this.pageSelectors.modalEditClose).$("button.close") }

  skipIfQuerytrackerModuleNoExist(context: any): void {
    if (!browser.sharedStore.get('isQueryTrackerExist')) {
      console.log('[WARNING MESSAGE] : The current application does not contain a Query Tracker module! THIS TEST will be SKIPPED!!!')
      context.skip()
    }
  }

  openClosedTab(delay: number = 5000) {
    //Click on the Closed Queries TAB
    this.clickOnElement(this.closedQueriesTab, delay)
    expect(this.closedQueriesTab).toHaveAttribute("class", "active ")
  }

  getFirstExistReopenRow(): Element {
    let row: Element
    if (!(Table.mainTableRows.length > 2)) throw new Error('Main table must contain more than 2 row. Check condition and run again!')
    for (let i = 0; i < Table.mainTableRows.length; i++) {
      if (Table.mainTableRows[i].$$("td.dt-link").find(n => n.$("i.fa-reply"))) {
        row = Table.mainTableRows[i]
        break
      }
      else continue
    }
    return row
  }

  editAllAvailableCells(text: string, delay: number = 5000): Element {
    const row = this.getFirstExistReopenRow()
    row.$$(".dt-link .fa-pencil").map(element => {
      this.clickOnElement(element, delay)
      this.setElementValue(this.modalEdit, text, delay)
      this.clickOnElement(Button.downloadSubmit, delay)
      this.isModalClose(delay)      
    })

    return row
  }

  isModalClose(delay: number = 5000) {
    //Wait when the .modal-content section is closed
    browser.waitUntil(
      () => this.modalContent.isDisplayed() === false,
      {
          timeout: delay,
          timeoutMsg: `The ".modal-content" popup must be closed within ${delay}ms (But not closed).`
      }
    )
    browser.pause(1000)
  }

  selectRowForReopeningAfterEditable(text: string, delay: number = 5000): void {    
    const reopenRow = this.editAllAvailableCells(text, delay).$(".fa-reply")
    if (reopenRow) this.clickOnElement(reopenRow, delay)
    else throw new Error('The Main Table does not contain any matches entries for Reopening.')
  }

  waitMainTableUpdating(name: string, delay: number = 5000): boolean {    
    browser.waitUntil(
        () => $(`td.dt-link=${name}`).isDisplayed() === true,
        {
            timeout: delay,
            timeoutMsg: `The Main table should display rows that include name=${name} (${delay}ms).`
        }
    )

    return true
  }

  filteredByRequeryResponse(text: string, delay: number): void {
    //Activate Open Queries TAB
    this.clickOnElement(this.openQueriesTab, delay)
    //Open Filter section
    this.clickOnElement(FilterSection.tableFilters, delay)
    //Fill in the Requery Response if exist
    this.setElementValue($("label=Requery Response").nextElement(), text, delay)
  }

  open(): string {
    return super.open(`/query_tracker`)
  }
}

export const QueryTracker = new QueryTrackerPO()