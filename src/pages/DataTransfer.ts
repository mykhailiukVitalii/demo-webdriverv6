import { BasePO } from "./Base";
import { Table } from "../page-components/Table";
import { Modal } from "../page-components/Modal";

export class DataTransferPagePO extends BasePO {
  private pageSelectors: any

  constructor() {
    super();
    this.pageSelectors = {
      selectedLabel: "label.control-label"
    }
  }

  selectFirstFileFromMainTable(delay: number = 5000): string {
    //Wait Main Table render
    Table.waitFirstRow(delay)
    //Select row from the main table
    const item = Table.selectFirstRowByLink()

    return item
  }

  getExceptionMessage(delay: number = 5000) {
    //If modal window throw an Error - close window
    if (Modal.isModalWindowDisplayed(delay)) return Modal.getModalErrorMessage()
    else throw new Error('"User exception" Modal window is not displayed(with modal message). Check current functionality manually')
  }

  open(): string {
    return super.open(`/transferlogs`)
  }
}

export const DataTransfer = new DataTransferPagePO()