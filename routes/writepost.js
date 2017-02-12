const express 	= require('express')
const session 	= require('express-session')
const router 	= express.Router()
const db		= require(__dirname + '/../modules/database')

// Write post
router.get('/newpost', (request, response) => {
	var user = request.session.user
	response.render('newpost', {user: user})
})

router.post('/newpost', (request, response) => {
	var user = request.session.user
	
	db.post.create({
		title: request.body.title,
		body: request.body.post,
		userId: request.session.user.id 
	}).then( 
	addpost => {
		response.render('newpost', {user: user , addpost: addpost})
	})
})

module.exports = router