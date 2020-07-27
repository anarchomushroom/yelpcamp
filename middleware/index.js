const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

// Check Campground Ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				req.flash('error', 'Campground not found');
				res.redirect('/campgrounds');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You must be logged in to do that');
		res.redirect('/login');
	}
};

// Check Comment Ownership
middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You must be logged in to do that');
		res.redirect('/login');
	}
};

// Is Logged In
middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You must be logged in to do that');
	res.redirect('/login');
};

module.exports = middlewareObj;
