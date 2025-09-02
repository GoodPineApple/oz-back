import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    console.log("Hello World");
    
    // 강제 에러 발생 - 여러 가지 방법
    
    // 방법 1: 존재하지 않는 함수 호출
    nonExistentFunction();
    
    // 방법 2: null 객체 접근
    // let obj = null;
    // console.log(obj.property);
    
    // 방법 3: undefined 객체 메서드 호출
    // let undefinedVar;
    // undefinedVar.someMethod();
    
    // 방법 4: 명시적 에러 던지기
    throw new Error("강제로 발생시킨 에러입니다!");
    
    // 방법 5: JSON 파싱 에러
    // JSON.parse("잘못된 JSON 문자열");
    
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