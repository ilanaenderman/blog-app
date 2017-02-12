const express 	= require('express')
const session 	= require('express-session')
const router 	= express.Router()
const db		= require(__dirname + '/../modules/database')

// My posts
router.get('/mypost', (request, response) => {
	var user = request.session.user


	db.post.findAll({
		where: {userId: request.session.user.id}
	}).then( addpost => {
		response.render('mypost', {user: user, addpost: addpost})
	})
})


// All posts
router.get('/allpost', (request, response) => {
	var user = request.session.user

	db.post.findAll({
		include: [{
			model: db.user
		}]
	}).then( addpost => {
		response.render('allpost', {user: user, addpost: addpost})
	})
})

router.post('/allpost', (request, response) => {
	var user = request.session.user

	db.post.findAll({
		where: {id: request.body.postID},
		include: [{
			model: db.comment,
			include: [User]
		}, {
			model: User
		}]
	}).then( specificpost => {
		response.render('post', {user: user, specific: specificpost})
	})
})

router.get('/post', (request, response) => {
	var user = request.session.user

	db.post.findAll({
		where: {id: request.session.postID}, 
		include: [{
			model: Comment,
			include: [User]
		}, {
			model: User
		}]
	}).then ( specificpost => {
		response.render('post', {user: user, specific: specificpost})
	})
})

module.exports = router