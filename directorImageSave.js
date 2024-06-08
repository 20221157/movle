const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Director } = require('./models'); // 실제 모델의 경로에 맞게 수정해주세요.
const API_KEY = '5105183de844e5c6a95bb931e2e891cd';
// 이미지를 저장할 디렉토리 경로
const imageSaveDir = path.join(__dirname, 'public', 'images', 'directors');

// 디렉토리가 존재하지 않으면 생성
if (!fs.existsSync(imageSaveDir)) {
    fs.mkdirSync(imageSaveDir, { recursive: true });
}

async function fetchDirectorImages() {
    try {
        const directors = await Director.findAll({ attributes: ['name', 'imagePath'] });
        for (const director of directors) {
            const { name, imagePath } = director;
            if (imagePath) {
                try {
                    const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
                    if (searchResponse.data.results.length > 0) {
                        const profilePath = searchResponse.data.results[0].profile_path;
                        if (profilePath) {
                            const imageUrl = `https://image.tmdb.org/t/p/original${profilePath}?api_key=${API_KEY}`;
                            const imageFilename = path.basename(imagePath);
                            const imagePathOnDisk = path.join(imageSaveDir, imageFilename);

                            // 이미지 파일이 이미 존재하는지 확인
                            if (!fs.existsSync(imagePathOnDisk)) {
                                const imageResponse = await axios({
                                    url: imageUrl,
                                    responseType: 'stream'
                                });
                                imageResponse.data.pipe(fs.createWriteStream(imagePathOnDisk));
                                console.log(`Image saved for director '${name}'`);
                            } else {
                                console.log(`Image already exists for director '${name}'`);
                            }
                        }
                    } else {
                        console.log(`No results found for director '${name}'`);
                    }
                } catch (error) {
                    console.error(`Error fetching director '${name}' details:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching directors:', error);
    }
}

// 메인에서 실행
fetchDirectorImages();

