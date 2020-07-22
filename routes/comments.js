const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// NEW comment form
router.get('/new', middleware.isLoggedIn, function(req, res) {
	// find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

// CREATE new comment
router.post('/', middleware.isLoggedIn, function(req, res) {
	// look up campground by ID
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					// add username and ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect(`/campgrounds/${campground._id}`);
				}
			});
		}
	});
});

// EDIT comment route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { comment: foundComment, campground_id: req.params.id });
		}
	});
});

// UPDATE comment route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.send(err);
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

// DESTROY comment route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	//findByIDAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.send(err);
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

module.exports = router;
