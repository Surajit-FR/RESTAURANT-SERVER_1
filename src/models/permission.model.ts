import { Schema, model } from 'mongoose';
import { TPermission } from '../../types/schemaTypes';

const PermissionSchema = new Schema<TPermission>({
    name: {
        type: String,
        required: [true, "Permission name is required"]
    },
    description: {
        type: String,
        required: false
    },
}, { timestamps: true });


const Permission = model<TPermission>('Permission', PermissionSchema);
export default Permission;