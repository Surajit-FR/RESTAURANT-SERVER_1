import Joi from 'joi';
import { TPermission } from '../../../types/schemaTypes';

const validatePermission = (permissionModel: TPermission) => {
    const PermissionSchema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            "string.empty": "Permission name is required",
            "string.min": "Permission name should be at least 3 characters long",
            "string.max": "Permission name should be at most 100 characters long"
        }),
        description: Joi.string().optional().allow("").messages({
            "string.base": "Description should be a string"
        }),
    }).unknown(true);

    return PermissionSchema.validate(permissionModel, { abortEarly: false });
};

export default validatePermission;