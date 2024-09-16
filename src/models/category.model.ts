import { Schema, model } from 'mongoose';
import { TCategory } from '../../types/schemaTypes';
import { generateCategoryID } from '../utils/HelperFunctions';

const CategorySchema = new Schema<TCategory>({
    categoryID: {
        type: String,
        unique: true,
        trim: true,
        minlength: [5, 'Category ID must be at least 5 characters long'],
        maxlength: [5, 'Category ID must not exceed 5 characters'],
    },
    categoryName: {
        type: String,
        required: [true, 'Category name is required'],
    },
    categoryDesc: {
        type: String,
        required: [false, 'Category description is optional'],
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Pre-save hook to generate categoryID if not provided
CategorySchema.pre('save', async function (next) {
    if (this.isNew && !this.categoryID) {
        let uniqueID = generateCategoryID();
        // Ensure the generated ID is unique
        while (await Category.findOne({ categoryID: uniqueID })) {
            uniqueID = generateCategoryID();
        }
        this.categoryID = uniqueID;
    }
    next();
});

const Category = model<TCategory>('Category', CategorySchema);
export default Category;