// controllers/movieController.js

const db = require('../models');
const { Movie, Director, Actor } = require('../models');
const { Op } = require('sequelize');

exports.getSelect = async (req, res) => {
    const searchQuery = req.body.name.toLowerCase();

    try {
	const isLogged = req.isAuthenticated();
        // 영화 제목으로 검색
        let movies = await Movie.findAll({
            where: {
                title: { [Op.like]: `%${searchQuery}%` }
            }
        });

        if (movies.length === 0) {
            // 감독 이름으로 영화 검색
            const directorMovies = await Movie.findAll({
                include: [{
                    model: Director,
                    where: { name: { [Op.like]: `%${searchQuery}%` } }
                }]
            });

            // 배우 이름으로 영화 검색
            const actorMovies = await Movie.findAll({
                include: [{
                    model: Actor,
                    where: { name: { [Op.like]: `%${searchQuery}%` } }
                }]
            });

            // 중복 제거를 위해 Set 사용
            const allMovies = [...directorMovies, ...actorMovies];
            const movieIds = new Set(allMovies.map(movie => movie.id));
            movies = allMovies.filter(movie => movieIds.has(movie.id));
        }

        if (movies.length > 0) {
            res.render('movie',{ isLogged, movies} );
        } else {
            res.render('movie',{ isLogged, movies: [], message: 'No results found. Please try again.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

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
	  const isLogged = req.isAuthenticated();
    const movie = await db.Movie.findByPk(movieId, {
      include: [
        {
          model: db.Director,
          as: 'directors', // 감독 정보를 가져올 때 사용할 별칭
          attributes: ['name', 'imagePath'] // 가져올 속성 지정
        },
        {
          model: db.Actor,
          as: 'actors', // 배우 정보를 가져올 때 사용할 별칭
          attributes: ['name', 'imagePath'] // 가져올 속성 지정
        },
	{
	  model: db.Genre, // 장르 모델
	  as: 'genres', // 장르 정보를 가져올 때 사용할 별칭
	  attributes: ['name'] // 가져올 속성 지정
	}
      ]
    });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    // 영화 상세 정보를 렌더링할 템플릿에 전달
    res.render('movie/detail',{ isLogged, movie});
  } catch (error) {
    console.error('Error getting movie details:', error);
    res.status(500).send('Error getting movie details');
  }
}
