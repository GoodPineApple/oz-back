import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    console.log("Hello World");

    res.send("Hello World");
});

// http://localhost:3000/test/this-is-test-id?q=1&query=test-query
router.get("/test/:testId", (req, res) => {
    console.log("Test");
    const params = req.params;
    const query = req.query;
    const body = req.body;
    const headers = req.headers;
    console.log(params, query, body, headers);
    res.send("Test");
});

// http://localhost:3000/test/this-is-test-id?q=1&query=test-query
router.post("/test/:testId", (req, res) => {
    console.log("Test");
    const params = req.params;
    const query = req.query;
    const body = req.body;
    const headers = req.headers;
    console.log(params, query, body, headers);
    res.send("Test");
});

router.get("/test2", (req, res) => {
    console.log("Test2");
    res.send("Test2");
});

export default router;