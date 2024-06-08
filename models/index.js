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
db.Address = require('./Address')(sequelize, Sequelize);

db.Follow = require('./Follow')(sequelize, Sequelize);
db.MoviePlace = require('./MoviePlace')(sequelize, Sequelize);
db.MovieGenre = require('./MovieGenre')(sequelize, Sequelize);
db.MovieDirector = require('./MovieDirector')(sequelize, Sequelize);
db.MovieActor = require('./MovieActor')(sequelize, Sequelize);

db.Actor.belongsToMany(db.Movie, { through: 'MovieActor' });
db.Movie.belongsToMany(db.Actor, { through: 'MovieActor' });
db.Director.belongsToMany(db.Movie, { through: 'MovieDirector' });
db.Movie.belongsToMany(db.Director, { through: 'MovieDirector' });

db.Genre.belongsToMany(db.Movie, { through: 'MovieGenre', as: 'genres' });
db.Movie.belongsToMany(db.Genre, { through: 'MovieGenre', as: 'genres' });

module.exports = db;
