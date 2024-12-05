const express = require("express");
const router = express.Router();
const sql = require("mssql");

// Handle POST request for login
router.post("/", async function (req, res) {
    let authenticatedUser = await validateRegister(req, res);
    if (authenticatedUser) {
        res.redirect("/"); // Redirect to homepage after successful login
    } else {
        res.redirect("/register"); // Redirect back to login page if authentication fails
    }
});

// POST route to process registration
async function validateRegister(req, res) {
    const {
        firstName, lastName, email, phonenum,
        address, city, state, postalCode,
        country, userid, password
    } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        // Check if userid already exists
        const checkResult = await pool.request()
            .input('userid', sql.VarChar, userid)
            .query('SELECT * FROM customer WHERE userid = @userid');
        if (checkResult.recordset.length > 0) {
            req.session.registerMessage = "Sorry, the username " + userid + " already exists. Please choose another one.";
            req.session.registerInput = req.body;
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

        const result = await pool.request()
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

        req.session.authenticated = true;
        req.session.loginMessage = "Registration successful. Please login to continue.";
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.session.loginMessage = "Registration failed. Please try again.";
        res.redirect('/register');

    }
}

module.exports = router;
