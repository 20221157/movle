const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	  class User extends Model {}
	  User.init({
		  id: {
			  type: DataTypes.STRING,
			  primaryKey: true
		  },
		  password: {
			  type: DataTypes.STRING,
			  allowNull: false
		  },
		  nickname: {
			  type: DataTypes.STRING,
			  allowNull: false,
			  unique: false
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
		  },
		  sequelize,
                  modelName: 'user',
                  charset: 'utf8mb4',
                  collate: 'utf8mb4_unicode_ci'

	  });
	return User;
};
