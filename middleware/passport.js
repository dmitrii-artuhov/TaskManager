const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// models
const User = require('../models/User');

module.exports = (passport) => {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			// match user
			User.findOne({ email })
				.then((user) => {
					if (!user) {
						return done(null, false, { msg: 'Invalid email provided' });
					}

					// match password
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) {
							console.error(err);
							return done(err, false, { msg: 'Internal server error' });
						}

						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { msg: 'Invalid password' });
						}
					});
				})
				.catch((err) => {
					console.erorr(err);
				});
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}