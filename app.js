//Including the necesarry modules
const sequelize 	= require('sequelize')
const express 		= require('express')
const bodyParser 	= require('body-parser')
const session 		= require('express-session')
const pug			= require('pug')
const pg 			= require('pg')
const bcrypt		= require('bcrypt')

const app			= express()

app.set( 'view engine', 'pug')
app.set( 'views', __dirname + '/views' )

app.use( express.static('static'))
app.use( bodyParser.urlencoded({extended: true}))
app.use(session({
	secret: 'security is important',
	resave: true,
	saveUninitialized: false
}))


//Contect to database
const db = new sequelize('postgres://floriandalhuijsen@localhost/blog')
//const db = new sequelize('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog')

//define models
let User = db.define('user', {
	fname: sequelize.STRING,
	lname: sequelize.STRING,
	email: sequelize.STRING,
	password: sequelize.STRING
})

let Post = db.define('post', {
	title: sequelize.STRING,
	body: sequelize.STRING,
})

let Comment = db.define('comment', {
	body: sequelize.STRING,
})

//define relation
User.hasMany( Post )
User.hasMany( Comment )

Post.belongsTo( User )
Post.hasMany( Comment )

Comment.belongsTo( Post )
Comment.belongsTo( User )



//Route Log in page
app.get('/', (request, response) => {
	response.render('index', {
		message: request.query.message,
		user: request.session.user
	});
});

//Login

app.post('/login', (request, response) => {


	if(request.body.email.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}

	if(request.body.password.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}

	User.findOne({
		where: {
			email: request.body.email
		}
	}).then( (user) => {
		var hash = user.password
		console.log(hash)

		bcrypt.compare(request.body.password, hash, (err, res) => { 
		if (user !== null && res == true) {
			request.session.user = user;
			response.redirect('/profile');
		} else {
			response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
			}
		})
		}, (error) => {
		response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
	});
});

// Register
app.get('/register', (request, response) => {
	response.render( 'register' )
})

app.post('/register', (request, response) => {
	bcrypt.hash(request.body.password, 2, (err, hash) => {
		User.create({
			fname: request.body.fname,
			lname: request.body.lname,
			email: request.body.email,
			password: hash
		}).then( newUser => {
		console.log(newUser)
		response.redirect('/')
		})
	})
})


// Profile
//_______________________________________

app.get('/profile', (request, response) => {
	var user = request.session.user
	if (user === undefined) {
		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		response.render('profile', {
			user: user
		});
	}
});


// Write post
app.get('/newpost', (request, response) => {
	var user = request.session.user
	response.render('newpost', {user: user})
})

app.post('/newpost', (request, response) => {
	var user = request.session.user
	
	Post.create({
		title: request.body.title,
		body: request.body.post,
		userId: request.session.user.id 
	}).then( 
	addpost => {
		response.render('newpost', {user: user , addpost: addpost})
	})
})


// My posts
app.get('/mypost', (request, response) => {
	var user = request.session.user


	Post.findAll({
		where: {userId: request.session.user.id}
	}).then( addpost => {
		response.render('mypost', {user: user, addpost: addpost})
	})
})


// All posts
app.get('/allpost', (request, response) => {
	var user = request.session.user

	Post.findAll({
		include: [{
			model: User
		}]
	}).then( addpost => {
		response.render('allpost', {user: user, addpost: addpost})
	})
})

app.post('/allpost', (request, response) => {
	var user = request.session.user

	Post.findAll({
		where: {id: request.body.postID},
		include: [{
			model: Comment,
			include: [User]
		}, {
			model: User
		}]
	}).then( specificpost => {
		response.render('post', {user: user, specific: specificpost})
	})
})

app.get('/post', (request, response) => {
	var user = request.session.user

	Post.findAll({
		where: {id: request.session.postID}, 
		include: [{
			model: Comment,
			include: [User]
		}, {
			model: User
		}]
	}).then ( specificpost => {
		response.render('post', {user: user, specific, specificpost})
	})
})

// Create Comments on Specific Page

app.post('/post', (request, response) => {
	var user = request.session.user

	Comment.create({
		body: request.body.comment,
		postId: request.body.postID,
		userId: user.id
	}).then( comment => {
		Post.findAll({
			where: {id: request.body.postID},
			include:[{
				model: Comment,
				include: [User]
			}, {
				model: User
			}]
		}).then( specificpost => {
			console.log(comment)
			response.render('post', {user: user, specific: specificpost})
		})
	})
})



// Log out 
app.get('/logout',  (request, response)  =>{
	request.session.destroy( (error) => {
		if(error) {
			throw error;
		}
		response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});



// Sync
//Create test User, Post and Comment
db.sync({force: true}).then( () => {
	User.create({
		fname: "Ilana",
		lname: "Enderman",
		email: "ilana@hotmail.com",
		password: "password"
	})
	Post.create({
		title: 'First Blog Post',
		body: 'This is my first blog post. I hope people will read it and like what I have to say.',
		userId: 1
	})
	Comment.create({
		body: 'Goodluck with your blog.',
		userId: 1,
		postId: 1
	}).then( () => {
		var server = app.listen(8000, () => {
			console.log('Example app listening on port: ' + server.address().port);
		});
	});
}, (error) => {
	console.log('sync failed: ');
	console.log(error);
});