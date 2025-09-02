// 토큰 검증 미들웨어 (crypto 모듈 기반 JWT 스타일)
import crypto from "crypto";

// JWT 비밀키 (환경변수에서 가져오거나 기본값 사용)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// JWT 스타일 토큰 검증 함수
const verifyJWTStyleToken = (token) => {
    try {
        // 토큰 구조 분해
        const [encodedHeader, encodedPayload, signature] = token.split('.');
        
        if (!encodedHeader || !encodedPayload || !signature) {
            return null;
        }
        
        // 서명 검증
        const expectedSignature = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64url');
        
        if (signature !== expectedSignature) {
            return null;
        }
        
        // 페이로드 디코딩
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
        
        // 만료시간 확인
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        
        return payload;
        
    } catch (error) {
        console.error('토큰 검증 오류:', error);
        return null;
    }
};

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "인증 토큰이 필요합니다.",
                error: "Unauthorized"
            });
        }
        
        const token = authHeader.substring(7); // "Bearer " 제거
        
        // JWT 스타일 토큰 검증
        const payload = verifyJWTStyleToken(token);
        
        if (!payload) {
            return res.status(401).json({
                success: false,
                message: "유효하지 않거나 만료된 토큰입니다.",
                error: "Invalid Token"
            });
        }
        
        // 검증된 사용자 정보를 req 객체에 저장
        req.user = {
            userId: payload.userId,
            email: payload.email,
            name: payload.name
        };
        req.token = token;
        
        // 다음 미들웨어로 진행
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "토큰 검증 중 오류가 발생했습니다.",
            error: "Internal Server Error"
        });
    }
};

// 선택적 인증 미들웨어 (토큰이 있으면 검증, 없어도 통과)
const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = verifyJWTStyleToken(token);
        
        if (payload) {
            req.user = {
                userId: payload.userId,
                email: payload.email,
                name: payload.name
            };
            req.token = token;
        }
    }
    
    next();
};

export { authMiddleware, optionalAuthMiddleware };
