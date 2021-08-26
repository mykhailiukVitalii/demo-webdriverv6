export class ModalAddTrackingNumberCo {
    private pageSelectors: any;

    constructor() {
        this.pageSelectors = {
            modalWindow: ".modal-body",
            submitModalButton: "button=Submit",
            servicesDropdownMenu: ".selectize-input.items",
            servicesDropdownItems: ".selectize-dropdown-content",
            trackingNumberInput: "[placeholder='Enter tracking number']",
            editTrackingNumberInput: "textarea.form-control",
        }
    }

    get modalWindow() { return $(`${this.pageSelectors.modalWindow}`) }

    get servicesDropdownMenu() { return $(`${this.pageSelectors.modalWindow} ${this.pageSelectors.servicesDropdownMenu}`) }

    get trackingNumberInput() { return $(`${this.pageSelectors.modalWindow} ${this.pageSelectors.trackingNumberInput}`) }

    get editTrackingNumberInput() { return $(`${this.pageSelectors.editTrackingNumberInput}`) }

    get submitModalButton() { return $(`${this.pageSelectors.submitModalButton}`) }

    openSeviceTypeMenu(delay: number = 5000) {
        this.servicesDropdownMenu.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.servicesDropdownMenu}" element should be displayed after ${delay}ms`
        })
        this.servicesDropdownMenu.click()
    }

    selectService(name: string, delay: number = 5000) {
        const service = $(`${this.pageSelectors.modalWindow} ${this.pageSelectors.servicesDropdownItems} [data-value="${name}"]`)
        service.waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "[data-value='${name}']" dropdown option should be clickable after ${delay}ms`
        })
        service.click()
    }

    inputTrackingNumber(number: string, delay: number = 5000): void {
        this.trackingNumberInput.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.trackingNumberInput}" input field should be displayed after ${delay}ms`
        })
        browser.pause(200)
        this.trackingNumberInput.setValue(number)
        browser.pause(500)
    }

    editTrackingNumber(number: string, delay: number = 5000): void {
        this.editTrackingNumberInput.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.editTrackingNumberInput}" input field should be displayed after ${delay}ms`
        })
        browser.pause(300)
        this.editTrackingNumberInput.setValue(number)
        browser.pause(500)
    }

    submitAddingNumber(delay: number = 5000) {
        this.submitModalButton.waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.submitModalButton}" button should be clickable after ${delay}ms`
        })
        this.submitModalButton.click()
    }

    modalWindowClosed(delay: number = 5000) {
        //Wait when the Modal window section is closed
        browser.waitUntil(
            () => this.modalWindow.isDisplayed() === false,
            {
                timeout: delay,
                timeoutMsg: `The Modal window should be closed within ${delay}ms (But it's dispalyed).`
            }
        )
    }
}

export const ModalAddTrackingNumber = new ModalAddTrackingNumberCo()