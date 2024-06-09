// controllers/movieController.js
const db = require('../models');
const { Movie, Place, Address } = require('../models');
const { Op } = require('sequelize');

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

exports.getPlaceDetails = async (req, res) => {
  const placeId = req.params.id;
  
  try {
	  const isLogged = req.isAuthenticated();
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
	  res.render('place/detail',{ isLogged, place});
  } catch (error) {
    console.error('Error getting place details:', error);
    res.status(500).send('Error getting place details');
  }
}
