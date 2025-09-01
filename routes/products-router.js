import express from "express";

const router = express.Router();

let productId = 1;
let products = [
    {
        id: 1,
        name: "Product 1",
        price: 100
    }
]

/**
 * Method: GET
 * Path: /products
 * Description: Get all products
 * Response: 200 OK
 * Body: {}
 */
router.get("/", (req, res) => {
    console.log(`${req.method} ${req.baseUrl}${req.path}`);
    res.json(products);
});

/**
 * Method: POST
 * Path: /products
 * Description: Create a new product
 * Response: 201 Created
 * Body: {}
 */
router.post("/", (req, res) => {
    console.log(`${req.method} ${req.baseUrl}${req.path}`);
    const product = req.body;
    productId++;
    product.id = productId;
    products.push(product);
    res.status(201).json(product);
});

/**
 * Method: PUT
 * Path: /products/:id
 * Description: Update a product
 * Response: 200 OK
 * Body: {}
 */
router.put("/:id", (req, res) => {
    console.log(`${req.method} ${req.baseUrl}${req.path}`);
    const userProduct = req.body;
    userProduct.id = Number(req.params.id);
    const index = products.findIndex((product) => product.id === userProduct.id);
    products[index] = userProduct;
    res.json(userProduct);
});

/**
 * Method: PATCH
 * Path: /products/:id
 * Description: Update a product
 * Response: 200 OK
 * Body: {}
 */
router.patch("/:id", (req, res) => {
    console.log(`${req.method} ${req.baseUrl}${req.path}`);
    const userPatch = req.body;
    const updateId = Number(req.params.id);
    const index = products.findIndex((product) => product.id === updateId);
    const updatedProduct = { ...products[index], ...userPatch };
    products[index] = updatedProduct;
    res.json(updatedProduct);
});

/**
 * Method: DELETE
 * Path: /products/:id
 * Description: Delete a product
 * Response: 200 OK
 * Body: {}
 */
router.delete("/:id", (req, res) => {
    console.log(`${req.method} ${req.baseUrl}${req.path}`);
    const deleteId = Number(req.params.id);
    products = products.filter((product) => product.id !== deleteId);
    res.json({ message: "Product deleted successfully" });
});



export default router;