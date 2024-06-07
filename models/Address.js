const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    class Address extends Model {}

    Address.init({
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
	city: {
            type: DataTypes.STRING,
	    allowNull: false
        },
	district: {
	    type: DataTypes.STRING,
	    allowNull: false
	},
	town: {
	    type: DataTypes.STRING,
	    allowNull: true
	},
	road_name: {
	    type: DataTypes.STRING,
	    allowNull: false
	},
	building_number: {
	    type: DataTypes.STRING,
	    allowNull: false
	},
	full_address: {
        	type: DataTypes.VIRTUAL,
        	get() {
            		return `${this.city} ${this.district} ${this.town} ${this.road_name} ${this.building_number}`;
        	},
        	set(value) {
            		throw new Error('full_address cannot be set directly');
        	}
    	}
    }, {
        sequelize,
        modelName: 'address',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    return Address;
};

