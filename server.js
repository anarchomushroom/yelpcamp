const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
const methodOverride = require('method-override');
// Require routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

// Commented out to prevent seeding on DB load
// seedDB();

mongoose.set('useFindAndModify', false);
mongoose
	.connect('mongodb://localhost/yelp_camp', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB'))
	.catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());

// ===================================================================
// PASSPORT CONFIG
// ===================================================================
app.use(
	require('express-session')({
		secret: 'Always Be Running',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.message = req.flash('error');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// Server Start
app.listen(5000, function() {
	console.log('Server has started at localhost:5000');
});
