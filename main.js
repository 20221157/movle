const port = 80,
	express = require("express"),
	app = express(),
	session = require('express-session'),
	layouts = require("express-ejs-layouts"),
	favicon = require("serve-favicon"),
	db = require("./models/index"),
	passport = require("passport"),
	nodemailer = require('nodemailer'),
	mapController = require('./controllers/mapController'),
	placeController = require('./controllers/placeController'),
	movieController = require('./controllers/movieController'),
	homeController = require('./controllers/homeController'),
	userController = require('./controllers/userController'),
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
app.post("/community/:id", userController.requireLogin, communityController.createPost, communityController.uploadImage);

app.delete("/post/:id", communityController.deletePost);
app.get("/post/:id");

app.post("submitPlace", userController.requireLogin, communityController.creatPlace, communityController.createPost);
app.get("/map", mapController.getMap);
//app.post('/map', mapController.getAddress);

app.get("/mypage", userController.requireLogin, userController.renderMyPage);
app.get("/login", userController.login);
app.post("/login", userController.authenticate);

app.get("/logout", userController.logout, userController.redirectView);
app.get("/signup", userController.getSingupPage);
app.post("/signup", userController.singupUser);

app.get("/forgotpassword", (req,res) => {
	res.render("forgotpassword", {layout:false});
});
app.post("/forgotpassword", userController.updateAndSend);



app.listen(port);

