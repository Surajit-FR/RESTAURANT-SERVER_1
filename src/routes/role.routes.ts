import express, { Router } from 'express';
import { VerifyJWTToken } from "../middlewares/auth/authUser";
import ModelAuth from "../middlewares/auth/modelAuth";
import { createRole, deleteRole, getAllRoles, getRoleByID, updateRole } from '../controllers/role.controller';
import validateRole from '../models/validators/role.validator';

const router: Router = express.Router();

router.route("/")
    .post([ModelAuth(validateRole)], createRole)
    .get(VerifyJWTToken, getAllRoles);

router.route("/r/:roleId")
    .get(VerifyJWTToken, getRoleByID)
    .patch([VerifyJWTToken, ModelAuth(validateRole)], updateRole)
    .delete(VerifyJWTToken, deleteRole);

export default router;