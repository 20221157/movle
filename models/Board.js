const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
        class Board extends Model {}
	Board.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: 'board',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci'
	});
	return Board;
};

