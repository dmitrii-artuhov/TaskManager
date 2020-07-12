const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// models
const User = require('../../models/User');
// passport
const passport = require('passport');
// middleware
const auth = require('../../middleware/auth');


// register user
router.post('/register', (req, res) => {
	const { email, name, username, password } = req.body;
	if (!email || !name || !username || !password) {
		return res.status(400).json({ msg: 'Please, enter all fields', type: 'error' });
	}

	User.findOne({ email })
		.then((user) => {
			if (user) 
				return res.status(400).json({ msg: 'Email is already taken', type: 'error' });

			User.findOne({ username })
				.then((user) => {		
					if (user) 
						return res.status(400).json({ msg: 'Username is already taken', type: 'error' });

						const newUser = new User({
							email,
							name, 
							username,
							password
						});
						
						// hash password
						bcrypt.genSalt(10, (err, salt) => {
							if (err) {
								console.error(err);
								return res.status(500).json({ msg: 'Internal server error', type: 'error' });
							}
			
							bcrypt.hash(newUser.password, salt, (err, hash) => {
								if (err) {
									console.error(err);
									return res.status(500).json({ msg: 'Internal server error', type: 'error' });
								}
			
								// set hashed password
								newUser.password = hash;
								// save new user
								newUser.save()
									.then((user) => {
										res.json({ msg: 'User successfully registered. You can login now.', type: 'success' });
									})
									.catch((err) => {
										console.error(err);
										res.status(500).json({ msg: 'Internal server error', type: 'error' });
									});
							});
						});
				})
				.catch((err) => {
					console.error(err);
					res.status(500).json({ msg: 'Internal server error', type: 'error' });
				});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ msg: 'Internal server error', type: 'error' });
		})

	// add fields validation on front-end
});

// login user
router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
    if (err) {
			console.error(err);
			return res.status(401).json({ msg: 'Failed to login', type: 'error' });
		}
    if (!user) {
			return res.status(401).json({ msg: 'Invalid credencials', type: 'error' });
		}

    req.logIn(user, (err) => {
      if (err) {
				console.error(err);
				return res.status(401).json({ msg: 'Failed to login', type: 'error' });
			}

			const returnedUser = user;
			returnedUser.password = undefined;

      res.json({ msg: 'Logged in successfully', type: 'success', user: returnedUser });
    });
  })(req, res, next);
});

// logout user
router.get('/logout', (req, res) => {
	req.logout();
	res.json({ msg: 'Logged out successfully', type: 'success' });
});

// retrieve user - used for page reload
router.get('/retrieve', auth.ensureAuthentication, (req, res) => {
	User.findOne({ _id: req.userId })
		.select('-password')
		.then((user) => {
			res.json({ user });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ msg: 'Internal server error' });
		});
});

// find one user
router.get('/find/:id', (req, res) => {
	const { id } = req.params;

	User.findOne({ _id: id })
		.select('-password')
		.populate('ownBoards')
		.populate('sharedBoards')
		.exec((err, user) => {
			if (err) {
				console.error(err);
				return res.status(404).json({ msg: 'Internal server error' });
			}
			res.json({ user });
		});
});

module.exports = router;