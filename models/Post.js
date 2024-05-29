module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define('Post', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		photoPath: {
			type: DataTypes.STRING
		}
	});
	Post.associate = (models) => {
		//Board:Post = 1:n
		Post.belongsTo(models.Board);
		// User:Post = 1:n
		Post.belongsTo(models.User);
		// Post:Comment = 1:n
		Post.hasMany(models.Comment);
		// Post:Like = 1:n
		Post.hasMany(models.Like);
	};

	return Post;
};

