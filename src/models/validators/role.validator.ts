import Joi from 'joi';
import { TRole } from '../../../types/schemaTypes';

const validateRole = (roleModel: TRole) => {
    const RoleSchema = Joi.object({
        name: Joi.string().min(3).max(50).required().messages({
            "string.empty": "Role name is required",
            "string.min": "Role name should be at least 3 characters long",
            "string.max": "Role name should be at most 50 characters long"
        }),
        permissions: Joi.array().items(Joi.string().messages({
            "string.base": "Permission ID must be a valid ObjectId"
        })).optional(),
    }).unknown(true);

    return RoleSchema.validate(roleModel, { abortEarly: false });
};

export default validateRole;
