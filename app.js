// express 부트스트랩 파일
import express from "express";
import indexRouter from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use("/", indexRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

