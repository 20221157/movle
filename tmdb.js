const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const db = require('./models');

const TMDB_API_KEY = '5105183de844e5c6a95bb931e2e891cd';

async function fetchFromTmdb(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from TMDB:', error);
    }
    return null;
}

// 영화 정보 가져오기
async function getMovieDetails(movieTitle, apiKey) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}&language=ko-KR`;
    const searchData = await fetchFromTmdb(searchUrl);
    if (searchData && searchData.results && searchData.results.length > 0) {
        const movieId = searchData.results[0].id;
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits&language=ko-KR`;
        return fetchFromTmdb(detailsUrl);
    }
    return null;
}

// 이미지 다운로드 및 저장
async function downloadImage(url, savePath) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
        });
        response.data.pipe(fs.createWriteStream(savePath));
        return new Promise((resolve, reject) => {
            response.data.on('end', () => resolve());
            response.data.on('error', (err) => reject(err));
        });
    } catch (error) {
        console.error('Error downloading image:', error);
    }
}

// 데이터베이스에 저장
async function saveMovieDetails(movieDetails) {
    const { title, overview: plot, poster_path: imagePath, genres, credits } = movieDetails;
    const posterFilename = `${imagePath.split('/').pop()}`;
    const posterSavePath = path.join(__dirname, 'public', 'images', 'movies', posterFilename);

    // 포스터 이미지 저장
    const posterUrl = `https://image.tmdb.org/t/p/original${imagePath}`;
    await downloadImage(posterUrl, posterSavePath);

    // 영화 저장
    const [movie, created] = await db.Movie.findOrCreate({
        where: { title },
        defaults: { plot, imagePath: posterFilename }
    });

    // 장르 저장 및 관계 설정
    for (const genre of genres) {
        const [genreRecord] = await db.Genre.findOrCreate({ where: { name: genre.name } });
        await movie.addGenre(genreRecord);
    }

    // 감독 저장 및 관계 설정
    const directors = credits.crew.filter(crew => crew.job === 'Director');
    for (const director of directors) {
        const profileFilename = director.profile_path ? `${director.profile_path.split('/').pop()}` : null;
        const profileSavePath = profileFilename ? path.join(__dirname, 'public', 'images', 'directors', profileFilename) : null;
        if (profileSavePath) {
            const profileUrl = `https://image.tmdb.org/t/p/original${director.profile_path}`;
            await downloadImage(profileUrl, profileSavePath);
        }

        const [directorRecord] = await db.Director.findOrCreate({
            where: { name: director.name },
            defaults: { imagePath: profileFilename }
        });
        await movie.addDirector(directorRecord);


    }

    // 배우 저장 및 관계 설정 (최대 5명)
    const actors = credits.cast.slice(0, 5);
    for (const actor of actors) {
        const profileFilename = actor.profile_path ? `${actor.profile_path.split('/').pop()}` : null;
        const profileSavePath = profileFilename ? path.join(__dirname, 'public', 'images', 'actors', profileFilename) : null;
        if (profileSavePath) {
            const profileUrl = `https://image.tmdb.org/t/p/original${actor.profile_path}`;
            await downloadImage(profileUrl, profileSavePath);
        }

        const [actorRecord] = await db.Actor.findOrCreate({
            where: { name: actor.name },
            defaults: { imagePath: profileFilename }
        });
        await movie.addActor(actorRecord);
    }
}

// 메인 함수
async function main(movieTitle) {

    const movieDetails = await getMovieDetails(movieTitle, TMDB_API_KEY);
    if (movieDetails) {
        await saveMovieDetails(movieDetails);
        console.log(`Movie details for '${movieTitle}' have been saved.`);
    } else {
        console.log('Movie details could not be retrieved.');
    }
}

// 사용
main('킹덤') //영화 제목을 여기에 입력하세요
