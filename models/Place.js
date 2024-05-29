module.exports = (sequelize, DataTypes) => {
	  const Place = sequelize.define('Place', {
		      id: {
			            type: DataTypes.INTEGER,
			            primaryKey: true,
			            autoIncrement: true
			          },
		      address: DataTypes.STRING,
		      photoPath: DataTypes.STRING,
		      name: DataTypes.STRING,
		      description: DataTypes.TEXT
		    });

	Place.associate = (models) => {
		Place.hasMany(models.Comment);
		Place.hasMany(models.Like);
		Place.hasMany(models.Rating);
		Place.belongsToMany(models.Movie, {through: 'MoviePlace'});
	};
	  return Place;
};

