const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },

    filename(req, file, cb) {
        cb(
            null,
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1e9
            ) +
            path.extname(
                file.originalname
            )
        );
    },
});

const fileFilter = (
    req,
    file,
    cb
) => {
    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, PNG, JPG and JPEG are allowed"
            )
        );
    }
};

module.exports = multer({
    storage,
    fileFilter,

    limits: {
        fileSize:
            10 * 1024 * 1024,
    },
});