import express, { Router } from 'express';
import { VerifyJWTToken } from "../middlewares/auth/authUser";
import ModelAuth from "../middlewares/auth/modelAuth";
import {
    addPermission,
    deletePermission,
    getAllPermissions,
    updatePermission
} from '../controllers/permission.controller';
import validatePermission from '../models/validators/permission.validator';

const router: Router = express.Router();

router.route("/")
    .post([ModelAuth(validatePermission)], addPermission)
    .get(VerifyJWTToken, getAllPermissions);

router.route("/p/:permissionId")
    .patch([VerifyJWTToken, ModelAuth(validatePermission)], updatePermission)
    .delete(VerifyJWTToken, deletePermission);

export default router;