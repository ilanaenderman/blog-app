const express 	= require('express')
const session 	= require('express-session')
const bcrypt	= require('bcrypt')
const router 	= express.Router()
const db		= require(__dirname + '/../modules/database')

// Register
router.get('/register', (request, response) => {

	response.render( 'register', {message: request.query.message} )
})

router.post('/register', (request, response) => {
	let name 	= request.body.name
	let eMail 	= request.body.email
	let pWord 	= request.body.password
	let pCon	= request.body.conPassword
	let firstChar= name.substr(0,1)

	if( name.length === 0) {
		response.redirect('/register?message=' + encodeURIComponent("Please fill out your name."))
		return
	}
	if( !firstChar.match(/[a-zA-Z ]/)) {
		response.redirect('/register?message=' + encodeURIComponent("First letter must me alphabetic."))
		return
	}
	if( eMail.length === 0) {
		response.redirect('/register?message=' + encodeURIComponent("Please fill out your email address."))
		return
	}
	if( !eMail.match(/@/)){
		response.redirect('/register?message=' + encodeURIComponent("Please fill in a valid email address."))
		return
	}
	if( pWord.length < 8 ){
		response.redirect('/register?message=' + encodeURIComponent("Password is too short."))
		return
	}
	if( pCon !==  pWord ) {
		response.redirect('/register?message=' + encodeURIComponent("Not the same password."))
		return
	}

	db.user.findOne({
		where: {
			$or: [{
				name: name
			},{
				email: eMail 
			}]
		}
	}).then (user => {
		bcrypt.hash(request.body.password, 2, (err, hash) => {
			if(user == null) {
				db.user.create({
					name: request.body.name,
					email: request.body.email,
					password: hash
				})
				response.redirect('/?message=' + encodeURIComponent("Succesfully registered."))
			} else {
				response.redirect('/register?message=' + encodeURIComponent("Name or email already in use."))
			}
		})
	})
})

module.exports = router