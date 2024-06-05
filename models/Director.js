module.exports = (sequelize, Sequelize) => {
    class Director extends Sequelize.Model {}
    Director.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imagePath: {
            type: Sequelize.STRING,
        }
    }, {
        sequelize,
	timestamps: false,
        modelName: 'director',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });
    return Director;
};

