import express from "express";
import crypto from "crypto";

const router = express.Router();

// JWT 스타일 토큰을 위한 비밀키
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// 메모리에 저장할 사용자 데이터 (DB 대신)
let users = [
    {
        id: 1,
        email: "admin@example.com",
        password: hashPassword("password123"),
        name: "관리자",
        createdAt: new Date().toISOString()
    }
];

// 활성 토큰들을 저장할 메모리 저장소 (DB 대신)
let activeTokens = new Map();

// 비밀번호 해시 함수 (crypto 모듈 사용)
function hashPassword(password) {
    const salt = 'oz-back-salt-2024'; // 실제로는 랜덤 salt 사용
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// JWT 스타일 토큰 생성 함수 (crypto 모듈 사용)
const generateJWTStyleToken = (payload) => {
    // Header
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    // Payload (사용자 정보 + 만료시간)
    const tokenPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000), // 발급 시간
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24시간 후 만료
    };
    
    // Base64 인코딩
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
    
    // 서명 생성
    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');
    
    const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    
    // 활성 토큰 저장
    activeTokens.set(token, {
        userId: payload.userId,
        email: payload.email,
        expiresAt: new Date(tokenPayload.exp * 1000),
        createdAt: new Date()
    });
    
    return token;
};

// JWT 스타일 토큰 검증 함수
const verifyJWTStyleToken = (token) => {
    try {
        // 토큰이 활성 토큰 목록에 있는지 확인
        const tokenData = activeTokens.get(token);
        if (!tokenData) {
            return null;
        }
        
        // 토큰 만료 확인
        if (new Date() > tokenData.expiresAt) {
            activeTokens.delete(token);
            return null;
        }
        
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
            activeTokens.delete(token);
            return null;
        }
        
        return {
            ...tokenData,
            payload
        };
        
    } catch (error) {
        console.error('토큰 검증 오류:', error);
        return null;
    }
};

/**
 * Method: POST
 * Path: /auth/register
 * Description: 회원가입
 * Body: { email, password, name }
 */
router.post("/register", (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // 입력 검증
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "이메일, 비밀번호, 이름은 필수입니다."
            });
        }
        
        // 이메일 중복 확인
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "이미 존재하는 이메일입니다."
            });
        }
        
        // 새 사용자 생성
        const newUser = {
            id: users.length + 1,
            email,
            password: hashPassword(password),
            name,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        // JWT 스타일 토큰 생성
        const token = generateJWTStyleToken({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name
        });
        
        res.status(201).json({
            success: true,
            message: "회원가입이 완료되었습니다.",
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    createdAt: newUser.createdAt
                },
                token,
                expiresIn: "24h"
            }
        });
        
    } catch (error) {
        next(error);
    }
});

/**
 * Method: POST
 * Path: /auth/login
 * Description: 로그인
 * Body: { email, password }
 */
router.post("/login", (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // 입력 검증
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "이메일과 비밀번호는 필수입니다."
            });
        }
        
        // 사용자 찾기
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "이메일 또는 비밀번호가 잘못되었습니다."
            });
        }
        
        // 비밀번호 확인
        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            return res.status(401).json({
                success: false,
                message: "이메일 또는 비밀번호가 잘못되었습니다."
            });
        }
        
        // JWT 스타일 토큰 생성
        const token = generateJWTStyleToken({
            userId: user.id,
            email: user.email,
            name: user.name
        });
        
        res.json({
            success: true,
            message: "로그인 성공",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt
                },
                token,
                expiresIn: "24h"
            }
        });
        
    } catch (error) {
        next(error);
    }
});

/**
 * Method: POST
 * Path: /auth/logout
 * Description: 로그아웃 (토큰 무효화)
 * Headers: { Authorization: "Bearer <token>" }
 */
router.post("/logout", (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "토큰이 제공되지 않았습니다."
            });
        }
        
        const token = authHeader.substring(7); // "Bearer " 제거
        
        // 토큰 삭제 (로그아웃)
        const deleted = activeTokens.delete(token);
        

        
        res.json({
            success: true,
            message: "로그아웃되었습니다."
        });
        
    } catch (error) {
        next(error);
    }
});

/**
 * Method: GET
 * Path: /auth/me
 * Description: 현재 사용자 정보 조회
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get("/me", (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "토큰이 제공되지 않았습니다."
            });
        }
        
        const token = authHeader.substring(7);
        const tokenData = verifyJWTStyleToken(token);
        
        if (!tokenData) {
            return res.status(401).json({
                success: false,
                message: "유효하지 않거나 만료된 토큰입니다."
            });
        }
        
        // 사용자 정보 찾기
        const user = users.find(u => u.id === tokenData.payload.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "사용자를 찾을 수 없습니다."
            });
        }
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt
                }
            }
        });
        
    } catch (error) {
        next(error);
    }
});

/**
 * Method: GET
 * Path: /auth/users
 * Description: 모든 사용자 목록 (개발용)
 */
router.get("/users", (req, res) => {
    res.json({
        success: true,
        data: {
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            })),
            activeTokensCount: activeTokens.size
        }
    });
});

export default router;
