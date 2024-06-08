const db = require("../models");

exports.renderHomePage = async (req, res) => {
    try {
        const movies = await db.Movie.findAll({
            order: db.sequelize.random(), // 랜덤하게 순서를 변경하여 영화 목록을 가져옵니다.
            limit: 12 // 12개의 영화만 가져옵니다.
        });
        res.render('home', { movies, loggedIn: req.isAuthenticated() });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).send("Internal Server Error");
    }
};
