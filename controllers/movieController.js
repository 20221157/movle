// controllers/movieController.js

const db = require('../models');

exports.getMovies = async (req, res) => {
  try {
    const movies = await db.Movie.findAll();

    // 영화 목록을 렌더링할 템플릿에 전달
    res.render('movie/index', { movies });
  } catch (error) {
    console.error('Error getting movies:', error);
    res.status(500).send('Error getting movies');
  }
};

exports.getMovieDetails = async (req, res) => {
  const movieId = req.params.id;
  
  try {
    const movie = await db.Movie.findByPk(movieId, {
      include: [
        {
          model: db.Director,
          as: 'directors', // 감독 정보를 가져올 때 사용할 별칭
          attributes: ['name'] // 가져올 속성 지정
        },
        {
          model: db.Actor,
          as: 'actors', // 배우 정보를 가져올 때 사용할 별칭
          attributes: ['name'] // 가져올 속성 지정
        }
      ]
    });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    // 영화 상세 정보를 렌더링할 템플릿에 전달
    res.render('movie/detail', { movie });
  } catch (error) {
    console.error('Error getting movie details:', error);
    res.status(500).send('Error getting movie details');
  }
}
