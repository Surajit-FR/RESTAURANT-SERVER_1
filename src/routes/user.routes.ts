import express, { Router } from "express";
import { VerifyJWTToken } from "../middlewares/auth/authUser";
import {
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateTheme,
} from "../controllers/user.controller";

const router: Router = express.Router();
router.use(VerifyJWTToken); // Apply VerifyJWTToken middleware to all routes in this file


/***************************** secured routes *****************************/
router.route('/change-password')
    .post(changeCurrentPassword);

router.route('/current-user')
    .get(getCurrentUser);

router.route('/update-account')
    .patch(updateAccountDetails);

router.route('/update-theme')
    .patch(updateTheme);

export default router;