import { BasePO } from "./Base"
import { Widget } from "../page-components/WidgetContainer"

import { Element, ElementArray } from "@wdio/sync"

export class Charts extends BasePO{
    private pageSelectors: any

    constructor() {
        super();
        this.pageSelectors = {
            chartPlot: "g.plot",
            svgPlot: ".svgplot",
        }
    }

    get chartPlot() { return $(this.pageSelectors.chartPlot) }

    get svgPlot() { return $(this.pageSelectors.svgPlot) }

    waitXLabelIncludeFirstBiomarker(name: string, delay: number = 5000): Element {
        //Name of the first selected Biomarker is displayed in the X label
        return this.waitElementTextIncludes(Widget.clusteringXlabel, name, delay)        
    }
    waitFirstXLabelEqualFirstBiomarker(name: string, delay: number = 5000): Element {
        //Name of the first selected Biomarker is displayed in the X label
        return this.waitElementTextEql(Widget.plotXaxisTitle, name, delay)
    }
    checkXLabelIncludesFirstBiomarker(name: string, delay: number = 5000): Element {        
        //Wait when points are displayed(".g-xtitle > text.xtitle" selector)
        return this.waitElementTextIncludes(Widget.plotXaxisTitle, name, delay)
    }
    checkYtitleIncludeSelectedVariables(name: string, delay: number = 5000): Element {
        //Wait when points are displayed(".g-ytitle > text.ytitle" selector)
        return this.waitElementTextIncludes(Widget.plotYaxisText, name, delay)
    }
    yAxisUpdating(text: string, delay: number = 5000): Element {
        //Wait when Plot Y axis is displayed
        browser.pause(500)
        return this.waitElementTextEql(Widget.plotYaxisText, text, delay)
    }
    xAxisUpdating(text: string, delay: number = 5000): Element {
        //Wait when Plot X axis is displayed
        browser.pause(500)
        return this.waitElementTextEql(Widget.plotXaxisTitle, text, delay)
    }
    checkSecondYtitleIncludeLastBiomarker(text: string, delay: number = 5000): Element {
        //Wait when points are displayed(".g-y2title > text.y2title" selector)
        return this.waitElementTextIncludes(Widget.plotSecondYaxisText, text, delay)
    }
    checkSampleInventoryHeader(text: string, delay: number = 5000): Element {
        //The Sample Type contains substring
        return this.waitElementTextIncludes(Widget.plotTitle, text, delay)
    }
    checkChartLegendIsHidden( delay: number = 5000): Element {
        //Wait when the legend section is hidden
        return this.elementIsHidden(Widget.chartLegend, delay)
    }
    waitChartPlotContainer(delay: number = 5000): Element {
        //Wait Plot container
        return this.waitDisplayedElement(this.chartPlot, delay)
    }
    waitChartSvgPlotContainer(delay: number = 5000): Element {
        //Wait Plot container
        return this.waitDisplayedElement(this.svgPlot, delay)
    }
    waitClustGroupPlotContainer(delay: number = 5000): Element {
        //Wait Plot container
        return this.waitDisplayedElement(Widget.clustGroupPlot, delay)
    }
    waitClusteringPlotContainer(delay: number = 5000): Element {
        //Wait Plot container
        return this.waitDisplayedElement(Widget.clusteringPlot, delay)
    }
    waitVolcanoInfolayer(delay: number = 5000): Element {
        //Wait Plot container
        return this.waitDisplayedElement(Widget.volcanoInfolayer, delay)
    }
    waitPlotHeaderContainer(delay: number = 5000): Element {
        //Wait Plot Layer container
        return this.waitDisplayedElement(Widget.plotTitle, delay)
    }
    waitRadarPlotLayerContainer(delay: number = 5000): Element {
        //Wait Plot Layer container
        return this.waitDisplayedElement(Widget.radarPlotLayer, delay)
    }
    wait3dCanvasPoints(delay: number = 5000): Element {
        //Wait Plot Layer container
        return this.waitDisplayedElement(Widget.pointsFor3d, delay)
    }
    waitClusterPoints(delay: number = 5000): Element {
        //Wait Plot Layer container
        return this.waitDisplayedElement(Widget.clusterPointsPlot, delay)
    }
    check3dOrbitalRotationIsShown( delay: number = 5000): Element {
        //Wait the legend section is present
        return this.waitUntilElementIsDisplayed(Widget.menu3dPlot, delay)
    }
    checkInvisibleLinkIsDisplayed(delay: number = 5000): Element {
        //Wait the cluster link is present
        return this.waitUntilElementIsDisplayed(Widget.firstClusterInvisibleLink, delay)
    }
    waitPlotRenderEqualUpdate(plotElement: Element, text: string, delay: number = 5000): Element {
        //The Sample Type contains substring
        return this.waitElementTextEql(plotElement, text, delay)
    }
    waitPlotRenderIncludeUpdate(plotElement: Element, text: string, delay: number = 5000): Element {
        //The Sample Type contains substring
        return this.waitElementTextIncludes(plotElement, text, delay)
    }
    checkAnnotationColumnColumn(text: string, delay: number = 5000): void {
        //Wait until "text.col_cat_super" with new name is shown
        browser.waitUntil(
            () => Widget.annotationsText.filter(element => element.getText() === text).length === 1,
            {
                timeout: delay,
                timeoutMsg: `The Annotation Columns with the added column should be displayed within ${delay}ms.`
            }
        )
    }
    checkLabelGroupTextName(name: string, delay: number = 5000): ElementArray {
        //find by name
        return this.filterByText(Widget.labelGropuTextArray, name, delay)
    }
    checkRadarPointName(name: string, delay: number = 5000): ElementArray {
        //find by points name
        return this.filterByText(Widget.radarPointsArray, name, delay)
    }
    checkLabelEqualLastBiomarkerCorrelation(text: string, delay: number = 5000): ElementArray {
        //Name of the last selected Biomarker is displayed in the xtick label
        return this.filterByText(Widget.labelCorrelationText, text, delay)
    }
    //additional
    waitChartLegendSection(delay: number) {
        //Wait when Plot is displayed ("g.plot")
        this.waitUntilElementIsDisplayed(Widget.chartPlot, delay)
        //Plot contains Legend section by default ("g.legend")
        this.waitUntilElementIsDisplayed(Widget.chartLegend, delay)
    }
}

export const Chart = new Charts()