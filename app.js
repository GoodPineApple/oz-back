// express 부트스트랩 파일
import express from "express";
import indexRouter from "./routes/index-router.js";
import productsRouter from "./routes/products-router.js";
import routeLog from "./middleware/route-log.js";
import errorHandler from "./middleware/error-handler.js";
import notFoundHandler from "./middleware/not-found-handler.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
console.log(process.env.PORT);
console.log(process.env.NODE_ENV);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routeLog);
app.use("/", indexRouter);
app.use("/products", productsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

