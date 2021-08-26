export class UploadFormCo {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            uploadForm: ".container-tab",
            selectedFilesIcon: "i.fa-file",
            uploadFile: "input[type='file']",
            filesList: ".list-group > div > p",
            buttons: "button.btn-primary",
            firstField: ".form-control-clear-wrap > textarea",
            tagsInput: ".selectize-input > input"
        }
    }

    get firstInputField() { return $(`${this.pageSelectors.uploadForm} ${this.pageSelectors.firstField}`) }
    
    get selectFilesIcon() { return $(`${this.pageSelectors.uploadForm} ${this.pageSelectors.selectedFilesIcon}`) }
    
    get tagsInput() { return $(`${this.pageSelectors.uploadForm} ${this.pageSelectors.tagsInput}`) }

    get filesList() { return $(`${this.pageSelectors.uploadForm} ${this.pageSelectors.filesList}`) }
    
    get uploadFile() { return $(`${this.pageSelectors.uploadFile}`) }

    get selectedUsersButton() { return $$(this.pageSelectors.buttons)[0] }

    get confirmUploadButton() { return $$(this.pageSelectors.buttons)[1] }

}

export const UploadForm = new UploadFormCo()