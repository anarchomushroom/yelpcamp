const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const campground = require('../models/campground');

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
router.post('/', isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = { name: name, image: image, description: desc, author: author };
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
router.get('/new', isLoggedIn, function(req, res) {
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

// EDIT campground
router.get('/:id/edit', CheckCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});

// UPDATE campground
router.put('/:id', function(req, res) {
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			// redirect to show page
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

// DESTROY campground
router.delete('/:id', function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// IsLoggedIn Middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

// CheckCampgroundOwnership middleware
function CheckCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				res.redirect('/campgrounds');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('/login');
	}
}

module.exports = router;
