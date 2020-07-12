module.exports = {
	ensureAuthentication: (req, res, next) => {
		if (req.isAuthenticated()) {
			const sessionUserId = req.session.passport.user; // extracted from passport
			req.userId = sessionUserId; // pass authed user's id to the following routes
			return next();
		}
		res.status(403).json({ msg: 'You have to register or login before accessing the resource' });
	}
}