const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PostImage extends Model {}
	PostImage.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		imagePath: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		postId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'posts',
				key: 'id'
			}
		}
	},{
		sequelize,
                modelName: 'PostImage',
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
	});

	return PostImage;
};

