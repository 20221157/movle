const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
	class MovieActor extends Model {}
	
	MovieActor.init({
		MovieId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'movies',
				key: 'id'
			}
		},
		ActorId: {
		        type: DataTypes.INTEGER,
		        references: {
			        model: 'actors',
			        key: 'id'
			}
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'MovieActor',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	});
	return MovieActor;
};

