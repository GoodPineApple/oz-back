import express from "express";
import redis from "../lib/redis.js";
const router = express.Router();

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jim" },
];

// GET /users 데이터 조회
router.get("/", async (req, res) => {
  // redis에서 users가 있는지 확인
  const usersFromRedis = await redis.get("users");

  // 1. redis에 없으면 users 조회
  // redis에 users 저장
  // users 반환
  if (!usersFromRedis) {
    const usersFromDB = users;
    await redis.set("users", JSON.stringify(usersFromDB));
    res.json(usersFromDB);
  }

  // 2. redis에 있으면
  // redis에서 users 조회
  // users 반환
  if (usersFromRedis) {
    res.json(users);
  }
});

// GET /users/:id 데이터 조회
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find((user) => user.id === Number(userId));
  res.json(user);
});

// POST /users 데이터 생성
// {
//     "id": 4,
//     "name": "taem"
// }
router.post("/", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id 데이터 수정
// {
//     "id": 3,
//     "name": "taem"
// }
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  users[Number(userId) - 1] = updatedUser;
  res.json(updatedUser);
});

// DELETE /users/:id 데이터 삭제
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  users.splice(Number(userId) - 1, 1);
  res.status(204).send();
});

export default router;
