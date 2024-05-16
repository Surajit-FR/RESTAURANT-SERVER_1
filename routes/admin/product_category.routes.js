const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const ModelAuth = require('../../middleware/auth/model_auth');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const CategoryController = require('../../controller/admin/category.controller');
const ValidateCategory = require('../../model/validator/category.validate');

/**************************************************** PERMISSION ROUTES ****************************************************/
// Add new permission
router.post('/add/new/category', [
    RequestRate.Limiter,
    ModelAuth(ValidateCategory),
    VerifyToken,
    Authorize(["*", "write_create"])
], CategoryController.CreateCategory);

// Get all permission
router.get('/get/all/category', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["*", "read"])
], CategoryController.GetAllCategory);


module.exports = router;