const CategoryModel = require('../../model/category.model');

// CreateCategory
exports.CreateCategory = async (req, res) => {
    const { category_name, category_desc } = req.body;
    try {

        const NewCategory = new CategoryModel({
            category_name: category_name.trim(),
            category_desc: category_desc.trim(),
        });

        // Generate categoryID based on _id
        const lastFiveChars = NewCategory._id.toString().slice(-5).toUpperCase();
        const categoryID = `#${lastFiveChars}`;
        NewCategory.categoryID = categoryID;

        await NewCategory.save();
        return res.status(201).json({ success: true, message: "New Category Added successfully!" });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// GetAllCategory
exports.GetAllCategory = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Fetch category data with pagination
        const all_category_data = await CategoryModel
            .find({ is_delete: false })
            .skip(skip)
            .limit(limit);

        // Count total number of documents
        const totalCount = await CategoryModel.countDocuments({ is_delete: false });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully!",
            data: all_category_data,
            totalPages: totalPages,
            currentPage: page
        });

    } catch (exc) {
        return res.status(500).json({ success: false, messaage: "Internal server error", error: exc.message });
    }
};
