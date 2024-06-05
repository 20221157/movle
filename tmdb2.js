const axios = require('axios');
const fs = require('fs');
const path = require('path');
const transliterate = require('transliterate'); // Make sure 'transliterate' module is installed
 const { Movie, Director, Actor, Genre } = require('./models');
let page = 1;

const apiKey = '5105183de844e5c6a95bb931e2e891cd';

async function fetchMovieDetails(movieId) {
    const apiKey = '5105183de844e5c6a95bb931e2e891cd';
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=ko-KR`;

    try {
        // Fetch movie details
        const movieResponse = await axios.get(movieUrl);
        const movieData = movieResponse.data;

        // Fetch credits (directors and cast)
        const creditsResponse = await axios.get(creditsUrl);
        const creditsData = creditsResponse.data;

        // Combine movie details and credits data
        const movieDetails = {
            ...movieData,
            credits: creditsData
        };

        return movieDetails;
    } catch (error) {
        console.error('Failed to fetch movie details:', error);
        throw error;
    }
}



async function fetchMovies(pageNumber) {
  try {
	const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
    params: {
        api_key: '5105183de844e5c6a95bb931e2e891cd',
        language: 'ko-KR',
        page: page
    }
});
    return response.data.results;
  } catch (error) {
    console.error('tmdb API 요청 오류:', error);
    throw error;
  }
}

// 이미지 저장 경로
const MOVIE_IMAGES_PATH = path.join(__dirname, 'public', 'images', 'movies');
const DIRECTOR_IMAGES_PATH = path.join(__dirname, 'public', 'images', 'directors');
const ACTOR_IMAGES_PATH = path.join(__dirname, 'public', 'images', 'actors');

async function saveImage(imageUrl, type, name) {
    const imageName = transliterate(name) + '.jpg'; // 파일명에 특수 문자가 없도록 변환
    const imagePath = path.join(MOVIE_IMAGES_PATH, imageName);

    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            resolve(imagePath);
        });
        writer.on('error', (err) => {
            reject(err);
        });
    });
}



async function saveMovieImage(movieTitle, imageUrl) {
  const imageName = movieTitle + '.jpg';
  const imagePath = path.join(MOVIE_IMAGES_PATH, imageName);

  const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
  const imageStream = imageResponse.data.pipe(fs.createWriteStream(path.join(imagePath, imageName)));

  return new Promise((resolve, reject) => {
    imageStream.on('finish', () => {
      resolve(imagePath);
    });
    imageStream.on('error', (err) => {
      reject(err);
    });
  });
}

async function savePersonImage(name, imageUrl, type) {
  const imageName = name + '.jpg';
  const imagePath = type === 'director' ? DIRECTOR_IMAGES_PATH : ACTOR_IMAGES_PATH;

  const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
  const imageStream = imageResponse.data.pipe(fs.createWriteStream(path.join(imagePath, imageName)));

  return new Promise((resolve, reject) => {
    imageStream.on('finish', () => {
      resolve(imagePath);
    });
    imageStream.on('error', (err) => {
      reject(err);
    });
  });
}

async function saveMovieDetailsToDatabase(movieId) {
    try {
        const movieDetails = await fetchMovieDetails(movieId);
//	const posterImagePath = await saveImage(movieDetails.poster_path, 'movies', movieDetails.title);

        // 영화 정보 저장
        const movie = await Movie.create({
            title: movieDetails.title,
            plot: movieDetails.overview,
            imagePath:movieDetails.poster_path
        });

        // 장르 정보 저장
        for (const genreData of movieDetails.genres) {
          let genre = await Genre.findOne({ where: { name: genreData.name } });

            // 장르가 존재하지 않는다면 추가
            if (!genre) {
                genre = await Genre.create({ name: genreData.name });
            }
            await movie.addGenre(genre);
        }

        // 감독 정보 저장
        for (const crewMember of movieDetails.credits.crew) {
            if (crewMember.job === 'Director') {
                const [director] = await Director.findOrCreate({ where: { name: crewMember.name } });

                // 감독 이미지 저장
//                const directorImagePath = await saveImage(crewMember.profile_path, 'directors', `${crewMember.name}.jpg`);

                // 감독 정보에 이미지 경로 저장
//                director.imagePath = directorImagePath;
//                await director.save();

                await movie.addDirector(director);
            }
        }

        // 주요 배우 정보 저장
        const actors = movieDetails.credits.cast.slice(0, 5); // 상위 5명의 주요 배우만 추출
        for (const actorData of actors) {
            const [actor] = await Actor.findOrCreate({ where: { name: actorData.name } });

            // 배우 이미지 저장
  //          const actorImagePath = await saveImage(actorData.profile_path, 'actors', `${actorData.name}.jpg`);

            // 배우 정보에 이미지 경로 저장
  //          actor.imagePath = actorImagePath;
    //        await actor.save();

            await movie.addActor(actor);
        }

        console.log('영화 정보가 데이터베이스에 저장되었습니다:', movie.toJSON());
        return movie;
    } catch (error) {
        console.error('영화 정보 저장 오류:', error);
        throw error;
    }
}



async function main() {
const { sequelize } = require('./models'); // 또는 'const sequelize = require('./db');'에 따라 프로젝트 구조에 따라 다를 수 있습니다.

  try {
    await sequelize.sync(); // 데이터베이스 연결 및 동기화

    for (page = 1; page <= 5; page++) {
      const movies = await fetchMovies(page);
      for (const movieData of movies) {
	      const movieDetails = await fetchMovieDetails(movieData.id);
	                      console.log('movieDetails:', movieDetails);
        await saveMovieDetailsToDatabase(movieData.id);
      }
    }
    console.log('영화 정보 저장이 완료되었습니다.');
  } catch (error) {
    console.error('메인 함수 오류:', error);
  }
}

main();

