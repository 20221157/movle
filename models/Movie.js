module.exports = (sequelize, DataTypes) => {
	  const Movie = sequelize.define('Movie', {
		      id: {
			            type: DataTypes.INTEGER,
			            primaryKey: true,
			            autoIncrement: true
			          },
		      plot: DataTypes.TEXT,
		      title: DataTypes.STRING,
		      posterPath: DataTypes.STRING,
		      releaseYear: DataTypes.INTEGER
		    });

	Movie.associate = (models) => {
		Movie.hasMany(models.Comment);
		Movie.hasMany(models.Like);
		Movie.hasMany(models.Rating);
		Movie.belongsToMany(models.Place, {through: 'MoviePlace'});		
		Movie.belongsToMany(models.Genre, {through: 'MovieGenre'});
		Movie.belongsToMany(models.Director, {through: 'MovieDirector'});
		Movie.belongsToMany(models.Actor, {through: 'MovieActor'});
	};
	  return Movie;
};

