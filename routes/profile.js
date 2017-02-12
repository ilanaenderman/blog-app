const express 	= require('express')
const session 	= require('express-session')
const router 	= express.Router()
const db 		= require(__dirname + '/../modules/database.js')
const sequelize = require('sequelize')


router.get('/profile', (request, response) => {
	var user = request.session.user
	if (user === undefined) {
		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		response.render('profile', {user: user})
	}
})

module.exports = router
