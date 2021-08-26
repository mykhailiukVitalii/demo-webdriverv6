export class Dropdowns {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            dropdownContent: ".selectize-dropdown-content",
            selectizeItemsMenu: ".selectize-input.full.has-items",
            selectizeMenu: ".selectize-input.items",
            selectionDropdown: ".selectize-input.not-full input",
            menuItem: ".item",
            dropdownOptionSelected: ".option.selected",
            existSelectizeBiomarker: ".item a.remove",
            selectizeBiomarkerElement: ".selectize-input.items.not-full",
        }
    }

    get toggleMenuItems() {return $$(this.pageSelectors.dropdownContent)}

    get defaultMenuItem() {return $(this.pageSelectors.selectizeItemsMenu).$(this.pageSelectors.menuItem)}

    get defaultMenuForSelectingItem() {return $(this.pageSelectors.selectizeMenu).$(this.pageSelectors.menuItem)}

    get selectionDropdown() { return $(this.pageSelectors.selectionDropdown) }

    get selectionFlowDropdown() {return $(this.pageSelectors.selectizeMenu)}

    get selectionDropdownAsSecondary() { return $$(this.pageSelectors.selectionDropdown)[1] }

    get selectionDropdownItems() { return $$(this.pageSelectors.selectionDropdown) }

    get selectedDropdownMenuItem() {return $(this.pageSelectors.dropdownContent).$(this.pageSelectors.dropdownOptionSelected)}

    get secondSelectizeBiomarkerElement() { return $$(this.pageSelectors.selectizeBiomarkerElement)[1] }

    get firstSelectizeBiomarkerElement() { return $$(this.pageSelectors.selectizeBiomarkerElement)[0] }

    get existSelectizeBiomarkerElement() { return this.firstSelectizeBiomarkerElement.$(this.pageSelectors.existSelectizeBiomarker) }

    get existSecondSelectizeBiomarkerElement() { return this.secondSelectizeBiomarkerElement.$(this.pageSelectors.existSelectizeBiomarker) }

    defaultSelectizeItem(id: number) {
        return $$(this.pageSelectors.selectizeItemsMenu)[id]
    }

    selectionMenu(id: number) {
        return $$(this.pageSelectors.dropdownContent)[id].$$('.option')
    }
}

export const Dropdown = new Dropdowns()