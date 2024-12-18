const express = require('express');
const router = express.Router();

// Show login page
router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');



    // Set the message for the login, if present
    let loginMessage = false;
    if (req.session.loginMessage) {
        loginMessage = req.session.loginMessage;
        req.session.loginMessage = false; // Clear the message after displaying it
    }

    // Pass username and loginMessage to the view
    res.render('login', {
        title: "Login to PC8th",
        loginMessage: loginMessage,
        username: req.session.user || false, // Pass the username if authenticated
        registerSuccess: req.session.registerMessage || false
    });
});

module.exports = router;
