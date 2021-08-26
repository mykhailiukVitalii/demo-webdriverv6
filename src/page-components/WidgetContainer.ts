import { PlotSettingsForm } from "../../src/page-components/PlotSettings"
import { Modal } from "../../src/page-components/Modal"
import { saveDifScreenshot } from "../../src/misc/functions"

export class WidgetContainer {
    private pageSelectors: any

    constructor() {
        this.pageSelectors = {
            chartSettingsButton: ".widget button[title='Chart Settings']",
            plotTitle: ".plot-wrapper > h2",
            plotXaxisTitle: "g.g-xtitle > text.xtitle",
            plotYaxisTitle: "text.xtitle",
            plotYaxisText: ".g-ytitle > text.ytitle",
            plotSecondYaxisText: ".g-y2title > text.y2title",
            plotBothSecondYaxisText: ".g-y3title > text.y3title",
            chartPlot: "g.plot",
            svgPlot: ".svgplot",
            clusteringPlot: "g.brush",
            chartLegend: "g.legend",
            radarPlot: "g.polar",
            radarPlotLayer: "g.polarlayer",
            radarPoints: "g.angularaxistick",
            clustGroupPlot: "g.clust_group",
            clusteringXlabel: "text.axis.label",
            labelGropuText: "g.row_label_group > text",
            labelCorrelationText: "g.xtick > text",
            pointsFor3d: "#scene > canvas",
            menu3dPlot: "[data-title='Orbital rotation']",
            clusterInvisibleLink: "path.invisibleLink",
            volcanoInfolayer: ".infolayer > g.g-xtitle",
            clusterPointsPlot: "g.clust_container",
            plotXaxisTrellis: ".g-x5title > text.x5title",
            plotXaxisTrellisSecond: ".g-x6title > text.x6title",
            plotXaxisTrellisBothFirst: ".g-x9title > text.x9title",
            plotXaxisTrellisBothSecond: ".g-x10title > text.x10title",
            plotXRanges: ".xaxislayer-above g.xtick",
            plotYRanges: ".yaxislayer-above g.ytick",
            plotPoints: "g.points > .point",
            gnomadAttributes: "[class^='AttributeList'] dt",
            referenceAnnotationText: "g > text.annotation-text",
            annotationsText: "text.col_cat_super"
        }
    }

    get chartSettingsButton() { return $(this.pageSelectors.chartSettingsButton) }

    get plotPoints() { return $$(this.pageSelectors.plotPoints) }

    get gnomadAttributes() { return $$(this.pageSelectors.gnomadAttributes) }

    get pointsFor3d() { return $(this.pageSelectors.pointsFor3d) }

    get clusterPointsPlot() { return $(this.pageSelectors.clusterPointsPlot) }

    get menu3dPlot() { return $(this.pageSelectors.menu3dPlot) }

    get volcanoInfolayer() { return $(this.pageSelectors.volcanoInfolayer) }

    get firstClusterInvisibleLink() { return $$(this.pageSelectors.clusterInvisibleLink)[0] }

    get plotTitle() { return $(this.pageSelectors.plotTitle) }

    get plotXaxisTitle() { return $(this.pageSelectors.plotXaxisTitle) }

    get plotYaxisText() { return $(this.pageSelectors.plotYaxisText) }

    get plotYaxisTrellisRowLabel() { return $(this.pageSelectors.plotYaxisText).$("tspan") }

    get plotYaxisTrellisBothSecondLabel() { return $(this.pageSelectors.plotBothSecondYaxisText).$("tspan") }

    get plotXaxisTrellisBothLabel() { return $(this.pageSelectors.plotXaxisTrellisBothFirst).$("tspan") }

    get plotXaxisTrellisColumnLabel() { return $(this.pageSelectors.plotXaxisTrellis).$("tspan") }

    get plotSecondYaxisText() { return $(this.pageSelectors.plotSecondYaxisText) }

    get plotSecondYaxisTrellisRowLabel() { return $(this.pageSelectors.plotSecondYaxisText).$("tspan") }

    get plotSecondXaxisTrellisRowLabel() { return $(this.pageSelectors.plotXaxisTrellisSecond).$("tspan") }

    get plotSecondXaxisTrellisBothLabel() { return $(this.pageSelectors.plotXaxisTrellisBothSecond).$("tspan") }

    get plotXRanges() { return $$(this.pageSelectors.plotXRanges) }

    get plotYRanges() { return $$(this.pageSelectors.plotYRanges) }

    get plotYaxisTitle() { return $(this.pageSelectors.plotYaxisTitle) }

    get chartPlot() { return $(this.pageSelectors.chartPlot) }

    get clusteringPlot() { return $(this.pageSelectors.clusteringPlot) }

    get clustGroupPlot() { return $(this.pageSelectors.clustGroupPlot) }

    get chartPlotArray() { return $$(this.pageSelectors.chartPlot) }

    get radarPointsArray() { return $$(this.pageSelectors.radarPoints) }

    get labelGropuTextArray() { return $$(this.pageSelectors.labelGropuText) }

    get labelCorrelationText() { return $$(this.pageSelectors.labelCorrelationText) }

    get chartLegend() { return $(this.pageSelectors.chartLegend) }

    get svgPlot() { return $(this.pageSelectors.svgPlot) }

    get radarPlot() { return $(this.pageSelectors.radarPlot) }

    get radarPlotLayer() { return $(this.pageSelectors.radarPlotLayer) }

    get annotationsText() { return $$(this.pageSelectors.annotationsText) }

    get clusteringXlabel() { return $(this.pageSelectors.clusteringXlabel) }

    get referenceAnnotationsText() { return $$(this.pageSelectors.referenceAnnotationText) }

    logModalWindowErrorWithScreen(screenName: string, logDescription: string) {
        saveDifScreenshot(screenName)
        const errorType = Modal.getModalErrorType()
        const errorMessage = Modal.getModalErrorMessage()        
        //Close modal window
        PlotSettingsForm.closeModalWindow()
        throw new Error(`${logDescription}! Original error type: ${errorType} / Original error: ${errorMessage}`)
    }

    skipingDataSelectionAfterErrors(context: any, errorMessage: string, errorsNumber: number,maxErrors: number = 5) {               
        const errorMessages = ["Selector: \"[title='Chart Settings']\" after delay = 5000. Double-check the presence of the element on the page."]
        if (errorMessages.includes(errorMessage) || (errorsNumber === maxErrors)) context.skip()
    }
}

export const Widget = new WidgetContainer()