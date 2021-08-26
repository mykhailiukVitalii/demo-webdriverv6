import * as chai from "chai"

export class SelectionManagerSection {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            modal: ".modal-body",
            selectionManager: ".selection-manager",
            selectedItems: ".selection-selected",
            clearSelectionLink: "a=Clear Selection",
            availableSelections: ".selection",
            saveSelection: "button=Save"
        }
    }

    get modalSelectionManager() { return $(this.pageSelectors.modal).$(this.pageSelectors.selectionManager) }

    get selectionSelectedItems() { return this.modalSelectionManager.$$(this.pageSelectors.selectedItems) }

    get modalSelectionAvailableSelections() { return this.modalSelectionManager.$$(this.pageSelectors.availableSelections) }

    get clearSelectionLink() { return $(this.pageSelectors.clearSelectionLink) }

    get saveSelection() { return $(this.pageSelectors.saveSelection) }

    clearSelectionAndCheckDefaultSelections(selectedItems: number, length: number = 6, delay: number = 5000): number {
        // this.modalSelectionManager.waitForDisplayed({ timeout: delay })
        browser.waitUntil(
            () => this.modalSelectionManager.isDisplayed() === true,
            {
                timeout: delay,
                timeoutMsg: `Expected ${this.modalSelectionManager.selector} still not displayed (delay = ${delay}ms).`
            }
        )
        if (!(this.selectionSelectedItems.length > length)) throw new Error(`Selected Columns must contain at least ${length} item for selection. Check condition and run again!`)
        //Click on the Clear Selection link
        this.clickOnClearSelection(delay)
        browser.pause(200)
        browser.waitUntil(
            () => this.selectionSelectedItems.length === selectedItems,
            {
                timeout: delay,
                timeoutMsg: `After clearing the section, the number of selected items is not equal to ${selectedItems} (delay = ${delay}ms).`
            }
        )
        
        return this.selectionSelectedItems.length
    }

    defaultColumnsArray(): Array<String> {
        let columns = [] 
        for(let i = 0; i < this.selectionSelectedItems.length; i++){
            //Get the column names           
            columns.push(this.selectionSelectedItems[i].getText().split(".").pop())
        }

        return columns
    }

    //TODO: update for more than 2 index [0,1,2...]
    addedTwoColumnsToFileListing(delay: number = 1000, length: number = 3): Array<String> {
        let updatedColumnsList = []
        const index1 = 0, index2 = 1
        if (!(this.modalSelectionAvailableSelections.length > length)) throw new Error('Available Columns List must contain at least 3 item for selection. Check condition manually and run again!')

        //Get Available Biomarker name and click on it (firts item)
        updatedColumnsList = [...updatedColumnsList, this.addAvailableBiomarker(index1, delay)]
        //Get Available Biomarker name and click on it (second item)
        updatedColumnsList = [...updatedColumnsList, this.addAvailableBiomarker(index2, delay)]

        return updatedColumnsList
    }

    //TODO: update for more than 2 index [0,1,2...]
    addedTwoColumnsToFileListingWithSelectedList(expectedAmount: number, delay: number = 1000, length: number = 3): Array<String> {
        const index1 = 0, index2 = 1
        if (!(this.modalSelectionAvailableSelections.length > length)) throw new Error('Available Columns List must contain at least 3 item for selection. Check condition manually and run again!')

        //Add first Available Biomarker name and click on it (firts item)
        this.addAvailableBiomarker(index1, delay)
        //Get second Available Biomarker name and click on it (second item)
        this.addAvailableBiomarker(index2, delay)

        return this.selectedListAfterAdding(expectedAmount, delay)
    }

    selectedListAfterAdding(count: number, delay: number): Array<String> {
        browser.waitUntil(
          () => this.selectionSelectedItems.length === count,
          {
              timeout: delay,
              timeoutMsg: `Expected count list(${this.selectionSelectedItems.selector}) increase (delay = ${delay}ms).`
          }
        )
        //default pause
        browser.pause(500)
        const list = this.defaultColumnsArray().sort()
        console.log("Columns from the selected list:", list)        
    
        return list
      }

    addAvailableBiomarker(index: number, delay: number): string {
        this.modalSelectionAvailableSelections[index].waitForClickable({ timeout: delay })
        const item = this.modalSelectionAvailableSelections[index].getText()
        this.modalSelectionAvailableSelections[index].click()

        return item
    }

    clickOnClearSelection(delay: number) {
        this.clearSelectionLink.waitForClickable({ timeout: delay })
        this.clearSelectionLink.click()
    }

    submitSettingsUpdate(delay: number) {
        this.saveSelection.waitForClickable({ timeout: delay })
        this.saveSelection.click()
    }
}

export const SelectionManager = new SelectionManagerSection()
