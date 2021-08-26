import { shortDelay } from "./timeouts"
import { config } from "../../wdio.conf"
import reportportal = require('wdio-reportportal-reporter')
import * as fs from 'fs'
import * as path from 'path'
import * as chai from 'chai'
import { Element } from "@wdio/sync"

export function saveDifScreenshot(name: string): void {
    name += '.png'
    const folder = path.join(__dirname, `../../screens`)
    try {
        if (process.env.BASE_URL) {
            const appName = process.env.BASE_URL.match(/([^\/]*)\/*$/)[1]
            const appPath = `${folder}/${appName}`
            if (!fs.existsSync(appPath)) {
                fs.mkdirSync(appPath)
            }
            saveScreenshot(appPath, name) //TODO: combina as one function!
            if (config.sendDataToDahboard) { sendFileToDashboard(appPath, name) }
        } else {
            saveScreenshot(folder, name)
            if (config.sendDataToDahboard) { sendFileToDashboard(folder, name) }
        }
    } catch (err) {
        console.error("SaveDif screenshot unknown error: ", err)
    }
}

function sendFileToDashboard(filepath: string, name: string): void {
    const file = `${filepath}/${name}`
    browser.pause(shortDelay)
    browser.saveScreenshot(file)
    try {
        reportportal.sendFile('DEBUG', name, fs.readFileSync(file))
    } catch (e) {
        console.log("Reportportal error: ", e)
    }
}

function saveScreenshot(filepath: string, name: string): void {
    const file = `${filepath}/${name}`
    browser.pause(shortDelay)
    browser.saveScreenshot(file)
    console.log(`Screenshot taken and saved: ${file}`)
}

export function checkWindowUrl(endUrl: string): void {
    const fullUrl = browser.getUrl()
    chai.expect(fullUrl.match(/[^\/]+$/)[0]).to.eq(endUrl)
}

export async function waitForFileExist(filepath: string, retries: number = 10): Promise<boolean> {
    const isFileExist = fs.existsSync(filepath);

    if(isFileExist) {
        console.log(`File exists in temp folder: filepath =${filepath}`);
        return true;
    }

    if(retries === 0) {
        console.log(`File did not exists in temp folder and was not created during the timeout.`);
        return false;
    }

    await new Promise((res) => setTimeout(res, 5000));
    return await waitForFileExist(filepath, retries -1);
}

export async function isExistFileHtml(filepath: string, retries: number = 10): Promise<boolean> {
    let result: boolean = false;
    const isExist = await waitForFileExist(filepath, retries);

    if(isExist) {
        const htmlRegex = /<(!DOCTYPE|html|link).*?>|<(body|div|html).*?<\/\2>/i;
        const str = fs.readFileSync(filepath, 'utf8');
        const isHtml = htmlRegex.test(str);
        if(!isHtml) throw new Error("The existing File does not match HTML format.");
        result = isHtml;
    }

    return result;
}

export function scipAndSaveScreenshot(context: any, description: string, message: string):void {
    console.log(description)
    saveDifScreenshot(message)
    context.skip()
}

/**
 * Returns true if arr1 === arr2, else - false
 * @param {string[]} arr1 - array
 * @param {string[]} arr2 - array
 */
export function compareElementList(arr1: string[], arr2: string[]): boolean {
    console.log("First compare array: ", arr1)
    console.log("Second compare array: ", arr2)
    return arr1.length === arr2.length && arr1.sort().every(function (value: string, index: number) { return value === arr2.sort()[index] })
}

/**
 * Returns the Array of elements that contains needed text.
 * @param {string} selector - Selector of similar page elements
 * @param {string} text - The element text
 */
export function findByContainsText(selectors: string, text: string) {
    const elements = $$(selectors)
    //Find needed element from the elementsList, return Array
    return elements.filter(element => element.getText() == text)
}

/**
 * Delete folder with content if it exists
 * @param {string} dir - deleted folder relative path
 */
export function rmTempdir(dir) {
    if (!fs.existsSync(dir)) return console.log(`Temp dir: ${dir} does not exist!!!`)

    var list = fs.readdirSync(dir)
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i])
        var stat = fs.statSync(filename)

        if (filename == "." || filename == "..") {
            // pass these files
        } else if (stat.isDirectory()) {
            // rmTempdir recursively
            rmTempdir(filename)
        } else {
            // rm fiilename
            fs.unlinkSync(filename)
        }
    }
    fs.rmdirSync(dir)
    console.log(`!! ${dir} has been cleaned!!`)
    return true
}

/**
 * Check and Create temp folder
 * @param {string} dir - folder relative path
 */
export function mkTempdir(dir: string): boolean {
    if (!fs.existsSync(dir)) {
        // if it doesn't exist, create it
        fs.mkdirSync(dir)
        console.log(`Created ${dir}; downloadDir exist: ${fs.existsSync(dir)}`)
        return true
    } else {
        console.log(`Exist ${dir}; downloadDir exist: ${fs.existsSync(dir)}`)
        return false
    }
}

export function setChromeConfigForDownloading(wdioConfig: any, downloadDir: string) {
    // Update configuration for Download function
    let downloadConfig = Object.assign({}, wdioConfig)
    downloadConfig.capabilities[0]["goog:chromeOptions"].prefs.directory_upgrade = true
    downloadConfig.capabilities[0]["goog:chromeOptions"].prefs.prompt_for_download = false
    downloadConfig.capabilities[0]["goog:chromeOptions"].prefs["download.default_directory"] = downloadDir
}

export function fixElementText(text: string): string {
    const namePart = text.toLocaleLowerCase().split(" ")
    if (namePart[0].length === 0) throw new Error(`${text} contains empty part.`)
    return namePart.join("-")
}

export function fixShowAllCount(text: string): number {
    const result = +text.replace(/[\(\)']+/g, "")
    if(!result) throw new Error(`The ${text} should contain a Number value inside "()".`)

    return result
}