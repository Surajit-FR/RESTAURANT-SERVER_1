import { Schema, model, Document, ObjectId } from 'mongoose';
import { TRole } from '../../types/schemaTypes';

const RoleSchema = new Schema<TRole>({
    name: {
        type: String,
        required: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'permission'
    }],
}, { timestamps: true });


const Role = model<TRole>('Role', RoleSchema);
export default Role;