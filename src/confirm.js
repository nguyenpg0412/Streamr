const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getConfirmLink } = require('../utils/mongodb_connection')
puppeteer.use(StealthPlugin());



    (async () => {
        const confirmLinkArr = await getConfirmLink();
        console.log(confirmLinkArr);
        // const browser = await puppeteer.launch({
        //     headless: false,
        //     executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        //     userDataDir: "C:\\Users\\ACER\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1060",
        //     args: [
        //         '--start-maximized',
        //         '--disable-notifications',
        //     ],
        //     ignoreDefaultArgs: ["--enable-automation"],
        //     // devtools: true,
        //     ignoreHTTPSErrors: true,
        // });
        // const page = await browser.newPage();
        // await page.setViewport({ width: 900, height: 768 });
        // try {
        //     await page.goto("loginUrl", { waitUntil: 'load' });
        // } catch (error) {
        //     console.log(error);
        // }
    })();