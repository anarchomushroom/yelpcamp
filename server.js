const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose
	.connect('mongodb://localhost/yelp_camp', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB'))
	.catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let campgrounds = [
	{
		name: 'Salmon Creek',
		image: 'https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=350'
	},
	{
		name: 'Granite Hill',
		image: 'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350'
	},
	{
		name: "Mountain Goat's Rest",
		image: 'https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507440712c7fd29f4dc1_340.jpg'
	}
];

// ===================================================================
// ROUTES
// ===================================================================

// Root
app.get('/', function(req, res) {
	res.render('landing');
});

// Campgrounds/GET
app.get('/campgrounds', function(req, res) {
	res.render('campgrounds', { campgrounds: campgrounds });
});

// Campgrounds/POST
app.post('/campgrounds', function(req, res) {
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let newCampground = { name: name, image: image };
	campgrounds.push(newCampground);
	//redirect back to campgrounds page
	res.redirect('/campgrounds');
});

// New Campground/GET
app.get('/campgrounds/new', function(req, res) {
	res.render('new.ejs');
});

// Server Start
app.listen(5000, function() {
	console.log('Server has started at localhost:5000');
});
