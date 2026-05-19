import express from "express";
import { getCache, setCache } from "../lib/redis.js";
const router = express.Router();

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jim" },
];

// GET /users 데이터 조회
router.get("/", async (req, res) => {
  // redis에서 users가 있는지 확인
  const usersCache = await getCache("users");
  if (usersCache) {
    // redis에 있으면 캐싱한 값으로 반환
    return res.json(users);
  }
  // redis에 없으면 DB에서 조회 후 반환
  const usersFromDB = users;
  await setCache("users", JSON.stringify(usersFromDB), 60);
  res.json(usersFromDB);
});

// GET /users/:id 데이터 조회
router.get("/:id", async (req, res) => {
  const userCache = await getCache(`users:${req.params.id}`);
  if (userCache) {
    return res.json(userCache);
  }
  const userId = req.params.id;
  const user = users.find((user) => user.id === Number(userId));
  await setCache(`users:${req.params.id}`, JSON.stringify(user), 60);
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
