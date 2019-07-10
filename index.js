const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    const delay = (time) => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }

    console.log("\x1b[32m\x1b[1m", `


　　　　　　　　　 ,ｰ､　　　＿＿　　　　,ｰ､
　　　　　　　　. / ﾍ 〉, -´ｰ･ー ､ ｀ヽ/ ﾍ 〉
　　 　 　　　　.〈〈.／: : : : : : i :〈〈 ⌒ヽ
　　　　　　　　i :/,: : : 人: : :ﾄ､: : :゛　:.i
　　　　　　　　!〃: :／　.ヽ :!　 ヽ: i、: : : |
　　　　　　　　|ﾚ! / ●　　 ﾘ ● ﾙ: : !: ┐ : : 　|
　　　　　　　　|: Vl⊃　､_,､_,　⊂⊃::/ .」|: : :}
￣￣￣￣￣￣￣'ー―＝-―一’￣￣￣￣￣￣￣￣￣
　　　　∬　　　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
　　　　旦　　（＿＿＿＿＿＿＿＿＿＿(＿＿＿   ＿＿＿（ﾉ
 　　　　　　 　 　　　　　　　　　　　  　＼＼
　　　　　　　　　　　　　　　　　　　    　 ￣
    `)
    console.log("\x1b[0m");

    console.log("\x1b[32m\x1b[1m", "\tStarting...\n\n")
    console.log("\x1b[0m");

    fs.readFile("result/result.txt", async (err, buf) => {
        const resultData = await buf.toString().replace(/([0-9]*)(\t*)/g, "").split("\n");

        await page.setJavaScriptEnabled( false )
        await page.setDefaultNavigationTimeout(3 * 60 * 1000)

        await page.goto('https://www.jobpub.com/searchjob', { waitUntil: "load" })

        await page.focus("input[name='login_name']")
        await page.keyboard.type("ccp11669");
        await page.focus("input[name='password']")
        await page.keyboard.type("Immy11882")
        await page.$eval("form[name='login_form']", form => form.submit())

        await page.goto("http://resume.jobpub.com/cadvance_search.asp")
        await page.waitForSelector("form[name='myForm']", { timeout: 3 * 60 * 1000, visible: true })

        await page.select("select[name='Age_From']", "22");
        await page.select("select[name='Age_To']", "30");
        await page.select("select[name='Sal_From']", "15000");
        await page.select("select[name='Sal_To']", "30000");
        await page.select("select[name='Edu_From']", "4");
        await page.select("select[name='Edu_To']", "5");
        await page.$eval("form[name='myForm']", form => form.submit())

        console.log("Reading data...")
        delay(1000)

        let index = 0;

        for(;;){
            await page.waitForSelector("a.resume", { timeout: 3 * 60 * 1000, visible: true })

            let users = await page.evaluate((resultData) => {
                let anchors = document.querySelectorAll('a.resume')

                return [].map.call(anchors, a => {
                    if(!resultData.includes(`${a.textContent.trim()} `)) return a.href
                })
            }, resultData);

            users = users.filter(user => user);

            for(let user of users) {
                index = index + 1;

                let userPage = await browser.newPage()
                await userPage.setJavaScriptEnabled( false )
                await userPage.setDefaultNavigationTimeout(3 * 60 * 1000)

                try {
                    await userPage.goto(user)

                    await userPage.waitForSelector(".col-50r > b > font", { timeout: 3 * 60 * 1000, visible: true })

                    await delay(15 * 1000)

                    let userName = await userPage.evaluate(() => {
                        let name = document.querySelectorAll(".col-50r > b > font")[0].textContent
                        return name
                    })

                    let tel = await userPage.evaluate(() => {
                        let tel = document.querySelectorAll(".col-50r > font > font > a")[1].textContent
                        return tel
                    })

                    await fs.appendFileSync("result/result.txt", `${userName} \t${tel}\n`)
                    console.log(`${index}) Written: ${userName}  ${tel}`)

                    await userPage.close()
                } catch(err) {
                    await delay(15 * 1000)

                    console.log("Timeout, skip")

                    await userPage.close()
                    break;
                }
            }
            
            await page.evaluate(() => {
                console.log("\x1b[1m","\t\n New page: \t")
                let nextPageButton = document.querySelectorAll("td > table > tbody > tr > td > a")
                nextPageButton[nextPageButton.length - 1].click();
                delay(5000);
            })
        }
    });
})();

/* ccp11669 Immy11882 */