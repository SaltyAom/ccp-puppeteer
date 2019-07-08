const puppeteer = require("puppeteer");

(async() => {
    const delay = (time) => {
        return new Promise(resolve => { 
            setTimeout(resolve, time)
        });
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    let endpoint = "https://www.google.com"

    await page.goto(endpoint, { waitUntil: "load" })

    delay(2000);
    await page.close();

    delay(500);
    browser.close();
})();