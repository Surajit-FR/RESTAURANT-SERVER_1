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
    return sendSuccessResponse(res, 200, { user: req.user }, "Current user fetched successfully");
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