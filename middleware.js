function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/app/login"); // Redirect to login page
    }
    next(); // Move to the next middleware if authenticated
}

module.exports = {isLoggedIn};