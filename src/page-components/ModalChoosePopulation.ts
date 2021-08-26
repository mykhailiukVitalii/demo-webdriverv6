export class ModalChoosePopulations {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            chooseModalTitle: ".modal-title=Choose Population and Samples",
            closeModalIcon: ".modal-header .close",
        }
    }

    get chooseModalTitle() { return $(this.pageSelectors.chooseModalTitle) }

    get closeModalIcon() { return $(this.pageSelectors.closeModalIcon) }
}

export const ModalChoosePopulation = new ModalChoosePopulations()