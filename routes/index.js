const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Rendering the main page
router.get('/', async function (req, res) {
    let userInterests = [];
    let recommendedProducts = [];

    // remove this line when done testing
    req.session.user = "rin";
    req.session.userid = "2";

    if (req.session.userid) {
        try {
            const pool = await sql.connect(dbConfig);

            // First, get user interests
            let userInterestQuery = await pool.request()
                .input("userId", sql.VarChar, req.session.userid)
                .query("SELECT DISTINCT categoryName FROM userInterest WHERE customerId = @userId");

            userInterests = userInterestQuery.recordset.map(item => item.categoryName);

            // If user has interests, select random categories and products
            if (userInterests.length > 0) {
                // Determine number of categories to select (max 3)
                const categoriesToSelect = Math.min(userInterests.length, 3);

                // Shuffle and select unique random categories
                const shuffledInterests = userInterests.sort(() => 0.5 - Math.random());
                const selectedCategories = shuffledInterests.slice(0, categoriesToSelect);

                // For each selected category, get a random product
                for (const category of selectedCategories) {
                    let productQuery = await pool.request()
                        .input("categoryName", sql.VarChar, category)
                        .query(`
                            SELECT TOP 1 p.productId, 
                                   p.productName, 
                                   p.productPrice AS price, 
                                   p.productImageURL AS imagePath,
                                   c.categoryName
                            FROM product p
                            JOIN category c ON p.categoryId = c.categoryId
                            WHERE c.categoryName = @categoryName
                            ORDER BY NEWID()
                        `);

                    // If a product exists, add it to recommended products
                    if (productQuery.recordset.length > 0) {
                        recommendedProducts.push(productQuery.recordset[0]);
                    }
                }
            }

            console.log('Processed userInterests:', userInterests);
            console.log('Recommended Products:', recommendedProducts);

        } catch (err) {
            console.error('Error:', err);
            userInterests = ["ERROR", err.message];
        }
    }

    // Render the page with the fetched user interests and recommended products
    res.render('index', {
        title: "PC8th Parts Store",
        username: req.session.user || null,
        userid: req.session.userid || null,
        admin: req.session.user === "admin",
        userInterests: userInterests,
        recommendedProducts: recommendedProducts
    });
});

module.exports = router;