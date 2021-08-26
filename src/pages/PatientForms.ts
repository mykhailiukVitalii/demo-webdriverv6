import { BasePO } from "./Base";

export class PatientFormsPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      buttons: "button.btn-primary"
    }
  }

  get downloadButton() {return $$(this.pageSelectors.buttons)[0]}

  get uploadButton() {return $$(this.pageSelectors.buttons)[1]}

  open(): string {
    return super.open(`/consentforms`)
  }
}

export const PatientForms = new PatientFormsPO()