const express 	= require('express')
const session 	= require('express-session')
const router 	= express.Router()
const db 		= require(__dirname + '/../modules/database.js')
const sequelize = require('sequelize')

const multer 	= require('multer')

const storage 	= multer.diskStorage({
	// Declare where to save file
	destination: function(req, file, callback) {
		callback(null, "static/uploads")
	},
	// Declare how to name file
	filename: function(req, file, callback) {
		let newImage = file.fieldname + '-' + req.session.user.id
		callback(null, newImage)
	}
})
const upload 	= multer({storage: storage})


router.get('/profile', (request, response) => {
	var user = request.session.user
	if (user === undefined) {
		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		response.render('profile', {user: user})
	}
})

router.get('/photo', (request, response) => {
	var user = request.session.user
	if (user === undefined) {
		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		response.render('photo', {user: user, message: request.query.message})
	}

})

router.post('/photo', upload.single('photo'), (request, response, next) => {
	db.user.findOne({
		where: {id: request.session.user.id}
	}).then( user => {
		user.updateAttributes({
			photo: '/uploads/photo-' + request.session.user.id
		})
		response.redirect('/photo?message=' + encodeURIComponent('Your picture has been changed.'))
	})
})




module.exports = router
