const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

let data = [
	{
		name: "Cloud's Rest",
		image:
			'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a lorem egestas, gravida erat nec, aliquam mi. Nunc ut tortor diam. Sed quis libero tempor, vehicula orci in, hendrerit quam. Nunc at augue at nulla efficitur iaculis. Ut tempus vehicula mi, a cursus felis accumsan vitae. Phasellus tortor sem, fringilla vel ex nec, aliquam egestas sem. Fusce augue nulla, pharetra vitae consequat sit amet, mollis sed tellus.'
	},
	{
		name: "Mountain Goat's Peak",
		image:
			'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a lorem egestas, gravida erat nec, aliquam mi. Nunc ut tortor diam. Sed quis libero tempor, vehicula orci in, hendrerit quam. Nunc at augue at nulla efficitur iaculis. Ut tempus vehicula mi, a cursus felis accumsan vitae. Phasellus tortor sem, fringilla vel ex nec, aliquam egestas sem. Fusce augue nulla, pharetra vitae consequat sit amet, mollis sed tellus.'
	},
	{
		name: 'Canyon Retreat',
		image:
			'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a lorem egestas, gravida erat nec, aliquam mi. Nunc ut tortor diam. Sed quis libero tempor, vehicula orci in, hendrerit quam. Nunc at augue at nulla efficitur iaculis. Ut tempus vehicula mi, a cursus felis accumsan vitae. Phasellus tortor sem, fringilla vel ex nec, aliquam egestas sem. Fusce augue nulla, pharetra vitae consequat sit amet, mollis sed tellus.'
	}
];

function seedDB() {
	// Remove all campgrounds
	Campground.deleteMany({}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log('removed campgrounds!');
		// Add a few campgrounds
		data.forEach(function(seed) {
			Campground.create(seed, function(err, campground) {
				if (err) {
					console.log(err);
				} else {
					console.log('added a campground');
					// create a comment
					Comment.create(
						{
							text: 'This place is great but I wish there was internet!',
							author: 'Homer'
						},
						function(err, comment) {
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log('added a comment');
							}
						}
					);
				}
			});
		});
	});
}

module.exports = seedDB;
