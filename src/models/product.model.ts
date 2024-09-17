import { Schema, model } from 'mongoose';
import { TProduct } from '../../types/schemaTypes';

const ProductSchema = new Schema<TProduct>({
    productTitle: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Product title must be at least 3 characters long'],
        maxlength: [100, 'Product title must not exceed 100 characters'],
    },
    offer: {
        type: String,
        required: true,
        enum: ['true', 'false'],
    },
    offerPercentage: {
        type: String,
        required: function () {
            return this.offer === 'true'; // Only required if offer is true
        },
        validate: {
            validator: function (value: string) {
                const num = Number(value);
                return num >= 0 && num <= 100;
            },
            message: 'Offer percentage must be between 0 and 100',
        },
    },
    coverImage: {
        type: String,
        required: true,
    },
    productImages: [{
        type: String,
        required: true,
    }],
    productDescription: {
        type: String,
        required: false,
        maxlength: [1000, 'Description must not exceed 1000 characters'],
    },
    price: {
        type: String,
        required: true,
        validate: {
            validator: function (value: string) {
                return !isNaN(parseFloat(value)) && parseFloat(value) > 0;
            },
            message: 'Price must be a valid number greater than 0',
        },
    },
    availability: {
        type: String,
        required: true,
        enum: ['in_stock', 'out_of_stock', 'pre_order'],
    },
    visibility: {
        type: String,
        required: true,
        enum: ['public', 'private'],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    tags: [{
        type: String,
    }],
    sku: {
        type: String,
        unique: true,
        sparse: true, // SKU can be optional, but must be unique if present
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Product = model<TProduct>('Product', ProductSchema);
export default Product;