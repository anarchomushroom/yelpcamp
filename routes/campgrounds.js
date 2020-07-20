const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// INDEX get all campgrounds
router.get('/', function(req, res) {
	// Get all campgrounds from DB
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds });
		}
	});
});

// CREATE new campground
router.post('/', function(req, res) {
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

// NEW campground form
router.get('/new', function(req, res) {
	res.render('campgrounds/new');
});

// SHOW more information about specific campground
router.get('/:id', function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			// render show template with that campground
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

module.exports = router;
