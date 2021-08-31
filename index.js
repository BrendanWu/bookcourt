const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const moment = require("moment");
const schedule = require("node-schedule");
dotenv.config();


const bookCourt = async (url) => {
  try {
    let browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: false,
    });
    let page = await browser.newPage();
    console.log(process.env.USER);
    console.log(process.env.PASS);
    await page.goto(url, {
      waitUntil: "networkidle0",
    });
    await page.type("#UserName", process.env.MY_USER);
    await page.type("#Password", process.env.MY_PASS);

    await page.click("#LoginButton");
    await page.waitForNavigation();
    const today = moment();
    const threeDaysFromToday = today.add(3,"days")
    console.log(threeDaysFromToday.format("dddd[,] MMMM DD[,] YYYY"))
    await page.waitForSelector(`td[title="${threeDaysFromToday.format("dddd[,] MMMM DD[,] YYYY")}"]`)
    await page.click(`td[title="${threeDaysFromToday.format("dddd[,] MMMM DD[,] YYYY")}"]`);
    await page.waitForTimeout(1000)
    await page.waitForSelector("#ctl00_ContentPlaceHolder1_StartTimePicker_dateInput");
    await page.$eval('#ctl00_ContentPlaceHolder1_StartTimePicker_dateInput', el => el.value = "10:00 PM");
    await page.waitForSelector("#ctl00_ContentPlaceHolder1_EndTimePicker_dateInput");
    await page.$eval("#ctl00_ContentPlaceHolder1_EndTimePicker_dateInput", el => el.value = "11:00 PM");
    await page.waitForTimeout(1000)
    await page.click('input[name="ctl00$ContentPlaceHolder1$liabilityWaiverAgreeCheckbox"]');
    await page.waitForTimeout(1000)
    await page.waitForSelector(".Right");
    await page.$eval('.Right', el => el.firstChild.nextSibling.click());
    // await page.click('a[id=ictl00_ContentPlaceHolder1_FooterSaveButton]');
    // await page.click(".body")
  } catch (error) {
    console.log(error);
  }
};

console.log("I will book tonight")

// var j = schedule.scheduleJob('00 * * * *', function(){
//     console.log("Started booking ")
//     bookCourt(
//         "https://www.buildinglink.com/V2/Tenant/Amenities/NewReservation.aspx?amenityId=10944&from=0&selectedDate="
//       );
      
// });

console.log("Started booking ")
bookCourt(
    "https://www.buildinglink.com/V2/Tenant/Amenities/NewReservation.aspx?amenityId=10944&from=0&selectedDate="
  );
