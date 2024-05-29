module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define('Comment', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	});

	Comment.associate = (models) => {
		//User:Comment = 1:n
		Comment.belongsTo(models.User);
		// Post:Comment = 1:n
		Comment.belongsTo(models.Post, {
			foreignKey: {
		        	allowNull: true
			}
		});
		// Movie:Comment = 1:n
		Comment.belongsTo(models.Movie, {
			foreignKey: {
				allowNull: true
			}
		});
		// Place:Comment = 1:n
		Comment.belongsTo(models.Place, {
		        foreignKey: {
		        	allowNull: true
		        }
		});
		// Comment:Like = 1:n
		Comment.hasMany(models.Like)

	        Comment.belongsTo(models.Comment, {
			as: 'ParentComment',
			foreignKey: {
				allowNull:true
			}
		});

	        Comment.hasMany(models.Comment, {as: 'Replies'});
	};
	  return Comment;
};

