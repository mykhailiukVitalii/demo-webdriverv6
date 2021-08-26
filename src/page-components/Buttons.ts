export class Buttons {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            downloadSettings: "button=Settings",
            downloadPreview: "button=Preview",
            downloadPreviewData: "button=Preview Data",
            downloadBtn: "button=Download",
            downloadSave: "button=Save",
            downloadSubmit: "button=Submit",
            downloadAdditionalSettings: "button=Additional Filters/Settings",
            downloadProcessedBtn: "button=Download Processed Data",
            closeButton: "button.close",
            fileListing: "a=File Listing",
            closeIcon: ".close",         
            rawFile: "a=Raw File",
            footerButtons: ".modal-footer button",
            addButton: "button=Add"
        }
    }

    get downloadSettings() { return $(this.pageSelectors.downloadSettings) }

    get addButton() { return $(this.pageSelectors.addButton) }

    get downloadSubmit() { return $(this.pageSelectors.downloadSubmit) }

    get downloadPreview() { return $(this.pageSelectors.downloadPreview) }

    get closeButton() { return $(this.pageSelectors.closeButton) }

    get downloadPreviewData() { return $(this.pageSelectors.downloadPreviewData) }

    get downloadAdditionalSettings() { return $(this.pageSelectors.downloadAdditionalSettings) }

    get downloadProcessedBtn() { return $(this.pageSelectors.downloadProcessedBtn) }

    get downloadBtn() { return $(this.pageSelectors.downloadBtn) }

    get downloadSave() { return $(this.pageSelectors.downloadSave) }

    get fileListing() { return $(this.pageSelectors.fileListing) }

    get rawFile() { return $(this.pageSelectors.rawFile) }

    get closeIcon() { return $(this.pageSelectors.closeIcon) }

    get submitButton() { return $$(this.pageSelectors.footerButtons)[0] }

    waitRawFileItemIsAlloved(delay: number = 5000): void {
        //Wait when the button is clickable
        this.rawFile.waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "${this.pageSelectors.rawFile}" item should be clickable in ${delay}ms`
        })
        browser.waitUntil(
            () => this.rawFile.getCSSProperty('cursor').value !== "not-allowed",
            {
                timeout: delay,
                timeoutMsg: `Expected "${this.pageSelectors.rawFile}" item should be interactive(without "not-allowed" cursor value) in ${delay}ms.`
            }
        )
    }

    openFileListingWindow(delay: number = 5000): void {
        //Wait when the button=Save is clickable
        this.downloadSave.waitForClickable({ timeout: delay })
        this.downloadSave.click()
        //Wait when the button=Preview is clickable
        this.downloadPreview.waitForClickable({ timeout: delay })
        this.downloadPreview.click()
        //Wait when the File Listing option is available for click
        this.fileListing.waitForClickable({ timeout: delay })
        this.fileListing.click()
    }

    openProcessedPreviewDataWindow(delay: number = 5000): void {
        //Wait when the button=Save is clickable
        this.downloadSave.waitForClickable({ timeout: delay })
        this.downloadSave.click()
        //Wait when the button=Preview Data is clickable
        this.downloadPreviewData.waitForClickable({ timeout: delay })
        this.downloadPreviewData.click()
    }

    waitPreviewIsDisplayed(delay: number = 5000): void {
        this.downloadPreview.waitForDisplayed({ timeout: delay })
    }

    waitDownloadIsDisplayed(delay: number = 5000): void {
        this.downloadBtn.waitForDisplayed({ timeout: delay })
    } 
}

export const Button = new Buttons()