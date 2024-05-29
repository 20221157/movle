const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.Post = require('./Post')(sequelize, Sequelize);
db.Board = require('./Board')(sequelize, Sequelize);
db.Comment = require('./Comment')(sequelize, Sequelize);
db.Like = require('./Like')(sequelize, Sequelize);
db.Rating = require('./Rating')(sequelize, Sequelize);
db.Movie = require('./Movie')(sequelize, Sequelize);
db.Place = require('./Place')(sequelize, Sequelize);
db.Genre = require('./Genre')(sequelize, Sequelize);
db.Director = require('./Director')(sequelize, Sequelize);
db.Actor = require('./Actor')(sequelize, Sequelize);


// 모델 관계 설정
Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

module.exports = db;
