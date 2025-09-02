// 404 Not Found 핸들러 미들웨어
const notFoundHandler = (req, res, next) => {
    console.log('=== 404 Not Found ===');
    console.log('시간:', new Date().toISOString());
    console.log('요청 URL:', req.originalUrl);
    console.log('요청 메서드:', req.method);
    console.log('IP 주소:', req.ip);
    console.log('User-Agent:', req.get('User-Agent'));
    console.log('=====================');

    // 404 응답
    res.status(404).json({
        success: false,
        message: '요청하신 페이지를 찾을 수 없습니다.',
        error: 'Not Found',
        statusCode: 404,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
};

export default notFoundHandler;
