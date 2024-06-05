const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	  class Like extends Model {}
	  
	  Like.init({
		  id: {
			  type: DataTypes.INTEGER,
			  primaryKey: true,
			  autoIncrement: true
		  },
		  userId: {
			  type: DataTypes.STRING,
			  allowNull: false,
			  references: {
				  model: 'users',
				  key: 'id'
			  }
		  },
		  postId: {
                          type: DataTypes.INTEGER,
                          allowNull: true,
                          references: {
                                  model: 'posts',
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
                                  key: 'id'
			  }
		  },
		  commentId: {
	                  type: DataTypes.INTEGER,
                          allowNull: true,
                          references: {
                                  model: 'comments',
                                  key: 'id'
			  }
		  }
	  },{
		  sequelize,
                  modelName: 'like',
                  charset: 'utf8mb4',
                  collate: 'utf8mb4_unicode_ci'
	  });
	  return Like;
};

