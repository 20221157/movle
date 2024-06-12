const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/posts')); // 이미지가 저장될 폴더 경로
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname); // 고유한 파일 이름 생성
    cb(null, uniqueName); // 콜백으로 파일 이름 전달
  }
});

// Multer 인스턴스 초기화
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // 파일 크기 제한 (1MB)
}).array('images', 4); // HTML 폼에서 업로드할 input 필드의 name 속성

module.exports = upload;

