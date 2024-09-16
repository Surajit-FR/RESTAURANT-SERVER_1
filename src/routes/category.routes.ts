import express, { Router } from "express";
import { VerifyJWTToken } from "../middlewares/auth/authUser";
import ModelAuth from "../middlewares/auth/modelAuth";
import {
    addCategory,
    deleteCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory
} from "../controllers/category.controller";
import validateCategory from "../models/validators/category.validator";

const router: Router = express.Router();
router.use(VerifyJWTToken); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllCategories)
    .post(
        [ModelAuth(validateCategory)],
        addCategory
    );

router
    .route("/:categoryId")
    .get(getSingleCategory)
    .patch(
        [ModelAuth(validateCategory)],
        updateCategory
    )
    .delete(deleteCategory);

export default router;