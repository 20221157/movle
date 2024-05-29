module.exports = (sequelize, DataTypes) => {
	  const Board = sequelize.define('Board', {
		  id: {
			  type: DataTypes.INTEGER,
			  primaryKey: true,
			  autoIncrement: true
		  },
		  name: {
			  type: DataTypes.STRING,
			  allowNull: false
		  }
	  });

	Board.associate = (models) => {
		//Board:Post = 1:n
		Board.hasMany(models.Post);
	};
	  return Board;
};

