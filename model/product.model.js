const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productTitle: { type: String, required: true },
    offer: { type: String, required: true, enum: ['true', 'false'] },
    offerPercentage: { type: String, required: false },
    productImage: { type: String, required: true },
    productDescription: { type: String, required: false },
    price: { type: String, required: true },
    availability: { type: String, required: true },
    visibility: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'category' }],
    is_delete: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('product', ProductSchema);
