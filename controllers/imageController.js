const db = require("../models");
const fs = require('fs');
const path = require('path');

module.exports = {
	uploadImage: async (req, res) => {
	    try {
	        if (!req.files || Object.keys(req.files).length === 0) {
	            return;
	        }

	        const imageFile = req.files.image; // 클라이언트에서 이미지 파일 필드명이 'image'로 전달됨

	        // 이미지를 저장할 디렉토리 경로
	        const uploadDir = path.join(__dirname, '../../public/images/posts');

	        // 만약 디렉토리가 존재하지 않으면 생성
	        if (!fs.existsSync(uploadDir)) {
	            fs.mkdirSync(uploadDir);
	        }

	        // 이미지 파일을 저장할 경로 설정
	        const imagePath = path.join(uploadDir, imageFile.name);

	        // 이미지 파일을 저장
	        imageFile.mv(imagePath, (err) => {
	            if (err) {
	                return res.status(500).send(err);
	            }
	            // 이미지 파일이 정상적으로 저장되었을 때, 해당 파일의 경로를 클라이언트에 응답
	            res.status(200).send();
	        });
	    } catch (error) {
	        console.error(error);
	        res.status(500).send('Internal Server Error');
	    }
	}
}
