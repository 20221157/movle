module.exports = (sequelize, DataTypes) => {
	  const Actor = sequelize.define('Actor', {
		      id: {
			            type: DataTypes.INTEGER,
			            primaryKey: true,
			            autoIncrement:false 
			          },
		      name: DataTypes.STRING,
		  image_path: DataTypes.STRING
		    });

	Actor.associate = (models) => {
		Actor.belongsToMany(models.Movie, {through: 'MovieActor'});
	};
	  return Actor;
};

