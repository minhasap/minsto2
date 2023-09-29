const multer = require('multer');
const path = require('path');
const express = require('express');


const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/productImages'));
    },
    filename: (req, file, cb) => {
        console.log(file);
        const name = Date.now() + '--' + file.originalname;
        cb(null, name);
    }
});
const maxSize = 10240000;
const upload = multer({
    storage: imageStorage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {

            cb(null, true);

        } else {

            cb(null, false);
            return cb(new Error("only 'png' or 'jpg' or 'jpeg' format allowed!"));

        }
    }
})

module.exports = upload;