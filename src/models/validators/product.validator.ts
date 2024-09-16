import Joi from 'joi';
import { TProduct } from '../../../types/schemaTypes';

const validateProduct = (productModel: TProduct) => {
    const ProductSchema = Joi.object({
        productTitle: Joi.string().min(3).max(100).required().messages({
            "string.empty": "Product title is required",
            "string.min": "Product title should be at least 3 characters long",
            "string.max": "Product title should be at most 100 characters long",
        }),
        offer: Joi.string().valid('true', 'false').required().messages({
            "any.only": "Offer must be either 'true' or 'false'",
            "string.empty": "Offer status is required",
        }),
        offerPercentage: Joi.string()
            .when('offer', {
                is: 'true',
                then: Joi.string()
                    .pattern(/^\d+$/)
                    .min(1)
                    .max(3)
                    .custom((value, helpers) => {
                        const num = parseFloat(value);
                        if (num < 0 || num > 100) {
                            return helpers.error('number.outOfRange');
                        }
                        return value;
                    }, 'Offer percentage validation')
                    .messages({
                        "string.empty": "Offer percentage is required when offer is true",
                        "string.pattern.base": "Offer percentage must be a number",
                        "number.outOfRange": "Offer percentage must be between 0 and 100",
                    }),
                otherwise: Joi.forbidden(),
            }),
        productDescription: Joi.string().max(1000).optional().allow("").messages({
            "string.max": "Product description can have at most 1000 characters",
        }),
        price: Joi.string()
            .pattern(/^\d+(\.\d{1,2})?$/)
            .required()
            .messages({
                "string.empty": "Price is required",
                "string.pattern.base": "Price must be a valid number with up to two decimal places",
            }),
        availability: Joi.string().valid('in_stock', 'out_of_stock', 'pre_order').required().messages({
            "any.only": "Availability must be 'in_stock', 'out_of_stock', or 'pre_order'",
            "string.empty": "Availability is required",
        }),
        visibility: Joi.string().valid('public', 'private').required().messages({
            "any.only": "Visibility must be 'public' or 'private'",
            "string.empty": "Visibility is required",
        }),
        category: Joi.string().required().messages({
            "string.empty": "Category is required",
        }),
        tags: Joi.array().items(Joi.string()).optional().messages({
            "array.base": "Tags must be an array of strings",
        }),
        sku: Joi.string().optional().allow("").messages({
            "string.base": "SKU must be a string",
        }),
        isDelete: Joi.boolean().default(false).messages({
            "boolean.base": "Is delete must be a boolean",
        }),
    }).unknown(true); // Allow unknown fields if necessary

    return ProductSchema.validate(productModel, { abortEarly: false });
};

export default validateProduct;