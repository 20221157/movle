module.exports = (sequelize, DataTypes) => {
	  const User = sequelize.define('User', {
		  id: {
			  type: DataTypes.INTEGER,
			  primaryKey: true
		  },
		  password: {
			  type: DataTypes.STRING,
			  allowNull: false
		  },
		  nickname: {
			      type: DataTypes.STRING,
			      allowNull: false
		  },

		  name: {
			  type: DataTypes.STRING,
			  allowNull: false
		  },
		  birthdate: {
			  type: DataTypes.DATE,
			  allowNull: false
		  }
	  }, {
		  getterMethods: {
		          age() {
				              const birthdate = new Date(this.birthdate);
				              const ageDifMs = Date.now() - birthdate.getTime();
				              const ageDate = new Date(ageDifMs);
				              return Math.abs(ageDate.getUTCFullYear() - 1970);
				          }
		  }

	  });
	User.associate = (models) => {
		// User:Post = 1:n
		User.hasMany(models.Post);
		//User:User = n:m (e.g., friends or followers)
		User.belongsToMany(models.User, {
			as: 'followers', 
			through: 'Follow',
			foreignKey: 'followedId',
			otherKey: 'followerId'
		});
		User.belongsToMany(models.User, { 
			as: 'followings', 
			through: 'Follow', 
			foreignKey: 'followerId',
			otherKey: 'followedId'
		});
                // User:Comment = 1:n
                User.hasMany(models.Comment);
                // User:Like = 1:n
                User.hasMany(models.Like);
                // User:Rating = 1:n
                User.hasMany(models.Rating);
	  };
	return User;
};
