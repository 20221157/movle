const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    class Place extends Model {}

    Place.init({
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        potoPath: {
            type: DataTypes.STRING
        },
	description: {
	    type: DataTypes.TEXT
	},
	name: {
	    type: DataTypes.STRING
	},
	view: {
	    type: DataTypes.INTEGER,
	    defaultValue: 0
	},
	addressId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'addresses',
			key: 'id'
		}
	}
    }, {
        sequelize,
        modelName: 'place',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    return Place;
};

