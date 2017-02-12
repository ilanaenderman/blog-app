const express 	= require('express')
const session 	= require('express-session')
const router 	= express.Router()
const db		= require(__dirname + '/../modules/database')


// Create Comments on Specific Page

router.post('/post', (request, response) => {
	var user = request.session.user

	db.comment.create({
		body: request.body.comment,
		postId: request.body.postID,
		userId: user.id
	}).then( comment => {
		db.post.findAll({
			where: {id: request.body.postID},
			include:[{
				model: Comment,
				include: [User]
			}, {
				model: User
			}]
		}).then( specificpost => {
			response.render('post', {user: user, specific: specificpost})
		})
	})
})

module.exports = router