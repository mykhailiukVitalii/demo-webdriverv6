import { BasePO } from "./Base";
import { Table } from "../page-components/Table";
import { ShowinfoSubplot } from "../page-components/ShowinfoSubplot";

export class LoadDashboardPagePO extends BasePO {
    private pageSelectors: any;

    constructor() {
        super();
        this.pageSelectors = {
            dashboardNamePart: "h2 span"
        }
    }

    get dashboardNamePart() { return $(this.pageSelectors.dashboardNamePart) }

    openExistSubplot(name: string, count: number, delay: number = 5000): boolean {
        Table.waitFirstRow(delay)
        browser.pause(500)
        this.increaseTableItems(count, delay)
        Table.choseDashboardFromSavedList(name, delay)

        return ShowinfoSubplot.waitSubplotContainer(delay)
    }

    increaseTableItems(count: number, delay: number = 5000) {
        browser.waitUntil(
            () => Table.mainTableActiveRowsByLink.length === count,
            {
              timeout: delay,
              timeoutMsg: `The Row should be added to the Table. The number of rows after adding = ${count} (${delay}ms.)`
            })
    }

    open(): string {
        return super.open(`/list-dashboards`)
    }
}

export const LoadDashboardPage = new LoadDashboardPagePO()