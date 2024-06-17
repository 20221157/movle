const port = 80,
	express = require("express"),
	multer = require('multer'),
	flash = require('express-flash'),
	app = express(),
	session = require('express-session'),
	layouts = require("express-ejs-layouts"),
	favicon = require("serve-favicon"),
	db = require("./models/index"),
	passport = require("passport"),
	nodemailer = require('nodemailer'),
	mapController = require('./controllers/mapController'),
	ratingController = require('./controllers/ratingController'),
	placeController = require('./controllers/placeController'),
	movieController = require('./controllers/movieController'),
	homeController = require('./controllers/homeController'),
	userController = require('./controllers/userController'),
	commentController = require('./controllers/commentController'),
	upload = require('./controllers/multerConfig'),
	bookmarkController = require('./controllers/bookmarkController'),
	likeController = require('./controllers/likeController'),
	communityController = require('./controllers/communityController');

db.sequelize.sync();

app.use(session({
	    secret: 'secret_key', // 세션 암호화를 위한 비밀 키
	    resave: false,
	    saveUninitialized: true
}));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 80);
app.use(
	  express.urlencoded({
		      extended: false
		    })
);
app.use(flash());
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));
app.use(favicon("./public/images/movle.png"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(db.User.createStrategy());
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());
app.use((req, res, next) => {
	    res.locals.isLogged = req.session.user ? true : false;
	    next();
});

app.get("/", homeController.renderHomePage);

app.get('/movie', movieController.getMovies);
app.post('/movie', movieController.getSelect);
app.get('/movie/:id', movieController.getMovieDetails);
app.post('/movie/:id', movieController.getSelect);

app.get("/place", placeController.getPlaces);
app.post('/place', placeController.getSelect);
app.get('/place/:id', placeController.getPlaceDetails);
app.post('/place/:id', placeController.getSelect);

app.get("/community", userController.requireLogin, communityController.getCommunity);
app.get("/community/:id", userController.requireLogin, communityController.getPost);
app.post("/community/:id", userController.requireLogin, upload, communityController.creatPlace, communityController.createPost);

app.delete("/post/:id", communityController.deletePost);
app.get("/post/:id", userController.requireLogin, communityController.showPost);

//app.post("submitPlace", userController.requireLogin, upload, communityController.creatPlace, communityController.createPost);
app.post('/save-rating/:movieId', userController.requireLogin, movieController.saveRating)
app.get("/map", mapController.getMap);
app.post('/map', mapController.getAddress);

app.get("/mypage", userController.requireLogin, userController.renderMyPage);
app.post("/mypage", userController.requireLogin, userController.changeNickname);
app.get("/login", userController.login);
app.post("/login", userController.authenticate);

app.get("/logout", userController.logout, userController.redirectView);
app.get("/signup", userController.getSingupPage);
app.post("/signup", userController.singupUser);

app.get("/forgotpassword", (req,res) => {
	res.render("forgotpassword", {layout:false});
});
app.post("/forgotpassword", userController.updateAndSend);

app.post("/commentp/:id", userController.requireLogin, commentController.creatPlaceComment);
app.post("/commentm/:id", userController.requireLogin, commentController.creatMovieComment);
app.post("/comment/:id", userController.requireLogin, commentController.creatPostComment);

app.post("/placeLike/:id", userController.requireLogin, likeController.addLike, placeController.getPlaceDetails);
app.post("/movieLike/:id", userController.requireLogin, likeController.addMovieLike, movieController.getMovieDetails);
app.post("/placeBookmark/:id", userController.requireLogin, bookmarkController.addBookmark, placeController.getPlaceDetails);
app.post("/movieBookmark/:id", userController.requireLogin, bookmarkController.addMovieBookmark, movieController.getMovieDetails);

app.post('/changePassword', userController.requireLogin, userController.changePassword);

app.listen(port);

