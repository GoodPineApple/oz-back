// express의 부트스트랩 파일
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  const reqUrl = req.url;
  const reqMethod = req.method;
  console.log(reqUrl, reqMethod);
  res.send("Hello World");
});

app.get("/posts", (req, res) => {
  const posts = [
    { id: 1, title: "Hello World" },
    { id: 2, title: "Hello World" },
    { id: 3, title: "Hello World" },
    { id: 4, title: "Hello World" },
  ];
  res.json(posts);
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
