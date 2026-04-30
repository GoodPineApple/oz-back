const { createFile } = require("./base/FileManager");
const { main } = require("./base/sum");

createFile("hello.txt", "Hello, World! Good Morning!");
createFile("hello2.txt", "Hello, World!2 Good Morning!");
createFile("hello3.txt", "Hello, World!3 Good Morning!");
// main();
