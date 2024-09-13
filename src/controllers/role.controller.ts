import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import RoleModel from "../models/role.model";
import { TRole } from "../../types/schemaTypes";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { ApiError } from "../utils/ApiError";


// createRole controller
export const createRole = asyncHandler(async (req: Request, res: Response) => {
    const { name, permissions }: TRole = req.body;
    const updatedName = name.toLowerCase().trim();
    const existingName = await RoleModel.findOne({ name: updatedName });

    if (existingName) {
        return sendErrorResponse(res, new ApiError(409, "Role name already exists"));
    };

    const newRole = new RoleModel({ name, permissions });
    const createdRole = await newRole.save();

    if (!createdRole) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while creating new role"));
    };
    return sendSuccessResponse(res, 201, createdRole, "Role created Successfully");
});

// getAllRoles controller
export const getAllRoles = asyncHandler(async (req: Request, res: Response) => {
    const allRole = await RoleModel.find({});
    if (!allRole) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while fetching the roles"));
    };
    return sendSuccessResponse(res, 200, allRole, "Roles fetched successfully");
});

// getRoleByID controller
export const getRoleByID = asyncHandler(async (req: Request, res: Response) => {
    const { roleId } = req.params;
    if (!roleId) {
        return sendErrorResponse(res, new ApiError(400, "Role ID is required."));
    };

    const role = await RoleModel.findById(roleId);
    if (!role) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while fetching the roles"));
    };
    return sendSuccessResponse(res, 200, role, "Role fetched successfully");
});

// updateRole controller
export const updateRole = asyncHandler(async (req: Request, res: Response) => {
    const { name, permissions }: TRole = req.body;
    const { roleId } = req.params;

    const updatedRole = await RoleModel.findByIdAndUpdate(
        roleId,
        {
            $set: {
                name,
                permissions
            }
        },
        { new: true }
    );

    return sendSuccessResponse(res, 200, updatedRole, "Role updated successfully");
});

// deleteRole controller
export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const { roleId } = req.params;
    if (!roleId) {
        return sendErrorResponse(res, new ApiError(400, "Role ID is required."));
    };

    const deletedRole = await RoleModel.findByIdAndDelete(roleId);
    if (!deletedRole) {
        return sendErrorResponse(res, new ApiError(404, "Role not found for deleting."));
    };

    return sendSuccessResponse(res, 200, {}, "Role deleted successfully");
});