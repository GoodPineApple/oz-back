import axios from "axios";

const URL = "https://www.npmjs.com/package/puppeteer";

async function crawl() {
  const response = await axios.get(URL);
  console.log(response.data);
}

export { crawl };
