const express = require('express');
const router = express.Router();
const sql = require('mssql');

// GET route to display registration form
router.get('/', (req, res) => {
    res.render('register', {
        title: 'Register for PC8th',
        username: req.session.user || null,
    });
});

// POST route to process registration
router.post('/', async (req, res) => {
    const {
        firstName, lastName, email, phonenum,
        address, city, state, postalCode,
        country, userid, password
    } = req.body;

    try {
        // Check if userid already exists
        const checkUserQuery = `SELECT * FROM customer WHERE userid = @userid`;
        const checkResult = await pool.request()
            .input('userid', sql.VarChar, userid)
            .query(checkUserQuery);

        if (checkResult.recordset.length > 0) {
            req.flash('loginMessage', 'Username already exists');
            return res.redirect('/register');
        }

        // Insert new customer
        const insertQuery = `
            INSERT INTO customer (
                firstName, lastName, email, phonenum, 
                address, city, state, postalCode, 
                country, userid, password
            ) VALUES (
                @firstName, @lastName, @email, @phonenum, 
                @address, @city, @state, @postalCode, 
                @country, @userid, @password
            )
        `;

        await pool.request()
            .input('firstName', sql.VarChar, firstName)
            .input('lastName', sql.VarChar, lastName)
            .input('email', sql.VarChar, email)
            .input('phonenum', sql.VarChar, phonenum)
            .input('address', sql.VarChar, address)
            .input('city', sql.VarChar, city)
            .input('state', sql.VarChar, state)
            .input('postalCode', sql.VarChar, postalCode)
            .input('country', sql.VarChar, country)
            .input('userid', sql.VarChar, userid)
            .input('password', sql.VarChar, password)
            .query(insertQuery);

        // Automatically log in after registration
        req.session.loggedin = true;
        req.session.userid = userid;

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});

module.exports = router;