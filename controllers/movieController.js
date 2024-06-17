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
exports.saveRating = async (req, res) => {
	const { movieId } = req.params; // URL에서 영화 ID 가져오기
	const { rating } = req.body;    // 요청 본문에서 별점 값 가져오기
	const userId = req.user.id;
	console.log(rating);
	try {
		let rating = await Rating.findOne({
        		where: { userId: userId, movieId: movieId }
    		});

    		if (!rating) {
		        // 데이터가 없으면 생성
	        	rating = await db.Rating.create({
		            userId: userId,
	        	    movieId: movieId,
	        	    rating: rating
		        });

        		console.log('별점이 성공적으로 생성되었습니다.');
    		} else {
	        	// 데이터가 있으면 수정
        		rating.rating = rating; // 별점 값 업데이트
        		await rating.save(); // 변경 사항 저장

		        console.log('별점이 성공적으로 수정되었습니다.');
    		}
	} catch (error) {
		console.error('별점 저장 중 오류:', error);
		res.status(500).send('별점 저장 중 오류가 발생했습니다.');
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
     const comments = await db.Comment.findAll({
	     where: {
		     movieId: movieId
	     },
	     order: [['createdAt', 'DESC']],// 최신 댓글부터 정렬
	     include: [{
	     	model: db.User,
	     	attributes: ['nickname'] // 사용자의 닉네임 필드만 가져오도록 설정
	     
     	     }]
     });
	  let hasCommented = false;
	            if (req.user && req.user.id) {
			    const existingComment = await db.Comment.findOne({
			    	where: {
			    		userId: req.user.id,
				        movieId: movieId
		    		}
                             });
                             hasCommented = !!existingComment;
	              } else {
                             hasCommented = true;
                      }
	    let hasLiked = false;

            if (req.user && req.user.id) {
                // 사용자가 로그인한 상태인 경우
                const existingLike = await db.Like.findOne({
                    where: {
                        userId: req.user.id,
                        movieId: movie.id
                    }
                });

                // existingLike이 존재하면 true, 그렇지 않으면 false
                hasLiked = !!existingLike;
            } else {
                // 사용자가 로그인하지 않은 경우
                hasLiked = false;
            }

            let hasBookmark = false;
            if (req.user && req.user.id) {
                // 사용자가 로그인한 상태인 경우
                const existingBookmark = await db.Bookmark.findOne({
                    where: {
                        userId: req.user.id,
                        movieId: movie.id
                    }
                });

                // existingLike이 존재하면 true, 그렇지 않으면 false
                hasBookmark = !!existingBookmark;
            } else {
                // 사용자가 로그인하지 않은 경우
                hasBookmark = false;
            }
	  res.render('movie/detail',{ movie, comments, hasCommented, hasLiked, hasBookmark});
  } catch (error) {
    console.error('Error getting movie details:', error);
    res.status(500).send('Error getting movie details');
  }

}
