const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
	class Follow extends Model {}

	Follow.init({
	        id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		followerId: {
			type: DataTypes.STRING,
			references: {
				model: 'users',
				key: 'id',
				name: 'fk_follow_followerId'
			}
		},
		followingId: {
		        type: DataTypes.STRING,
		        references: {
			        model: 'users',
			        key: 'id',
				name: 'fk_follow_followingId'
			}
		},
	}, {
		sequelize,
		modelName: 'follow',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	});


	return Follow;
};
