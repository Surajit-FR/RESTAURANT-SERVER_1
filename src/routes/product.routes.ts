import express, { Router } from "express";
import { VerifyJWTToken } from "../middlewares/auth/authUser";
import { upload } from "../middlewares/multer.middleware";
import ModelAuth from "../middlewares/auth/modelAuth";
import {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct
} from "../controllers/product.controller";
import validateProduct from "../models/validators/product.validator";

const router: Router = express.Router();
router.use(VerifyJWTToken); // Apply verifyJWT middleware to all routes in this file

router.route("/")
    .get(getAllProducts)
    .post(
        upload.fields([
            { name: "coverImage" },
            { name: "productImages" },
        ]),
        [ModelAuth(validateProduct)],
        addProduct
    );

router.route("/:productId")
    .get(getSingleProduct)
    .patch(
        upload.fields([
            { name: "coverImage" },
            { name: "productImages" }
        ]),
        [ModelAuth(validateProduct)],
        updateProduct
    )
    .delete(deleteProduct);

export default router;