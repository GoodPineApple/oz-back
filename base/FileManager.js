const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "files");
console.log(filePath); // /Users/oz/Documents/oz-back/files

function createFile(fileName, content) {
  console.log(fileName);
  console.log(content);
  fs.writeFileSync(path.join(filePath, fileName), content);
}

module.exports = { createFile };
