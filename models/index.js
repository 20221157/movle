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
db.Bookmark = require('./Bookmark')(sequelize, Sequelize);

db.Follow = require('./Follow')(sequelize, Sequelize);
db.MoviePlace = require('./MoviePlace')(sequelize, Sequelize);
db.MovieGenre = require('./MovieGenre')(sequelize, Sequelize);
db.MovieDirector = require('./MovieDirector')(sequelize, Sequelize);
db.MovieActor = require('./MovieActor')(sequelize, Sequelize);

db.Actor.belongsToMany(db.Movie, { through: 'MovieActor', foreignKey: 'ActorId' });
db.Movie.belongsToMany(db.Actor, { through: 'MovieActor', foreignKey: 'MovieId' });
db.Director.belongsToMany(db.Movie, { through: 'MovieDirector', foreignKey: 'DirectorId' });
db.Movie.belongsToMany(db.Director, { through: 'MovieDirector', foreignKey: 'MovieId' });

db.Genre.belongsToMany(db.Movie, { through: 'MovieGenre', foreignKey: 'genreId', as: 'movies' });
db.Movie.belongsToMany(db.Genre, { through: 'MovieGenre', foreignKey: 'movieId', as: 'genres' });

db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
db.User.belongsToMany(db.User, { through: 'Follow', as: 'Following', foreignKey: 'followerId' });

db.Address.hasOne(db.Place);
db.Place.hasOne(db.Address);

db.Post.belongsTo(db.Board);
db.Board.hasMany(db.Post);

db.Post.belongsTo(db.User);
db.User.hasMany(db.Post);

db.Bookmark.belongsTo(db.Movie);
db.Movie.hasMany(db.Bookmark);

db.Bookmark.belongsTo(db.User);
db.User.hasMany(db.Bookmark);

db.Bookmark.belongsTo(db.Place);
db.Place.hasMany(db.Bookmark);

db.Comment.belongsTo(db.Post);
db.Post.hasMany(db.Comment);

db.Comment.belongsTo(db.User);
db.User.hasMany(db.Comment);

db.Comment.hasMany(db.Comment);
db.Comment.belongsTo(db.Comment);

db.Comment.belongsTo(db.Place);
db.Place.hasMany(db.Comment);

db.Comment.belongsTo(db.Movie);
db.Movie.hasMany(db.Comment);

db.Comment.hasMany(db.Like);
db.Like.belongsTo(db.Comment);

db.Like.belongsTo(db.User);
db.User.hasMany(db.Like);

db.Like.belongsTo(db.Post);
db.Post.hasMany(db.Like);

db.Like.belongsTo(db.Movie); 
db.Movie.hasMany(db.Like);

db.Like.belongsTo(db.Place);
db.Place.hasMany(db.Like);

db.Rating.belongsTo(db.Movie);
db.Movie.hasMany(db.Rating);

db.Rating.belongsTo(db.Place);
db.Place.hasMany(db.Rating);

db.Rating.belongsTo(db.User);
db.User.hasMany(db.Rating);

module.exports = db;
