const JOI = require('joi');

module.exports = (CategoryModel) => {
    const CategorySchema = JOI.object({
        category_name: JOI.string().required().pattern(/^[a-zA-Z ]+$/).messages({
            "string.empty": "A name is required!",
            "string.pattern.base": "Only alphabets are allowed",
        }),
        category_desc: JOI.allow("").optional(),
    })

    return CategorySchema.validate(CategoryModel);
};