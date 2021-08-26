import { Element, ElementArray } from "@wdio/sync"
import * as nodeFetch from "node-fetch"
import * as https from "https"

export class BasePO {
    private postfix: string = process.env.BASE_URL || browser.config.baseUrl

    open(url: string): string {
        const navigate = `${this.postfix}#` + url
        console.log("Navigating to: ", navigate)
        browser.url(navigate)
        //Get current ring-session cookie
        return this.ringSessionValue()
    }

    closeMenu(delay: number = 10000): void {
        $("img.company-logo").waitForDisplayed({ timeout: delay })
        $("img.company-logo").moveTo()
        browser.pause(1500)
    }

    protected waitClickableElement(element: Element, delay: number): Element {
        element.waitForClickable({
            timeout: delay,
            timeoutMsg: `Expected "${element.selector}" element should be clickable(delay = ${delay}ms).`
        })

        return element
    }

    protected waitDisplayedElement(element: Element, delay: number): Element {
        element.waitForDisplayed({
            timeout: delay,
            timeoutMsg: `Expected "${element.selector}" element should be displayed(delay = ${delay}ms).`
        })

        return element
    }

    protected waitExistElement(element: Element, delay: number): Element {
        element.waitForExist({
            timeout: delay,
            timeoutMsg: `Expected "${element.selector}" element should be exist(delay = ${delay}ms).`
        })

        return element
    }

    protected clickOnElement(element: Element, delay: number): Element {
        this.waitClickableElement(element, delay).click()

        return element
    }

    protected scrolToElementAndClick(element: Element, delay: number): Element {
        this.waitClickableElement(element, delay).scrollIntoView()
        element.click()

        return element
    }

    protected scrolToElementAndClickWithPause(element: Element, delay: number): Element {
        browser.pause(500)
        element.waitForClickable({timeout: delay})
        browser.pause(15000)
        element.scrollIntoView({behavior: "smooth", block: "end"})
        element.click()

        return element
    }

    protected setElementValue(element: Element, value: string, delay: number): Element {
        this.waitDisplayedElement(element, delay).setValue(value)

        return element
    }

    protected moveCursorOnElement(element: Element, delay: number, pause: number): Element {
        this.waitDisplayedElement(element, delay).moveTo()
        browser.pause(pause)

        return element
    }

    protected waitUntilElementIsDisplayed(element: Element, delay: number = 5000): Element {
        //Wait when section is displayed
        browser.waitUntil(
            () => element.isDisplayed() === true,
            {
                timeout: delay,
                timeoutMsg: `Element should be displayed on the page (delay = ${delay}ms).`
            }
        )

        return element
    }

    protected elementIsHidden(element: Element, delay: number = 5000): Element {
        //Wait when the legend section is hidden
        browser.waitUntil(
            () => element.isDisplayed() === false,
            {
                timeout: delay,
                timeoutMsg: `The element (${element.selector}) is expected to be hidden (delay = ${delay}ms).`
            }
        )

        return element
    }

    protected waitElementTextIncludes(element: Element, text: string, delay: number = 5000): Element {
        //wait Name updating
        browser.waitUntil(
            () => element.getText().includes(text),
            {
                timeout: delay,
                timeoutMsg: `Element text(${element.getText()}) should be updated including (${text}, delay = ${delay}ms).`
            }
        )
        console.log('expected element text: ', element.getText())

        return element
    }

    protected waitElementTextEql(element: Element, text: string, delay: number = 5000): Element {
        //wait Name updating
        browser.waitUntil(
            () => element.getText() === text,
            {
                timeout: delay,
                timeoutMsg: `Element text(${element.getText()}) should be updated to name = ${text} (delay = ${delay}ms).`
            }
        )

        return element
    }

    protected filterByText(elements: ElementArray, text: string, delay: number = 5000): ElementArray {
        browser.waitUntil(
            //include name            
            () => elements.filter(element => element.getText().includes(text)).length > 0,
            {
                timeout: delay,
                timeoutMsg: `Name of the last available element from the list "${text}" should be displayed (delay = ${delay}ms).`
            }
        )

        return elements
    }

    ringSessionValue(): string {
        browser.pause(500)
        const session = browser.getCookies(["ring-session"]).find(cookie => cookie.name.includes("ring-session")).value
        console.log(`Current user ring-session=${session}`)

        return session
    }

    cleanupSessionRoute(session: string): string {
        return `${this.postfix}cleanup-session/${session}`
    }

    cleanUpUserSessions(sessionCookie: string, option = { method: "GET" }, attempt: number = 0) {
        const url = this.cleanupSessionRoute(sessionCookie)
        browser.call(async () => {
            console.log(`<-----!!!Sending a request to the ${url}!!!----->`)
            try {
              await nodeFetch(url, { method: "GET" }) //Send request for /cleanup-session/:session_key endpoint
                .then((res: any) => {
                  res.status === 204
                      ? console.log(`[${attempt}] Application sessions only for current user using ring-session cookie was deleted successfully! Status: `, res.status)
                      : console.log(`[${attempt}] Application sessions has not been deleted!. Status: `, res.status)            
                })
                .catch((e: any) => {
                    console.log("Fetch error.code = ", e.code)
          
                    if(["DEPTH_ZERO_SELF_SIGNED_CERT", "UNABLE_TO_VERIFY_LEAF_SIGNATURE"].includes(e.code) && (attempt === 0)) {
                      const agent = new https.Agent({ rejectUnauthorized: false })
          
                      return this.cleanUpUserSessions(url, Object.assign(option, { agent }), ++attempt)
                    }
                  })
            } catch(error) {
              console.log("Sending request error:", error)
            }
        })
    }
}