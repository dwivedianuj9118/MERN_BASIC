import multer from 'multer'
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
})

const fileFilter = (req, file, cb) => {
    const arr = ['image/jpeg', 'image/jpg', 'image/png'];
    if (arr.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed!'), false);
    }
}

const upload = multer({
     storage: storage,
     limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit 
     fileFilter: fileFilter
});


export default upload;