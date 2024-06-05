const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
	class MoviePlace extends Model {}
	
	MoviePlace.init({
		movieId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'movies',
				key: 'id'
			}
		},
		placeId: {
		        type: DataTypes.INTEGER,
		        references: {
			        model: 'places',
			        key: 'id'
			}
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'MoviePlace',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	});
	return MoviePlace;
};

