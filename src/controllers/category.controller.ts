import { Response } from "express";
import { CustomRequest } from "../../types/commonType";
import { asyncHandler } from "../utils/asyncHandler";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { ApiError } from "../utils/ApiError";
import CategoryModel from "../models/category.model";


// addCategory controller
export const addCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { categoryName, categoryDesc } = req.body;

    const newCategory = await CategoryModel.create({
        categoryName,
        categoryDesc,
    });

    if (!newCategory) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while adding the category"));
    };

    return sendSuccessResponse(res, 201, {}, "Category added successfully");
});

// getSingleCategory controller
export const getSingleCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        return sendErrorResponse(res, new ApiError(400, "Category ID is required."));
    };

    const category = await CategoryModel.findOne({ _id: categoryId, isDelete: false });
    if (!category) {
        return sendErrorResponse(res, new ApiError(404, "Category not found"));
    };
    return sendSuccessResponse(res, 200, category, "Category fetched successfully");
});

// getAllCategories  controller
export const getAllCategories = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { page = "1", limit = "10", query, sortBy = "createdAt", sortType = "desc" } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const validPageNumber = isNaN(pageNumber) || pageNumber <= 0 ? 1 : pageNumber;
    const validLimitNumber = isNaN(limitNumber) || limitNumber <= 0 ? 10 : limitNumber;
    const skip = (validPageNumber - 1) * validLimitNumber;

    const validSortTypes = ["asc", "desc"];
    const sortDirection = validSortTypes.includes(sortType as string) ? sortType : "desc";

    const validSortFields = ["categoryID", "categoryName", "categoryDesc", "createdAt", "updatedAt"];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : "createdAt";

    // Execute the aggregation pipeline
    const results = await CategoryModel.aggregate([
        {
            $match: {
                isDelete: false,
                ...(query && {
                    $or: [
                        { categoryID: { $regex: query as string, $options: "i" } },
                        { categoryName: { $regex: query as string, $options: "i" } },
                        { categoryDesc: { $regex: query as string, $options: "i" } },
                    ]
                }),
            }
        },
        {
            $sort: {
                [sortField]: sortDirection === "asc" ? 1 : -1,
            }
        },
        { $skip: skip },
        { $limit: validLimitNumber },
        {
            $facet: {
                metadata: [{ $count: "totalCategories" }],
                data: [{ $skip: 0 }, { $limit: validLimitNumber }]
            }
        }
    ]);


    const totalCategories = results[0]?.metadata[0]?.totalCategories || 0;
    const categories = results[0]?.data || [];

    const totalPages = Math.ceil(totalCategories / validLimitNumber);

    return sendSuccessResponse(res, 200, {
        categories,
        pagination: {
            totalCategories,
            totalPages,
            currentPage: validPageNumber,
            limit: validLimitNumber,
        }
    }, "Categories retrieved successfully.");
});

// updateCategory controller
export const updateCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { categoryId } = req.params;
    const { categoryName, categoryDesc } = req.body;

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        {
            categoryName,
            categoryDesc,
        }, { new: true });

    if (!updatedCategory) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while updating the category"));
    };

    return sendSuccessResponse(res, 200, {}, "Category updated successfully");
});

// deleteCategory controller
export const deleteCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        return sendErrorResponse(res, new ApiError(400, "Category ID is required."));
    };

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
        return sendErrorResponse(res, new ApiError(404, "Category not found"));
    };
    // Remove the product document from the database
    const deletedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        {
            $set: {
                isDelete: true
            }
        }, { new: true });

    if (!deletedCategory) {
        return sendErrorResponse(res, new ApiError(404, "Category not found deleting."));
    };

    return sendSuccessResponse(res, 200, {}, "Category deleted successfully");
});