import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";

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
router.get("/", authMiddleware, (req, res) => {
    res.json({
        success: true,
        data: products,
        user: req.user
    });
});

/**
 * Method: POST
 * Path: /products
 * Description: Create a new product
 * Response: 201 Created
 * Body: {}
 */
router.post("/", authMiddleware, (req, res) => {
    const product = req.body;
    productId++;
    product.id = productId;
    product.createdBy = req.user.userId;
    product.createdAt = new Date().toISOString();
    products.push(product);
    res.status(201).json({
        success: true,
        message: "상품이 생성되었습니다.",
        data: product
    });
});

/**
 * Method: PUT
 * Path: /products/:id
 * Description: Update a product
 * Response: 200 OK
 * Body: {}
 */
router.put("/:id", authMiddleware, (req, res) => {
    const userProduct = req.body;
    userProduct.id = Number(req.params.id);
    const index = products.findIndex((product) => product.id === userProduct.id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "상품을 찾을 수 없습니다."
        });
    }
    
    userProduct.updatedBy = req.user.userId;
    userProduct.updatedAt = new Date().toISOString();
    products[index] = { ...products[index], ...userProduct };
    
    res.json({
        success: true,
        message: "상품이 수정되었습니다.",
        data: products[index]
    });
});

/**
 * Method: PATCH
 * Path: /products/:id
 * Description: Update a product
 * Response: 200 OK
 * Body: {}
 */
router.patch("/:id", authMiddleware, (req, res) => {
    const userPatch = req.body;
    const updateId = Number(req.params.id);
    const index = products.findIndex((product) => product.id === updateId);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "상품을 찾을 수 없습니다."
        });
    }
    
    const updatedProduct = { 
        ...products[index], 
        ...userPatch,
        updatedBy: req.user.userId,
        updatedAt: new Date().toISOString()
    };
    products[index] = updatedProduct;
    
    res.json({
        success: true,
        message: "상품이 부분 수정되었습니다.",
        data: updatedProduct
    });
});

/**
 * Method: DELETE
 * Path: /products/:id
 * Description: Delete a product
 * Response: 200 OK
 * Body: {}
 */
router.delete("/:id", authMiddleware, (req, res) => {
    const deleteId = Number(req.params.id);
    const productIndex = products.findIndex((product) => product.id === deleteId);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "삭제할 상품을 찾을 수 없습니다."
        });
    }
    
    const deletedProduct = products[productIndex];
    products = products.filter((product) => product.id !== deleteId);
    
    res.json({
        success: true,
        message: "상품이 삭제되었습니다.",
        data: {
            deletedProduct,
            deletedBy: req.user.userId,
            deletedAt: new Date().toISOString()
        }
    });
});



export default router;