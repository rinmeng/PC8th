const express = require('express');
const router = express.Router();



// GET route to display registration form
router.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');

    let registerMessage = false;
    let registerInput = req.session.registerInput || false;
    if (req.session.registerMessage || req.session.registerInput) {
        registerMessage = req.session.registerMessage;
        req.session.registerMessage = false;
        req.session.registerInput = false;
    }

    res.render('register', {
        title: 'Register for PC8th.',
        registerMessage: registerMessage,
        registerInput: registerInput
    });
});


module.exports = router;