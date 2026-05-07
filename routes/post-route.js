import express from "express";

const router = express.Router();

const posts = [
  { id: 1, title: "Hello World 1" },
  { id: 2, title: "Hello World 2" },
  { id: 3, title: "Hello World 3" },
  { id: 4, title: "Hello World 4" },
];

// GET /posts 데이터 조회
router.get("/", (req, res) => {
  res.json(posts);
});

// GET /posts/:id 데이터 조회
router.get("/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((post) => post.id === Number(postId));
  res.json(post);
});

// POST /posts 데이터 생성
// {
//     "id": 5,
//     "title": "Hello World 5"
// }
router.post("/", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT /posts/:id 데이터 수정
// {
//     "id": 3,
//     "title": "Hi World 3"
// }
router.put("/:id", (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;
  posts[Number(postId) - 1] = updatedPost;
  res.json(updatedPost);
});

// DELETE /posts/:id 데이터 삭제
router.delete("/:id", (req, res) => {
  const postId = req.params.id;
  posts.splice(Number(postId) - 1, 1);
  res.status(204).send();
});

export default router;
