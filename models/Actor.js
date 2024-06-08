module.exports = (sequelize, Sequelize) => {
    class Actor extends Sequelize.Model {}
    Actor.init({
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
        modelName: 'actor',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });
    
    return Actor;
};

