const express = require('express');
const app = express();
const config = require('./config/config.json');
const mongoose = require('mongoose');
const session = require('express-session');
// Passport
const passport = require('passport');
require('./middleware/passport')(passport);

// middleware
app.use(express.json());

// Express session
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connect
const MongoURI = process.env.MongoURI || config.MongoURI;

mongoose.set('useCreateIndex', true);
mongoose.connect(MongoURI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true  })
	.then(() => {
		console.log('Connected to MongoDB...');
	})
	.catch((err) => {
		console.error('Enable to connect to MongoDB', err);
	});


// Routes
app.use('/api/users', require('./api/routes/users'));
app.use('/api/boards', require('./api/routes/boards'));
app.use('/api/participants', require('./api/routes/participants'));
app.use('/api/lists', require('./api/routes/lists'));
app.use('/api/cards', require('./api/routes/cards'));

// Server
const PORT = process.env.PORT || config.PORT;
app.listen(PORT, () => {
	console.log(`Server started on port: ${PORT}`);
});
