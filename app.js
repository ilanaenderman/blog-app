// Including the necesarry modules
const sequelize 	= require('sequelize')
const express 		= require('express')
const bodyParser 	= require('body-parser')
const session 		= require('express-session')
const pug			= require('pug')
const pg 			= require('pg')
const bcrypt		= require('bcrypt')
const sass			= require('node-sass')
const multer		= require('multer')

const app			= express()
const db 			= require(__dirname + '/modules/database.js')

app.set( 'view engine', 'pug')
app.set( 'views', __dirname + '/views' )

app.use( express.static('static'))
app.use( bodyParser.urlencoded({extended: true}))
app.use(session({
	secret: 'security is important',
	resave: true,
	saveUninitialized: false
}))

// Initialize routes
let profileRoute 	= require(__dirname + '/routes/profile')
let loginRoute	 	= require(__dirname + '/routes/login')
let registerRoute	= require(__dirname + '/routes/register')
let writepostRoute 	= require(__dirname + '/routes/writepost')
let postsRoute		= require(__dirname + '/routes/posts')
let commentRoute	= require(__dirname + '/routes/comment')
let logoutRoute		= require(__dirname + '/routes/logout')

app.use(profileRoute)
app.use(loginRoute)
app.use(registerRoute)
app.use(writepostRoute)
app.use(postsRoute)
app.use(commentRoute)
app.use(logoutRoute)

// Listen port 8000
app.listen(8000, () => {
			console.log('Server is running on port 8000')
})