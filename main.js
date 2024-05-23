const port = 80,
	express = require("express"),
	app = express(),
	layouts = require("express-ejs-layouts"),
	favicon = require("serve-favicon");

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
app.get("/movie", (req, res) => {
	res.render("movie");
});
app.get("/place", (req, res) => {
	res.render("place");
});
app.get("/community", (req, res) => {
	res.render("community");
});
app.get("/map", (req, res) => {
	res.render("map");
});




app.listen(port);
