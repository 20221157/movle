const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	  class Bookmark extends Model{}
	  Bookmark.init({
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
		 hooks: {
                        beforeCreate: (bookmark, options) => {
                                const { movieId, placeId } = bookmark;

                                // 영화, 장소, 게시글 중 하나만 값이 있고 나머지는 null이어야 함
                                const nonNullFields = [movieId, placeId].filter(field => field !== null  && field !== undefined);

                                if (nonNullFields.length !== 1) {
                                throw new Error('영화, 장소 중 하나만 값이 있어야 하며, 나머지는 null이어야 합니다.');
				}
                        }
                  },

		  sequelize,
                  modelName: 'bookmark',
                  charset: 'utf8mb4',
                  collate: 'utf8mb4_unicode_ci'
	  });
	  return Bookmark;
};

