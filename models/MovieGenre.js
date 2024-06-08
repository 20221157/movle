const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
	class MovieGenre extends Model {}
	
	MovieGenre.init({
                id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true
                },
		movieId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'movies',
				key: 'id'
			}
		},
		genreId: {
		        type: DataTypes.INTEGER,
		        references: {
			        model: 'genres',
			        key: 'id'
			}
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'MovieGenre',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	});
	return MovieGenre;
};

