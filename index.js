const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.setDefaultNavigationTimeout(30 * 1000)

    await page.goto('https://www.jobpub.com/searchjob', { waitUntil: "load" })

    console.log("Logging in...")
    await page.focus("input[name='login_name']")
    await page.keyboard.type("ccp11669");
    await page.focus("input[name='password']")
    await page.keyboard.type("Immy11882")
    await page.$eval("form[name='login_form']", form => form.submit())

    await page.goto("http://resume.jobpub.com/cadvance_search.asp")
    await page.waitForSelector("form[name='myForm']")
    console.log("Logged in!")

    console.log("Preparing for data...")
    await page.select("select[name='Age_From']", "22");
    await page.select("select[name='Age_To']", "30");
    await page.select("select[name='Sal_From']", "15000");
    await page.select("select[name='Sal_To']", "30000");
    await page.select("select[name='Edu_From']", "4");
    await page.select("select[name='Edu_To']", "5");
    await page.$eval("form[name='myForm']", form => form.submit())

    await fs.appendFileSync("result/result.txt", `\n\nResult set:\n`)
    console.log("Start reading data...")

    for(;;){
        await page.waitForSelector("a.resume")

        let users = await page.evaluate(() => {
            let anchors = document.querySelectorAll('a.resume')
            return [].map.call(anchors, a => a.href)
        });

        for(let user of users) {
            try {
                let userPage = await browser.newPage()
                await userPage.setDefaultNavigationTimeout(15 * 1000)

                await userPage.goto(user)

                await userPage.waitForSelector(".col-50r > b > font")
                let userName = await userPage.evaluate(() => {
                    let name = document.querySelectorAll(".col-50r > b > font")[0].textContent
                    return name
                })

                let tel = await userPage.evaluate(() => {
                    let tel = document.querySelectorAll(".col-50r > font > font > a")[1].textContent
                    return tel
                })

                await fs.appendFileSync("result/result.txt", `${userName} \t${tel}\n`)
                console.log(`Written: ${userName}  ${tel}`)

                await userPage.close()
            } catch(err) {
                console.log("Timeout, skip");
                break;
            }
        }
        
        await page.evaluate(() => {
            let nextPageButton = document.querySelectorAll("td > table > tbody > tr > td > a")
            nextPageButton[nextPageButton.length - 1].click();
        })
    }
})();

/* ccp11669 Immy11882 */