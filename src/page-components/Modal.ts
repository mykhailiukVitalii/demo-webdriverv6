export class Modals {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            modalBody: ".modal.in .modal-body",
            closeModalIcon: ".modal.in .modal-header .close",
            removeModalByIcon: ".remove .fa-close",
            subjectFilesTab: "a=Subject Files",
            downloadOption: ".modal-body button i.fa-download",

        }
    }

    get modalBody() { return $(this.pageSelectors.modalBody) }

    get modalSubjectTab() { return $(this.pageSelectors.modalBody) }

    get removeModalByIcon() { return $(this.pageSelectors.modalBody).$(this.pageSelectors.removeModalByIcon) }

    get downloadOption() { return $(this.pageSelectors.downloadOption) }

    get closeModalError() { return $(this.pageSelectors.closeModalIcon) }

    get modalErrorType() { return $(`${this.pageSelectors.modalbody} span[id*='type_']`) }

    get modalErrorLabel() { return $(this.pageSelectors.modalBody).$$("span")[1]}

    get modalErrorMessage() { return $(`${this.pageSelectors.modalBody} span[id*='message_']`) }

    get subjectFilesTab() { return $(this.pageSelectors.subjectFilesTab) }

    isModalWindowDisplayed(delay: number = 5000): boolean {
        let isPresent = false
        try {
            this.modalBody.waitForDisplayed({timeout: delay})
            isPresent = true
        } catch(e) {
            isPresent = false
        }

        return isPresent
    }

    isModalPresent(): boolean {
        return this.modalBody.isDisplayed()
    }

    getModalErrorLabel(): string {
        return this.modalErrorLabel.getText()
    }

    getModalErrorMessage(): string {
        return this.modalErrorMessage.getText()
    }

    getModalErrorType(): string {
        return this.modalErrorType.getText()
    }

    getErrorMessageAndClose(delay: number = 5000) {
        const errorMessage = this.getModalErrorMessage()
        if(errorMessage) {
          //Close modal window
          this.closeModalError.waitForClickable({ timeout: delay} )
          this.closeModalError.click()
          throw new Error(`Modal window opens! Modal message: ${errorMessage}`)
        }
    }
}

export const Modal = new Modals()