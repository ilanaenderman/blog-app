// DB object
const db = {}

// Setup SQL
const sequelize = require('sequelize')
const bcrypt = require('bcrypt')

// Contect to database
db.conn = new sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres'
})

// Define models
db.user = db.conn.define('user', {
	name: sequelize.STRING,
	email: sequelize.STRING,
	password: sequelize.STRING
})

db.post = db.conn.define('post', {
	title: sequelize.STRING,
	body: sequelize.STRING,
})

db.comment = db.conn.define('comment', {
	body: sequelize.STRING,
})

// Define relation
db.user.hasMany( db.post )
db.user.hasMany( db.comment )

db.post.belongsTo( db.user )
db.post.hasMany( db.comment )

db.comment.belongsTo( db.post )
db.comment.belongsTo( db.user )

// Sync
// Create test User, Post and Comment
db.conn.sync({force: true}).then( database => {
	bcrypt.hash('password1', 2, (err, hash) => {
		db.user.create({
			name: "Ilana Enderman",
			email: "ilana@hotmail.com",
			password: hash
		})
		db.post.create({
			title: 'First Blog Post',
			body: 'This is my first blog post. I hope people will read it and like what I have to say.',
			userId: 1
		})
		db.comment.create({
			body: 'Goodluck with your blog.',
			userId: 1,
			postId: 1
		})
	})
})

module.exports = db