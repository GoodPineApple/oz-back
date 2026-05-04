import axios from "axios";

async function crawl() {
  const response = await axios.get("https://www.google.com");
  console.log(response.data);
}

export { crawl };
