// express 부트스트랩 파일
import express from "express";
import indexRouter from "./routes/index-router.js";
import productsRouter from "./routes/products-router.js";
import routeLog from "./middleware/route-log.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routeLog);
app.use("/", indexRouter);
app.use("/products", productsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

