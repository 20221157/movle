const multer = require('./multerConfig'); // multer 설정 파일 경로

// 업로드 미들웨어
const uploadImage = (req, res, next) => {
  multer(req, res, function(err) {
    if (err instanceof Error) {
      return res.status(400).json({ message: 'Multer error', error: err });
    } else if (err) {
      return res.status(500).json({ message: 'Internal server error', error: err });
    }
    next();
  });
};

module.exports = uploadImage;
