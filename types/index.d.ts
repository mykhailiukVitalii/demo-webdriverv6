declare module WebdriverIO {
    // adding command to `browser`
    interface Browser {
        browserCustomCommand: (arg) => void

        waitMediumDelayAndClick: (element, selector?:string) => void

        cleanUpSession: (url: string) => void
    }
    // adding command to `$()`
    interface Element {
        // don't forget to wrap return values with Promise
        elementCustomCommand: (arg) => Promise<number>
        /**
         * Do JS click on current element using browser.execute
         */
        jsClick: () => void
    }
    interface BrowserObject {
        sharedStore: {
            get: (key: string) => jsonCompatible;
           set: (key: string, value: jsonCompatible) => void;
        }
    }
}