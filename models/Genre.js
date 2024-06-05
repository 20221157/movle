module.exports = (sequelize, Sequelize) => {
    class Genre extends Sequelize.Model {}
    Genre.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        sequelize,
	timestamps: false,
        tableName: 'genres',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });
    return Genre;
};

