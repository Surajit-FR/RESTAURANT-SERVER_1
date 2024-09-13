import Joi from 'joi';
import { TUser } from '../../../types/schemaTypes';

const validateUser = (userModel: TUser) => {
    const UserSchema = Joi.object({
        fullName: Joi.string().min(3).max(60).required().trim().messages({
            "string.empty": "Full name is required!",
            "string.min": "Minimum length should be 3",
            "string.max": "Maximum length should be 60"
        }),
        email: Joi.string().email().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required().lowercase().trim().messages({
            "string.empty": "Email Address is required",
            "string.email": "Invalid email format",
            "string.pattern.base": "Email must be a valid format"
        }),
        phone: Joi.string().regex(/^\+?[1-9]\d{1,14}$/).optional().messages({
            "string.pattern.base": "Phone number must be a valid international number"
        }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required"
        }),
        web_theme: Joi.string().optional().allow("").default("").messages({
            "string.base": "Web theme should be a string"
        }),
        role: Joi.string().optional().messages({
            "string.base": "Role must be a valid ObjectId"
        }),
        isActive: Joi.boolean().default(false),
        refreshToken: Joi.string().optional().allow("").default(""),
        isDeleted: Joi.boolean().default(false),
    }).unknown(true);

    return UserSchema.validate(userModel, { abortEarly: false });
};

export default validateUser;