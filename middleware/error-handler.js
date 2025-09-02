// 전역 오류처리 미들웨어
const errorHandler = (err, req, res, next) => {
    console.error('=== 오류 발생 ===');
    console.error('시간:', new Date().toISOString());
    console.error('요청 URL:', req.originalUrl);
    console.error('요청 메서드:', req.method);
    console.error('에러 메시지:', err.message);
    console.error('에러 스택:', err.stack);
    console.error('==================');

    // 개발 환경과 프로덕션 환경에 따른 에러 응답 분기
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    if (isDevelopment) {
        // 개발 환경: 상세한 에러 정보 제공
        res.status(500).json({
            success: false,
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            url: req.originalUrl,
            method: req.method
        });
    } else {
        // 프로덕션 환경: 간단한 에러 메시지만 제공
        res.status(500).json({
            success: false,
            message: '서버 내부 오류가 발생했습니다.',
            timestamp: new Date().toISOString()
        });
    }
};

export default errorHandler;
