import { BasePO } from "./Base";

export class InformationHubPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      buttons: "button.btn-primary"
    }
  }

  get downloadButton() {return $$(this.pageSelectors.buttons)[1]}

  get addDocumentButton() {return $$(this.pageSelectors.buttons)[0]}

  open(): string {
    return super.open(`/info-hub`)
  }
}

export const InformationHub = new InformationHubPO()