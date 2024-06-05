module.exports = (sequelize, Sequelize) => {
    class Movie extends Sequelize.Model {}
    Movie.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        plot: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        imagePath: {
            type: Sequelize.STRING,
        },
	view: {
	    type: Sequelize.INTEGER,
	    defaultValue: 0
	}
    }, {
        sequelize,
        modelName: 'movie',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });
    return Movie;
};

