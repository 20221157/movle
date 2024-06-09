const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    class Address extends Model {}

    Address.init({
        id: {
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
	road_name: {
	    type: DataTypes.STRING,
	    allowNull: false
	},
	building_number: {
	    type: DataTypes.STRING,
	    allowNull: true
	},
	full_address: {
        	type: DataTypes.VIRTUAL,
        	get() {
			const parts = [];
		        if (this.city) parts.push(this.city);
		        if (this.district) parts.push(this.district);
		        if (this.road_name) parts.push(this.road_name);
		        if (this.building_number !== null) { //널 값인 경우에만 해당 필드를 추가하지 않음
				parts.push(this.building_number);
			}
			return parts.join(' ');
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

