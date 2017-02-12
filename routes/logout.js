const express 	= require('express')
const session 	= require('express-session')
const router 	= express.Router()
const db		= require(__dirname + '/../modules/database')

// Log out 
router.get('/logout',  (request, response)  =>{
	request.session.destroy( (error) => {
		if(error) {
			throw error;
		}
		response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

module.exports = router
