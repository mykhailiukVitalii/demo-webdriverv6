import { BasePO } from "./Base";

export class SampleInventoryPO extends BasePO {
  private pageSelectors: any;

  constructor() {
    super();
    this.pageSelectors = {
      buttons: "button.btn-primary",
      inputField: "input[type='text']",
      fullButton: "button.btn-primary > span"
    }
  }

  get createSubjectSelectionButton() {return $$(this.pageSelectors.buttons)[0]}

  get compareVersionButton() {return $$(this.pageSelectors.buttons)[1]}

  get fullShowInfoButton() {return $$(this.pageSelectors.fullButton)[2]}

  get inputSubjectSelectionField() {return $$(this.pageSelectors.inputField)[0]}

  open(): string {
    return super.open(`/charts/bdm/sampleinventory`)
  }
}

export const SampleInventory = new SampleInventoryPO()