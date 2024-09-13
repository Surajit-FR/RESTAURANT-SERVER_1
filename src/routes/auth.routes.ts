import express, { Router } from "express";
import ModelAuth from "../middlewares/auth/modelAuth";
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
} from "../controllers/auth.controller";
import { VerifyJWTToken } from "../middlewares/auth/authUser";
import validateUser from "../models/validators/user.validator";

const router: Router = express.Router();

router.route('/signup')
    .post([ModelAuth(validateUser)], registerUser);

router.route('/signin')
    .post(loginUser);


/***************************** secured routes *****************************/
router.route('/logout')
    .post([VerifyJWTToken], logoutUser);

router.route('/refresh-token')
    .post(refreshAccessToken)

export default router;