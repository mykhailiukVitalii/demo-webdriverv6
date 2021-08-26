import { Modal } from "./Modal"
import { Table } from "./Table"

import { Element, ElementArray } from "@wdio/sync"

export class DataSelectionModal {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            modal: ".modal-body",
            subjectSelectionTab: ".modal-nav .dev-page-navigation li a > .fa-users",
            search: ".search",
            searchFiled: "input.selector-input",
            selectionList: "ul.container-tabs",
            showOnlySelectedButton: "#show-only-selected=Show only selected",
            searchResult: "li a span",
            addSelectionIcon: "i.fa-plus",
            selectionTitle: ".biomarker-options-wrapper h3 .title",
            existSelectionList: ".filter-selectors ul.container-tabs li"
        }
    }

    get subjectSelectionTab() { return $(this.pageSelectors.subjectSelectionTab) }

    get searchFiled() { return $(`${this.pageSelectors.search} ${this.pageSelectors.searchFiled}`) }

    get showOnlySelectedButton() { return $(this.pageSelectors.showOnlySelectedButton) }

    get searchResult() { return $$(`${this.pageSelectors.selectionList} ${this.pageSelectors.searchResult}`) }

    get addSelectionIcon() { return $(this.pageSelectors.addSelectionIcon) }

    get selectionTitle() { return $(this.pageSelectors.selectionTitle) }

    get existSelectionList() { return $$(this.pageSelectors.existSelectionList) }

    get selectionEditTitle() { return $(this.pageSelectors.selectionTitle).$("a") }

    get selectionEditTitleField() { return $(this.pageSelectors.selectionTitle).$("input") }

    get selectionEditTitleConfirmButton() { return $(this.pageSelectors.selectionTitle).$("button") }

    activateSubjectSelectionTab(delay: number = 5000) {
        this.subjectSelectionTab.waitForClickable({ timeout: delay })
        this.subjectSelectionTab.click()
        browser.pause(300)
    }

    fillSearchField(name: string, delay: number) {
        this.searchFiled.waitForDisplayed({ timeout: delay })
        this.searchFiled.setValue(name)
    }

    selectSearchResult(name: string, delay: number): boolean {
        let item: Element
        item = this.searchResult.find(n => n.getText() === name)
        item.waitForExist({ timeout: delay })
        item.scrollIntoView()
        item.click()

        return true
    }

    applySelectionFromList(name: string, delay: number = 5000) {
        if (this.selectSearchResult(name, delay)) {
            this.showOnlySelectedButton.waitForDisplayed({ timeout: delay })
            this.showOnlySelectedButton.click()
        } else throw new Error(`Search result does not contain previously created Selection. Check the condition manually!`)
    }

    applySelectionUsingFillSearch(name: string, count: number, delay: number = 5000) {
        this.fillSearchField(name, delay)
        browser.pause(500)
        this.applySelectionFromList(name, delay)
        browser.pause(500)

        return this.onlySelectedSubjectSelectionShown(count, delay)
    }

    onlySelectedSubjectSelectionShown(count: number, delay: number) {
        browser.waitUntil(
            () => Table.mainTableSelectedRows.length === count,
            {
                timeout: delay,
                timeoutMsg: `Number of rows(current table rows = ${Table.mainTableSelectedRows.length}) in the table must be equal to the previously selected rows(${delay}ms.). Check condition manually!`
            }
        )

        return Table.mainTableSelectedRows
    }
    subjectidsFromTable(subjectRows: ElementArray, subjectIds: Array<string>): number {
        let result = []

        subjectIds.forEach(subjectId => {
            for (let i = 0; i < subjectRows.length; i++) {
                subjectRows[i].$$("td").find(td => { //TODO: move to Table.ts
                    if(td.getText() === subjectId) return result.push(td.getText())
                })
            }            
        })
        console.log('SubjectID  from result: ', result)

        return result.length
    }
    setSubjectName(selectionName: string): void {
        browser.pause(100)
        this.selectionTitle.moveTo()
        browser.pause(500)
        this.selectionEditTitle.click()
        //Set Sample Selection Name
        this.selectionEditTitleField.setValue(selectionName)
        browser.pause(500)
        this.selectionEditTitleConfirmButton.click()
        browser.pause(300)
    }
    closeDataSelectionWindow(delay: number) {
        //Close Data Selection modal
        Modal.removeModalByIcon.waitForClickable({timeout: delay})
        Modal.removeModalByIcon.click()
    }
    waitSecondSelectionFromList(delay: number) {
        browser.waitUntil(
            () => this.existSelectionList[1].isDisplayed() == true,
            {
                timeout: delay,
                timeoutMsg: `Selection list does not contain a second item for this test-case. Check the condition manually!`
            }
        )
    }
    selectionRenderCondition(delay: number) {
        //Wait Sample Selection result table
        Table.waitFirstRow(delay)
        //Wait items from the Sample Selection list
        this.waitSecondSelectionFromList(delay)
        browser.pause(500)
    }
}

export const DataSelection = new DataSelectionModal()
