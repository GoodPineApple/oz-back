import express from "express";

const router = express.Router();

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jim" },
];

// GET /users 데이터 조회
router.get("/", (req, res) => {
  res.json(users);
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

export default router;
