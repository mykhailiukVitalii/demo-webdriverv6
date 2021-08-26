import { ElementArray, Element } from "@wdio/sync"

export class TableSaction {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            table: "table",
            tbody: "tbody",
            thead: "thead",
            row: "tr",
            window: ".modal-dialog",
            tableWrapper: ".dataTables_wrapper",
            selectedItem: ".dt-link",
            tableTopSelectColumns: "table.table-bordered",
            unmarkedCheckbox: "i._checkbox.fa-square-o",
            gateNodePath: "td[colspan='2']"
        }
    }

    get mainTableFirstColumn() { return $$(this.pageSelectors.table + " " + this.pageSelectors.thead + " " + this.pageSelectors.row)[0].$("th") }

    get mainTableColumns() { return $$(this.pageSelectors.table + " " + this.pageSelectors.thead + " " + this.pageSelectors.row)[0].$$("th") }

    get mainTableFirstRow() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[0].$$("tr")[0] }

    get mainTableSelectedRows() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[0].$$("tr.selected") }

    get windowSection() { return $(this.pageSelectors.window) }

    get tableWrapper() { return $(this.pageSelectors.tableWrapper) }
    
    get secondTableFirstRow() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[0].$$("tr")[0] }

    get mainTableSelectCheckboxes() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[0].$$("td.select-checkbox") }

    get mainTableRows() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[0].$$("tr") }

    get mainTableActiveRowsByLink() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[0].$$(".dt-link") }

    get secondTableSelectCheckboxes() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[1].$$("td.select-checkbox") }

    get secondTableRowItems() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[1].$$("td") }
    
    get mainTableRowItems() { return $$(this.pageSelectors.table + " " + this.pageSelectors.tbody)[0].$$("td") }

    get tableTopSelectColumns() {return $$(this.pageSelectors.tableTopSelectColumns)[0].$$("tr")[1].$$("th.select-checkbox")}
    
    get tableClickableItems() {return $$(this.pageSelectors.tbody)[0].$$(this.pageSelectors.selectedItem)}

    get tableTopSection() {return $$(this.pageSelectors.tableTopSelectColumns)[0].$$("tr")[1]}

    get unmarkedCheckbox() {return $$(this.pageSelectors.unmarkedCheckbox)}

    get gateNodePath() { return $(this.pageSelectors.table + " " + this.pageSelectors.gateNodePath) }

    waitFirstRow(delay: number = 5000): void {
        browser.waitUntil(
            () => this.mainTableFirstRow.isDisplayed() === true,
            {
                timeout: delay,
                timeoutMsg: `Expected first "table tbody tr" element should be rendered in ${delay}ms`
            }
        )
        // this.mainTableFirstRow.waitForDisplayed({
        //     timeout: delay,
        //     timeoutMsg: `Expected first "table tbody tr" element should be rendered in ${delay}ms`
        // })
    }
    waitTableWrapper(delay: number = 5000): void {
        this.tableWrapper.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.tableWrapper.selector}" element should be rendered (${delay}ms)`
        })
    }
    //TODO: fix for data downloading
    selectOneRowFromMainTable(index: number, length: number): void {
        if (!(this.mainTableSelectCheckboxes.length > length)) throw new Error(`Main Data table must contain at least ${length} item for selection. Check condition and run again!`)
        this.waitAndSelectTableRow(index)
        browser.pause(500)
    }
    
    selectRowFromMainTable(option: {selectedRowByIndex: Array<number>}, delay: number) {
        //Selected subjects
        const links: Array<string> = []
        const { selectedRowByIndex } = option
        const tableLength = selectedRowByIndex.length + 3
        if (!(this.mainTableRows.length > tableLength)) throw new Error(`Main Data table must contain at least ${tableLength} item for selection. Check condition manually and run again!`)
        if(selectedRowByIndex.length == 0) {
            const index = 0;
            console.log("Use default selecting. Select only 1-st row from the table")
            this.activeRowCheckbox(index, delay)
            browser.pause(500)
            if(this.mainTableRows[index].$(".dt-link").isExisting()) links.push(this.mainTableRows[index].$(".dt-link").getText())            
        } else {
            selectedRowByIndex.forEach(index => {
                browser.pause(1000)
                this.activeRowCheckbox(index, delay)
                browser.pause(1000)
                if(this.mainTableRows[index].$(".dt-link").isExisting()) links.push(this.mainTableRows[index].$(".dt-link").getText())
            });
        }

        return links
    }

    selectFirstRowByLink(delay: number = 5000): string {
        const index = 0;
        if (this.mainTableRows.length === 0) throw new Error('Main table must contain at least 1 item for selection. Check condition and run again!')
        const link = this.getSubjectName(index)
        this.mainTableRows[index].$(".dt-link").waitForClickable({
            timeout: delay,
            timeoutMsg: "User can't click on the link for selecting!"
        })
        this.mainTableRows[index].$(".dt-link").click()

        return link
    }

    activeRowCheckbox(index: number, delay: number) {
        this.mainTableRows[index].$("td.select-checkbox").waitForClickable({ timeout: delay })
        this.mainTableRows[index].$("td.select-checkbox").scrollIntoView()
        this.mainTableRows[index].$("td.select-checkbox").click()
    }

    getSubjectName(index: number): string {
        try {
            this.mainTableRows[index].$(".dt-link").getText()
        } catch(e) {
            throw new Error("The driver cannot find any rows in the selection table (maybe no imort the fc_data)!!!. Check manually and try to run the test again!");
        }
        return this.mainTableRows[index].$(".dt-link").getText()
    }

    waitAndSelectTableRow(index: number, delay: number = 5000): void {
        this.mainTableSelectCheckboxes[index].waitForClickable({ timeout: delay })
        this.mainTableSelectCheckboxes[index].scrollIntoView()
        this.mainTableSelectCheckboxes[index].click()
    }

    getRowSubjectId(index: number): string {
        return this.mainTableSelectCheckboxes[index].$("td.dt-link").getText()
    }    

    selectOneRowFromSecondDataTable(index: number, length: number): void {
        if (!(this.secondTableSelectCheckboxes.length > length)) throw new Error(`Second Data table must contain at least ${length} item for selection. Check condition and run again!`)
        this.waitAndSelectSecondTableRow(index)
        browser.pause(500)
    }

    waitAndSelectSecondTableRow(index: number, delay: number = 5000): void {
        this.secondTableSelectCheckboxes[index].waitForClickable({ timeout: delay })
        this.secondTableSelectCheckboxes[index].scrollIntoView()
        this.secondTableSelectCheckboxes[index].click()
    }

    getColumnsListFromFileListPreview(delay: number = 10000, pause: number = 1000 ): Array<String> {
        let previewList = []

        this.windowSection.waitForDisplayed({ timeout: delay })
        browser.pause(pause)
        const modalTableEl = $(".modal-body").$(".dataTables_wrapper").$$("table thead tr")[0]
        modalTableEl.waitForDisplayed({ timeout: delay })
        //Wait when the Preview Table is displayed
        const tableColumnEls = modalTableEl.$$("th")
        for(let i = 0; i < tableColumnEls.length; i++){
            //Get the column names           
            previewList.push(tableColumnEls[i].getText())
        }
        console.log("Preview Table Columns:", previewList.sort())

        return previewList.sort()
    }

    getColumnNameListFromMainTable(delay: number = 5000): Array<String> {
        let previewList = []
        
        //Wait when the updated Main Table is displayed
        this.mainTableFirstColumn.waitForDisplayed({ timeout: delay })
        browser.pause(500) 
        for(let i = 0; i < this.mainTableColumns.length; i++){
            if(i === 0) continue
            //Get the column names            
            previewList.push(this.mainTableColumns[i].getText())
        }

        return previewList
    }

    selectColumnFromTable(option: {selectedRowByIndex: Array<number>}, delay: number = 5000): void {
        this.tableTopSection.waitForDisplayed({ timeout: delay })

        if(this.tableTopSelectColumns.length < 5) {
            throw new Error ('Table should contain more than 4 columns for "Show Info" selection. Check number of selected columns manually and run again!')
        }
        const { selectedRowByIndex } = option
        //Select column from the Table
        if(selectedRowByIndex.length == 0) {
            const index = 0;
            console.log("Use default selecting. Select only 1-st column from the table")
            this.selectColumn(index, delay)
            browser.pause(500)
        } else {
            selectedRowByIndex.forEach(index => {
                this.selectColumn(index, delay)
                browser.pause(500)
            });
        }
    }

    choseDashboardFromSavedList(name: string, delay: number) {
        this.selectExistRowByName(name, delay)
    }

    selectExistRowByName(name: string, delay: number): boolean {    
        let rows = this.mainTableRows
        this.waitTableUpdatingByName(name, delay)      
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].$$(".dt-link").find(n => n.getText() === name)) rows[i].$(".dt-link").click()
        }

        return true
    }

    waitTableUpdatingByName(name: string, delay: number) {
        browser.waitUntil(
            () => this.tableClickableItems[this.tableClickableItems.length - 1].getText() === name,
            {
                timeout: delay,
                timeoutMsg: `The Main table should display rows that include name=${name} (${delay}ms).`
            }
        )

        return this.tableClickableItems
    }

    selectColumn(index: number, delay: number) {
        this.tableTopSelectColumns[index].waitForClickable({ timeout: delay })
        this.tableTopSelectColumns[index].click()
    }

    unmarkedCheckboxes(delay: number): ElementArray {
        this.waitFirstRow(delay)

        return this.unmarkedCheckbox
    }

    filterRowByItemsName(name: string): Element {
        return this.secondTableRowItems.find(value => value.getText() === name)
    }

    getTableRows(delay: number) {
        this.waitFirstRow(delay)

        return Table.mainTableActiveRowsByLink.length
    }

    mainFilterRowByItemsName(name: string): Element {
        return this.mainTableRowItems.find(value => value.getText() === name)
    }
}

export const Table = new TableSaction()