import puppeteer from "puppeteer";

const URL = "https://ezdegree.co.kr/";

async function crawl() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(URL);
    const content = await page.content();
    console.log(content);
  } catch (error) {
    console.error(error);
  }
}

export { crawl };
