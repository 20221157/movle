const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
	class MovieDirector extends Model {}
	
	MovieDirector.init({
                id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true
                },
		MovieId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'movies',
				key: 'id'
			}
		},
		DirectorId: {
		        type: DataTypes.INTEGER,
		        references: {
			        model: 'directors',
			        key: 'id'
			}
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'MovieDirector',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	});
	return MovieDirector;
};

