// ModelAuth middleware
module.exports = (validator) => {
    return (req, res, next) => {
        const { error, value } = validator(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error?.details[0]?.message, key: error?.details[0]?.path[0] });
        }

        next();
    };
};