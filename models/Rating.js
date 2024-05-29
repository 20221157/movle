module.exports = (sequelize, DataTypes) => {
	  const Rating = sequelize.define('Rating', {
		      id: {
			            type: DataTypes.INTEGER,
			            primaryKey: true,
			            autoIncrement: true
			          },
		      rating: {
			            type: DataTypes.INTEGER,
			            defaultValue: 5,
			            validate: {
					            min: 0,
					            max: 5
					          }
			          }
		    });

	Rating.associate = (models) => {
		Rating.belongsTo(models.Movie);
		Rating.belongsTo(models.Place);
		Rating.belongsTo(models.User);
	};
	  return Rating;
};

