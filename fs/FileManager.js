const fs = require("fs");

function createFile() {
  fs.writeFileSync("hello.txt", "Hello, World!");
}

module.exports = { createFile };
