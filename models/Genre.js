module.exports = (sequelize, DataTypes) => {
	  const Genre = sequelize.define('Genre', {
		      id: {
			            type: DataTypes.INTEGER,
			            primaryKey: true,
			            autoIncrement: true
			          },
		      name: DataTypes.STRING
		    });

	Genre.associate = (models) => {
		Genre.belongsToMany(models.Movie, {through: 'MovieGenre'});
	};
	  return Genre;
};

