const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	  class Rating extends Model{}
	  Rating.init({
		  id: {
			  type: DataTypes.INTEGER,
			  primaryKey: true,
			  autoIncrement: true
		  },
		  rating: {
			  type: DataTypes.INTEGER,
			  defaultValue: 5,
			  validate: {
				  min: 0,
				  max: 5
			  }
		  },
		  userId: {
			  type: DataTypes.STRING,
			  allowNull: false,
			  references: {
				  model: 'users',
				  key: 'id'
			  }
		  },
		  movieId: {
			  type: DataTypes.INTEGER,
			  allowNull: true,
			  references: {
				  model: 'movies',
				  key: 'id'
			  }
		  },
		  placeId: {
			  type: DataTypes.INTEGER,
			  allowNull: true,
			  references: {
				  model: 'places',
				  kew: 'id'
			  }
		  }
	  },{
		  sequelize,
                  modelName: 'rating',
                  charset: 'utf8mb4',
                  collate: 'utf8mb4_unicode_ci'
	  });
	  return Rating;
};

