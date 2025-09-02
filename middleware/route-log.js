// 라우트 로깅 미들웨어
import moment from "moment";

const routeLog = (req, res, next) => {
    const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(`${formattedDate} - ${req.method} ${req.baseUrl}${req.path}`);
    next();
};

export default routeLog;