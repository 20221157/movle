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
		  hooks: {
                        beforeCreate: (like, options) => {
                                const { movieId, placeId, postId, commentId } = like;

                                // 영화, 장소, 게시글 중 하나만 값이 있고 나머지는 null이어야 함
                                const nonNullFields = [movieId, placeId, postId, commentId].filter(field => field !== null  && field !== undefined);

                                if (nonNullFields.length !== 1) {
                                throw new Error('영화, 장소, 게시글, 댓글  중 하나만 값이 있어야 하며, 나머지는 null이어야 합니다. 또한 4개 모두 null일 수 없습니다.');
                                }
                        }
                  },
		  sequelize,
                  modelName: 'like',
                  charset: 'utf8mb4',
                  collate: 'utf8mb4_unicode_ci'
	});


	return Like;
};

