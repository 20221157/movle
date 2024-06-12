const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {}
	Post.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		boardId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'boards',
				key: 'id'
			}
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		}
	},{
		sequelize,
                modelName: 'post',
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
	});

	return Post;
};

