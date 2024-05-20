const { deleteUploadedFile } = require('../../helpers/delete_file');
const ProductModel = require('../../model/product.model');

// CreateProduct
exports.CreateProduct = async (req, res) => {
    const { productTitle, offer, offerPercentage, productDescription, price, availability, visibility, categories } = req.body;

    try {
        // Check if productImage exists in the request body
        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: "A product image is required!" });
        }

        // Remove "public" prefix from file path
        const filePath = req?.file?.path?.replace('public', '');

        const NewProduct = new ProductModel({
            productTitle: productTitle.trim(),
            offer: offer.trim(),
            offerPercentage: offerPercentage.trim(),
            productImage: filePath,
            productDescription: productDescription.trim(),
            price: price.trim(),
            availability: availability.trim(),
            visibility: visibility.trim(),
            categories: categories,
        });

        // Save the product
        await NewProduct.save();
        return res.status(201).json({ success: true, message: "New Product Added successfully!" });

    } catch (exc) {
        // Delete uploaded file if an error occurred during upload
        deleteUploadedFile(req);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};