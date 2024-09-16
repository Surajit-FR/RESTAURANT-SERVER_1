import { Response } from "express";
import { CustomRequest } from "../../types/commonType";
import ProductModel from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { ApiError } from "../utils/ApiError";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";


// addProduct  controller
export const addProduct = asyncHandler(async (req: CustomRequest, res: Response) => {
    const {
        productTitle,
        offer,
        offerPercentage,
        productDescription,
        price,
        availability,
        visibility,
        category,
        tags,
        sku
    } = req.body;

    // Ensure `req.files` is defined and has the expected structure
    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

    if (!files) {
        return sendErrorResponse(res, new ApiError(400, "No files were uploaded"));
    };

    const coverImage = files.coverImage ? files.coverImage[0] : undefined;
    const productImages = files.productImages ? files.productImages : undefined;

    if (!coverImage) {
        return sendErrorResponse(res, new ApiError(400, "Cover image is required"));
    };

    if (!productImages || productImages.length === 0) {
        return sendErrorResponse(res, new ApiError(400, "At least one product image is required"));
    };

    // Upload cover image to Cloudinary and store the `secure_url`
    const coverImageResponse = await uploadOnCloudinary(coverImage.path);
    const coverImagePath = coverImageResponse?.secure_url;

    if (!coverImagePath) {
        return sendErrorResponse(res, new ApiError(500, "Error uploading cover image"));
    };

    // Upload product images to Cloudinary and store only the `secure_url`
    const productImagesPaths = await Promise.all(productImages.map(async (image) => {
        const imageResponse = await uploadOnCloudinary(image.path);
        const imagePath = imageResponse?.secure_url;
        if (!imagePath) {
            return sendErrorResponse(res, new ApiError(500, `Error uploading product image: ${image.originalname}`));
        }
        return imagePath;
    }));

    // Create a new product with the data and uploaded file paths
    const newProduct = await ProductModel.create({
        productTitle,
        offer,
        offerPercentage,
        productDescription,
        price,
        availability,
        visibility,
        category,
        tags: tags instanceof Array ? tags : [tags],
        sku,
        coverImage: coverImagePath, // Store only the URL of the cover image
        productImages: productImagesPaths, // Store only the URLs of the product images
    });

    if (!newProduct) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while adding the product"));
    };

    return sendSuccessResponse(res, 201, {}, "Product added successfully");
});

// getSingleProduct  controller
export const getSingleProduct = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
        return sendErrorResponse(res, new ApiError(400, "Product ID is required."));
    };

    const product = await ProductModel.findById(productId);
    if (!product) {
        return sendErrorResponse(res, new ApiError(404, "Product not found"));
    };
    return sendSuccessResponse(res, 200, product, "Product fetched successfully");
});

// getAllProducts  controller
export const getAllProducts = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { page = "1", limit = "10", query, sortBy = "createdAt", sortType = "desc" } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const validPageNumber = isNaN(pageNumber) || pageNumber <= 0 ? 1 : pageNumber;
    const validLimitNumber = isNaN(limitNumber) || limitNumber <= 0 ? 10 : limitNumber;
    const skip = (validPageNumber - 1) * validLimitNumber;

    const validSortTypes = ["asc", "desc"];
    const sortDirection = validSortTypes.includes(sortType as string) ? sortType : "desc";

    const validSortFields = ["productTitle", "productDescription", "price", "category", "availability", "createdAt", "updatedAt"];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : "createdAt";

    // Execute the aggregation pipeline
    const results = await ProductModel.aggregate([
        {
            $match: {
                ...(query && {
                    $or: [
                        { productTitle: { $regex: query as string, $options: "i" } },
                        { productDescription: { $regex: query as string, $options: "i" } }
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
                metadata: [{ $count: "totalProducts" }],
                data: [{ $skip: 0 }, { $limit: validLimitNumber }]
            }
        }
    ]);


    const totalProducts = results[0]?.metadata[0]?.totalProducts || 0;
    const products = results[0]?.data || [];

    const totalPages = Math.ceil(totalProducts / validLimitNumber);

    return sendSuccessResponse(res, 200, {
        products,
        pagination: {
            totalProducts,
            totalPages,
            currentPage: validPageNumber,
            limit: validLimitNumber,
        }
    }, "Products retrieved successfully.");
});

// updateProduct  controller
export const updateProduct = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { productId } = req.params;
    const {
        productTitle,
        offer,
        offerPercentage,
        productDescription,
        price,
        availability,
        visibility,
        category,
        tags,
        sku
    } = req.body;

    // Ensure `req.files` is defined and has the expected structure
    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

    if (!files) {
        return sendErrorResponse(res, new ApiError(400, "No files were uploaded"));
    }

    // Find the existing product
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
        return sendErrorResponse(res, new ApiError(404, "Product not found"));
    }

    // Check for new files
    const coverImage = files.coverImage ? files.coverImage[0] : undefined;
    const productImages = files.productImages ? files.productImages : [];

    let coverImagePath = existingProduct.coverImage;
    let productImagesPaths = existingProduct.productImages;

    if (coverImage) {
        const coverImageResponse = await uploadOnCloudinary(coverImage.path);
        coverImagePath = coverImageResponse?.secure_url as string;

        if (!coverImagePath) {
            return sendErrorResponse(res, new ApiError(500, "Error uploading cover image"));
        }
    };

    if (productImages.length > 0) {
        const newProductImagesPaths = await Promise.all(productImages.map(async (image) => {
            const imageResponse = await uploadOnCloudinary(image.path);
            const imagePath = imageResponse?.secure_url;
            if (!imagePath) {
                return sendErrorResponse(res, new ApiError(500, `Error uploading product image: ${image.originalname}`));
            }
            return imagePath;
        }));
        productImagesPaths = [...productImagesPaths, ...newProductImagesPaths] as Array<string>;
    };

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        {
            productTitle,
            offer,
            offerPercentage,
            productDescription,
            price,
            availability,
            visibility,
            category,
            tags: tags instanceof Array ? tags : [tags],
            sku,
            coverImage: coverImagePath,
            productImages: productImagesPaths,
        },
        { new: true }
    );

    if (!updatedProduct) {
        return sendErrorResponse(res, new ApiError(500, "Something went wrong while updating the product"));
    };

    return sendSuccessResponse(res, 200, updatedProduct, "Product updated successfully");
});

// deleteProduct  controller
export const deleteProduct = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
        return sendErrorResponse(res, new ApiError(400, "Product ID is required."));
    };

    const product = await ProductModel.findById(productId);
    if (!product) {
        return sendErrorResponse(res, new ApiError(404, "Product not found"));
    };
    // Delete the coverImage file from Cloudinary
    if (product.coverImage) {
        await deleteFromCloudinary(product.coverImage, "image");
    };

    // Delete each product image from Cloudinary
    if (product.productImages && product.productImages.length > 0) {
        await Promise.all(product.productImages.map(async (imageUrl) => {
            await deleteFromCloudinary(imageUrl, "image");
        }));
    };

    // Remove the product document from the database
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
        return sendErrorResponse(res, new ApiError(404, "Product not found deleting."));
    };

    return sendSuccessResponse(res, 200, {}, "Product deleted successfully");
});