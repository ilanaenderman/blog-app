const express 	= require('express')
const session 	= require('express-session')
const bcrypt	= require('bcrypt')
const db		= require(__dirname + '/../modules/database')
const router 	= express.Router()


// Route Log in page
router.get('/', (request, response) => {
	response.render('index', {
		message: request.query.message,
		user: request.session.user
	})
})

// Login
router.post('/login', (request, response) => {


	if(request.body.email.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your email."));
		return;
	}

	if(request.body.password.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}

	db.user.findOne({
		where: {
			email: request.body.email
		}
	}).then( (user) => {
		var hash = user.password

		bcrypt.compare(request.body.password, hash, (err, res) => { 
			if (user !== null && res == true) {
				request.session.user = user
				response.redirect('/profile')
			} 
			else {
				response.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
			}
		})
		}, (error) => {
			response.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
	})
})


module.exports = router