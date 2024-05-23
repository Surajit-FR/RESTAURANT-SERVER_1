const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const ModelAuth = require('../../middleware/auth/model_auth');
const { ImageUpload } = require('../../helpers/media_config');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const CategoryController = require('../../controller/admin/category.controller');
const ProductController = require('../../controller/admin/product.controller');
const ValidateCategory = require('../../model/validator/category.validate');
const ValidateProduct = require('../../model/validator/product.validate');

/**************************************************** CATEGORY ROUTES ****************************************************/
// Add new category
router.post('/add/new/category', [
    RequestRate.Limiter,
    ModelAuth(ValidateCategory),
    VerifyToken,
    Authorize(["*", "write_create"])
], CategoryController.CreateCategory);

// Get all category
router.get('/get/all/category', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["*", "read"])
], CategoryController.GetAllCategory);

// Update category
router.post('/update/category/:category_id', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateCategory),
    Authorize(["*", "delete"])
], CategoryController.UpdateCategory);

// Delete category
router.delete('/delete/category/:category_id', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["*", "delete"])
], CategoryController.DeleteCategory);

/**************************************************** PRODUCT ROUTES ****************************************************/
// Add new product
router.post('/add/new/product', [
    RequestRate.Limiter,
    ImageUpload.single('productImage'),
    ModelAuth(ValidateProduct),
    VerifyToken,
    Authorize(["*", "write_create"])
], ProductController.CreateProduct);

// Get all product
router.get('/get/all/product', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["*", "read"])
], ProductController.GetAllProduct);

// Get all product
router.get('/get/product/details/:product_id', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["*", "read"])
], ProductController.GetProductDetails);

// Update product
router.post('/update/product/:product_id', [
    RequestRate.Limiter,
    ImageUpload.single('productImage'),
    ModelAuth(ValidateProduct),
    VerifyToken,
    Authorize(["*", "edit_update"])
], ProductController.UpdateProduct);

// Delete product
router.delete('/delete/product/:product_id', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["*", "delete"])
], ProductController.DeleteProduct);


module.exports = router;