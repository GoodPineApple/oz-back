// 라우트 로깅 미들웨어
const routeLog = (req, res, next) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    console.log(`${formattedDate} - ${req.method} ${req.baseUrl}${req.path}`);
    next();
};

export default routeLog;