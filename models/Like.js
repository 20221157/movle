module.exports = (sequelize, DataTypes) => {
	  const Like = sequelize.define('Like', {
		      id: {
			            type: DataTypes.INTEGER,
			            primaryKey: true,
			            autoIncrement: true
			          }
		    });
	Like.associate = (models) => {
		Like.belongsTo(models.User);
		Like.belongsTo(models.Post, {
			foreignKey: {
				allowNull: true
			}
		});
		Like.belongsTo(models.Comment, {
			foreignKey: {
				allowNull: true
			}
		});
		Like.belongsTo(models.Movie, {
			foreignKey: {
				allowNull: true
			}
		});
		Like.belongsTo(models.Place, {
			foreignKey: {
				allowNull: true
			}
		});
	};

	  return Like;
};

