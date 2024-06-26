// controllers/movieController.js
const db = require('../models');
const { Movie, Place, Address } = require('../models');
const { Op } = require('sequelize');


async function getAverageRating(placeId) {
  try {
    const ratings = await db.Rating.findAll({
      where: {
        placeId: placeId
      },
      attributes: ['rating']
    });

    if (ratings.length === 0) {
      return 0; // 별점이 없으면 0 반환
    }

    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const average = total / ratings.length;

  return Math.round(average);
  } catch (error) {
    console.error('평균 별점 계산 오류:', error);
    throw error;
  }
}





exports.getSelect = async (req, res) => {
    const searchQuery = req.body.name.toLowerCase();

    try {
	const isLogged = req.isAuthenticated();
        let placesByName = await Place.findAll({
            where: {
                name: { [Op.like]: `%${searchQuery}%` }
            }
        });

	let placesByAddress = await Place.findAll({
	    include: [{
		    model: Address,
	       	    where: {
			          [Op.or]: [
					          { city: { [Op.like]: `%${searchQuery}%` } },
					          { district: { [Op.like]: `%${searchQuery}%` } },
					          { road_name: { [Op.like]: `%${searchQuery}%` } },
					          { building_number: { [Op.like]: `%${searchQuery}%` } }
				  ]
	        }
	    }]
	 });

	let movies = await Movie.findAll({
		    where: {
			            title: { [Op.like]: `%${searchQuery}%` }
			        }
	});

	    let movieIds = movies.map(movie => movie.id);

	// 영화 ID를 가지고 있는 장소를 가져옴
	let placesByMovieId = await Place.findAll({
		where: {
	                movieId: { [Op.in]: movieIds }
		}
	});

	let allPlaces = [...placesByName, ...placesByAddress, ...placesByMovieId];
		          
	let placeIds = new Set();
	let uniquePlaces = [];
	for (let place of allPlaces) {
	    if (!placeIds.has(place.id)) {
        	placeIds.add(place.id);
	        uniquePlaces.push(place);
	    }
	}
		// 최종적으로 필요한 데이터 (영화 제목 포함)
	let resultPlaces = await db.Place.findAll({
	    where: {
	        id: Array.from(placeIds)
	    },
	    include: {
	        model: db.Movie,
	        attributes: ['title'] // 영화의 제목만 가져오도록 설정
	    }
	})
	    res.render('place',{places: resultPlaces} );
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getPlaces = async (req, res) => {
  try {
	  const places = await db.Place.findAll({
		  include: {
			  model: db.Movie,
			  attributes: ['title'] // 영화의 제목만 가져오도록 설정
		  }
	  });
    //const places = await db.Place.findAll();
    res.render('place/index', { places });
  } catch (error) {
    console.error('Error getting movies:', error);
    res.status(500).send('Error getting movies');
  }
};

exports.saveRate = async (req, res) => {
	const rating = req.body.rating;
	const placeId = req.params.id;
	try {
		if (req.isAuthenticated()) {
			const userId = req.user.id;
			const [ratingRecord, created] = await db.Rating.findOrCreate({
				where: {
					userId: userId,
					placeId: placeId
				},
				defaults: {
					rating: rating
				}
			});

			if (!created) {
				await db.Rating.update({ rating: rating }, {
					where: {
						[Op.and]: [
							{ userId: userId },
							{ placeId: placeId }
						]
					}
				});
			}
			res.json({ averageRating: rating });
		} else {
			res.status(401).json({ error: '로그인이 필요합니다.' });
		}

	} catch (error) {
		console.error('별점 저장 중 오류:', error);
		res.status(500).json({ error: '별점 저장 중 오류가 발생했습니다.' });
	}

};

exports.getPlaceDetails = async (req, res) => {
  const placeId = req.params.id;
  
  try {
    	const place = await db.Place.findByPk(placeId)
	const movie = await db.Movie.findByPk(place.movieId);
	  const address = await db.Address.findByPk(place.addressId);
	  place.movieTitle = movie ? movie.title : 'Unknown';
	      place.addressDetails = address ? address.full_address : 'Unknown';

	if (movie) {
        // 동일한 영화 제목을 가진 다른 장소들을 가져옵니다.
        const similarPlaces = await db.Place.findAll({
            where: {
	                movieId: movie.id,
                id: { [db.Sequelize.Op.not]: place.id } // 현재 장소를 제외하고 가져옵니다.
            }
        });
	        // 가져온 장소들을 place 객체에 추가합니다.
        place.similarPlaces = similarPlaces;
    }
	  const comments = await db.Comment.findAll({
		              where: {
				                      placeId: place.id
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
				                      placeId: place.id
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
	                placeId: place.id
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
                        placeId: place.id
                    }
                });

                // existingLike이 존재하면 true, 그렇지 않으면 false
                hasBookmark = !!existingBookmark;
            } else {
                // 사용자가 로그인하지 않은 경우
                hasBookmark = false;
            }
	   let  averageRating
	  if (req.user && req.user.id) {
		 let userRating = await db.Rating.findOne({
			 where: {
				 userId: req.user.id,
				 placeId: placeId
			}
		});
		if (userRating) {
			// 사용자가 이미 별점을 입력한 경우
		        averageRating = userRating.rating
                } else {
		        // 사용자가 별점을 입력하지 않은 경우, 평균 별점 계산
		        averageRating = await getAverageRating(placeId);
		} 
	  } else {
		  averageRating = await getAverageRating(placeId);
	  }
	  console.log(averageRating);
	  res.render('place/detail',{ place, comments, hasCommented, hasLiked, hasBookmark, averageRating});
  } catch (error) {
    console.error('Error getting place details:', error);
    res.status(500).send('Error getting place details');
  }
}
