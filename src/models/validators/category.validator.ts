import Joi from 'joi';
import { TCategory } from '../../../types/schemaTypes';

const validateCategory = (categoryModel: TCategory) => {
    const CategorySchema = Joi.object({
        categoryName: Joi.string().min(3).max(50).required().messages({
            "string.empty": "Category name is required",
            "string.min": "Category name should be at least 3 characters long",
            "string.max": "Category name should be at most 50 characters long"
        }),
        isDelete: Joi.boolean().default(false).messages({
            "boolean.base": "isDelete must be a boolean"
        })
    }).unknown(true);

    return CategorySchema.validate(categoryModel, { abortEarly: false });
};

export default validateCategory;