import { Response } from 'express';
import UserModel from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from '../utils/ApiError';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response';
import { CustomRequest } from '../../types/commonType';


// changeCurrentPassword controller
export const changeCurrentPassword = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user?._id);

    if (!user) {
        return sendErrorResponse(res, new ApiError(404, "User not found"));
    };

    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        return sendErrorResponse(res, new ApiError(400, "Invalid old password"));
    };

    user.password = newPassword;
    await user?.save({ validateBeforeSave: false });

    return sendSuccessResponse(res, 200, {}, "Password changed successfully");
});

// getCurrentUser controller
export const getCurrentUser = asyncHandler(async (req: CustomRequest, res: Response) => {
    const user = await UserModel.aggregate([
        {
            $match: { _id: req?.user?._id }
        },
        {
            $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role'
            }
        },
        {
            $unwind: {
                path: '$role',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'permissions',
                localField: 'role.permissions',
                foreignField: '_id',
                as: 'role.permissions'
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                'role._id': 0,
                'role.createdAt': 0,
                'role.updatedAt': 0,
                'role.__v': 0,
                'role.permissions._id': 0,
                'role.permissions.createdAt': 0,
                'role.permissions.updatedAt': 0,
                'role.permissions.__v': 0
            }
        }
    ]);
    return sendSuccessResponse(res, 200, { user: user[0] }, "Current user fetched successfully");
});

// updateAccountDetails controller
export const updateAccountDetails = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        return sendErrorResponse(res, new ApiError(400, "All fields are required"));
    };

    const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password");

    return sendSuccessResponse(res, 200, user, "Account details successfully");
});

// updateTheme controller
export const updateTheme = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { web_theme } = req.body;

    if (!web_theme) {
        return sendErrorResponse(res, new ApiError(400, "All fields are required"));
    };

    const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                web_theme,
            }
        },
        { new: true }
    ).select("-password");

    return sendSuccessResponse(res, 200, user, "Account details successfully");
});