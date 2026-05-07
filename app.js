// express의 부트스트랩 파일
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import userRoute from "./routes/user-route.js";
import postRoute from "./routes/post-route.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  // 로깅
  const reqUrl = req.url;
  const reqMethod = req.method;
  console.log(reqUrl, reqMethod);
  next();
});

app.use((req, res, next) => {
  // 인증 확인
  const auth = req.headers.authorization;
  console.log(auth);
  next();
});

app.get("/", (req, res) => {
  res.status(202).send("Hello World");
});

app.use("/users", userRoute);
app.use("/posts", postRoute);

app.use((req, res) => {
  console.log("Not Found");
  res.status(404).render("404", {
    title: "페이지를 찾을 수 없습니다",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
