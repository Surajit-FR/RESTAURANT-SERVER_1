import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import PermissionModel from "../models/permission.model";
import { TPermission } from "../../types/schemaTypes";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { ApiError } from "../utils/ApiError";


// addPermission controller
export const addPermission = asyncHandler(async (req: Request, res: Response) => {
    const { name, description }: TPermission = req.body;
    const updatedName = name.toLowerCase().trim();
    const existingName = await PermissionModel.findOne({ name: updatedName });

    if (existingName) {
        return sendErrorResponse(res, new ApiError(409, "Permission name already exists"));
    };

    // Create new permission
    const newPermission = new PermissionModel({ name, description });
    const createdPermission = await newPermission.save();

    if (!createdPermission) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while creating new permission"));
    };
    return sendSuccessResponse(res, 201, createdPermission, "Permission created Successfully");
});

// getAllPermissions controller
export const getAllPermissions = asyncHandler(async (req: Request, res: Response) => {
    const allPermission = await PermissionModel.find({});
    if (!allPermission) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while fetching the permissions"));
    };
    return sendSuccessResponse(res, 200, allPermission, "Permissions fetched successfully");
});

// updatePermission controller
export const updatePermission = asyncHandler(async (req: Request, res: Response) => {
    const { name, description }: TPermission = req.body;
    const { permissionId } = req.params;

    const updatedPermission = await PermissionModel.findByIdAndUpdate(
        permissionId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    );

    return sendSuccessResponse(res, 200, updatedPermission, "Permission updated successfully");
});

// deletePermission controller
export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
    const { permissionId } = req.params;
    if (!permissionId) {
        return sendErrorResponse(res, new ApiError(400, "Permission ID is required."));
    };

    const deletedPermission = await PermissionModel.findByIdAndDelete(permissionId);
    if (!deletedPermission) {
        return sendErrorResponse(res, new ApiError(404, "Permission not found for deleting."));
    };

    return sendSuccessResponse(res, 200, {}, "Permission deleted successfully");
});