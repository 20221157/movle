const db = require("../models")
exports.renderHomePage = (req, res) => {
    res.render('home',{ isLogged: req.isAuthenticated() }); // index.ejs 렌더링 시 isLogged 변수 전달
};
