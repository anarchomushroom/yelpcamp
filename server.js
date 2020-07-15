const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seedDB = require('./seeds');

seedDB();

mongoose
	.connect('mongodb://localhost/yelp_camp', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB'))
	.catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Campground.create(
// 	{
// 		name: 'Granite Hill',
//         image: 'https://images.pexels.com/photos/2603681/pexels-photo-2603681.jpeg?auto=compress&cs=tinysrgb&h=350',
// 		description:
// 			'This is a large hill near a large source of granite. Beautiful view, no bathrooms or service points.'
// 	},
// 	function(err, campground) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log('Newly Created Campground: ');
// 			console.log(campground);
// 		}
// 	}
// );

// ===================================================================
// ROUTES
// ===================================================================

// Root
app.get('/', function(req, res) {
	res.render('landing');
});

// INDEX - get and display all campgrounds in DB
app.get('/campgrounds', function(req, res) {
	// Get all campgrounds from DB
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { campgrounds: campgrounds });
		}
	});
});

// CREATE - send the information to the DB to create a new campground
app.post('/campgrounds', function(req, res) {
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let newCampground = { name: name, image: image, description: desc };
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// NEW - get the form used to create a new campground
app.get('/campgrounds/new', function(req, res) {
	res.render('new.ejs');
});

// SHOW - show more information about specific campground
app.get('/campgrounds/:id', function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			// render show template with that campground
			res.render('show', { campground: foundCampground });
		}
	});
});

// Server Start
app.listen(5000, function() {
	console.log('Server has started at localhost:5000');
});
