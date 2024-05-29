module.exports = (sequelize, DataTypes) => {
	  const Director = sequelize.define('Director', {
		      id: {
			            type: DataTypes.INTEGER,
			            primaryKey: true,
			            autoIncrement: false
			          },
		      name: DataTypes.STRING,
		  image_path: DataTypes.STRING
		    });

	Director.associate = (models) => {
		Director.belongsToMany(models.Movie, {through: 'MovieDirector'});
	};
	  return Director;
};

