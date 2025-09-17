import StaticScrapper from "./scrapper/static/static-scrapper.js";
import DynamicScrapper from "./scrapper/dynamic/dynamic-scrapper.js";


DynamicScrapper.crawl();





// const respJson = await StaticScrapper.crawl(crawlUrl);
// StaticScrapper.save(respJson);

import hello from "./hello/hello.js";
import testFS from "./hello/fs.js";
import TxtManager from "./hello/TxtManager.js";

hello();
testFS();

// TxtManager.makeTxtFile("test.txt", "Hello Worldfdfdfdfd", true);
// TxtManager.readTxtFile("test.txt");
// console.log("index.js END");
