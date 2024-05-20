const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dirPath =
            (file.fieldname === "productImage") ? "./public/product_images/uploads/" :
                "./public/uploads/";
        cb(null, dirPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const midName = file.originalname.split(".")[0];
        cb(null, midName + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const imageMaxSize = 20 * 1024 * 1024;  // 20 MB

const ImageUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png"
            || file.mimetype === "image/jpg"
            || file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg, .jpeg forma allowed!"));
        }
    },
    limits: {
        fileSize: imageMaxSize
    }
});


module.exports = { ImageUpload };