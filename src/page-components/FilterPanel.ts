import { fixShowAllCount } from "../misc/functions";
import { ElementArray, Element} from "@wdio/sync";

export class FilterPanel {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            tableFilters: "h4.panel-title",
            filtersForm: ".from-group-one-unit",
            clinicalSubjectidField: ".clinical_subjects-subjectid > .selectize-input",
            clinicalStudyidField: ".clinical_subjects-studyid > .selectize-input",
            clinicalSubjectid: ".clinical_subjects-subjectid",
            options: ".option[data-value]",
            clinicalSampleFileView: ".clinical_sample_files_view-type > .selectize-dropdown > .selectize-dropdown-content",
            clinicalSampleFileViewInput: ".clinical_sample_files_view-type > .selectize-input > input",
            requeryResponse: "label=Requery Response",
        }
    }

    // get tableFilters() { return $$(this.pageSelectors.tableFilters)[0].$("a") }

    get tableFilters() { return $$(".panel-default")[0] }

    get secondFilterPanel() {return $$(this.pageSelectors.tableFilters)[1].$('a')}

    get filenameField() { return $(this.pageSelectors.filtersForm).$("label=File Name").nextElement() }

    get clinicalSampleFileViews() { return $(this.pageSelectors.clinicalSampleFileView).$$(".option") }

    get clinicalSampleFileViewInput() { return $(this.pageSelectors.clinicalSampleFileViewInput) }

    get fileDescriptionField() { return $(this.pageSelectors.filtersForm).$("label=Description").nextElement() }

    get clinicalSubjectidField() {return $$(this.pageSelectors.clinicalSubjectidField)[0]}

    get clinicalStudyidField() {return $$(this.pageSelectors.clinicalStudyidField)[0]}

    get clinicalSubjectidAvailableOptions() {return $$(this.pageSelectors.clinicalSubjectid)[2].$$(this.pageSelectors.options)}

    get requeryResponseInput() { return $(this.pageSelectors.tableFilters).nextElement() }

    openFilterPanel(secondFilter: boolean = false, delay: number = 5000): ElementArray {
        let filters: ElementArray
        //Open filter panel
        if(secondFilter) {            
            FilterSection.secondFilterPanel.waitForClickable({
                timeout: delay,
                timeoutMsg: `Expected "${FilterSection.secondFilterPanel.selector}" element should be clickable(delay = ${delay}ms).`
            })
            FilterSection.secondFilterPanel.click()
            filters = $$(".panel-body")[1].$$(".selectize-control.selectize")
        } else {
            browser.pause(1000)
            FilterSection.tableFilters.waitForClickable({
                timeout: delay,
                timeoutMsg: `Expected "${FilterSection.tableFilters.selector}" element should be clickable(delay = ${delay}ms).`
            })
            FilterSection.tableFilters.click()
            filters =  $$(".panel-body")[0].$$(".selectize-control.selectize .selectize-input.has-options")
        }

        return filters
    }

    openFilterField(field: Element, delay: number = 5000) {
        //Open filter field for selecting available option
        field.waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "${field.selector}" element should be clickable(delay = ${delay}ms).`
        })
        field.click()
    }

    availableFilterOptions(filter: Element): {display: string, dropdownOptionsCount: number, selectAllValue: number} {
        let display: string = "", selectAllValue: number = 0
        //Get count of option
        const dropdownOptionsCount = filter.$$(".selectize-dropdown-content")[1].$$(".option[data-value]").length
        const selectAll = filter.$(".selectize-dropdown-content.select-all").$(".items-count")
        if (dropdownOptionsCount >= 50) display = filter.$(".selectize-dropdown-content.select-all").getCSSProperty("display").value
        else {
            selectAllValue = fixShowAllCount(selectAll.getText())
        }

        return {display, dropdownOptionsCount, selectAllValue}
    }

    availableFilterOptionsAsNext(filter: Element): {display: string, dropdownOptionsCount: number, selectAllValue: number} {
        let display: string = "", selectAllValue: number = 0
        //Get count of option
        const dropdownOptionsCount = filter.nextElement().$$(".selectize-dropdown-content")[1].$$(".option[data-value]").length
        // const dropdownOptionsCount = $$(".panel-body")[0].$$(".selectize-control.selectize .selectize-dropdown.plugin-select_all")[index].$$(".selectize-dropdown-content")[1].$$(".option[data-value]").length
        const selectAll = filter.nextElement().$(".selectize-dropdown-content.select-all").$(".items-count")
        if (dropdownOptionsCount >= 50) display = filter.nextElement().$(".selectize-dropdown-content.select-all").getCSSProperty("display").value
        else {
            selectAllValue = fixShowAllCount(selectAll.getText())
        }

        return {display, dropdownOptionsCount, selectAllValue}
    }

    getFilterOptionsCount(index: number, secondFilter: boolean = false, delay: number = 5000): {display: string, dropdownOptionsCount: number, selectAllValue: number} {
        const filters = this.openFilterPanel(secondFilter, delay)
        //Open option field
        this.openFilterField(filters[index], delay)
        //return count of available option
        return this.availableFilterOptions(filters[index])
    }

    getFilterNextOptionsCount(index: number, secondFilter: boolean = false, delay: number = 5000): any {
        const filters = this.openFilterPanel(secondFilter, delay)
        //Open option field
        this.openFilterField(filters[index], delay)
        //return count of available option
        return this.availableFilterOptionsAsNext(filters[index])       
    }
}

export const FilterSection = new FilterPanel()