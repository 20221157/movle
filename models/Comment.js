const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {}
	
	Comment.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false
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
		modelName: 'comment',
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci',
	});
	return Comment;
}



