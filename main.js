const port = 80,
	express = require("express"),
	app = express(),
	layouts = require("express-ejs-layouts"),
	favicon = require("serve-favicon"),
	db = require("./models/index"),
	movieController = require('./controllers/movieController');

db.sequelize.sync();

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 80);
app.use(
	  express.urlencoded({
		      extended: false
		    })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));
app.use(favicon("./public/images/movle.png"));

app.get("/", (req, res) => {
	  res.render("home");
});
//app.get("/movie", (req, res) => {
//	res.render("movie");
//});
app.get('/movie', movieController.getMovies);
app.get('/movie/:id', movieController.getMovieDetails);

app.get("/place", (req, res) => {
	res.render("place");
});
app.get("/community", (req, res) => {
	res.render("community");
});
app.get("/map", (req, res) => {
	res.render("map");
});
app.get("/mypage", (req, res) => {
	res.render("mypage", {layout:false});
});
app.get("/login", (req, res) => {
	res.render("login", {layout:false});
});


app.listen(port);
