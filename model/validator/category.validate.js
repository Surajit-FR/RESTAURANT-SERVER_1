const JOI = require('joi');

module.exports = (RoleModel) => {
    const CategorySchema = JOI.object({
        category_name: JOI.string().required().pattern(/^[a-zA-Z ]+$/).messages({
            "string.empty": "A name is required!",
            "string.pattern.base": "Only alphabets are allowed",
        }),
        category_desc: JOI.string(),
    })

    return CategorySchema.validate(RoleModel);
};