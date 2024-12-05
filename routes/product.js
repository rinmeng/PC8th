const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>Product Details</title>');
    res.write('<link href="/style.css" rel="stylesheet">');
    res.write('<body class="text-white text-center bg-slate-600">');

    (async function () {
        try {
            let pool = await sql.connect(dbConfig);

            // Get product name to search for
            // TODO: Retrieve and display info for the product
            const productId = req.query.id;
            if (!productId) {
                res.write('<h2 class="text-red-500">No product selected!</h2>');
                res.end();
                return;
            }

            let productQuery = `
                SELECT p.productId, p.productName, p.productPrice, p.productDesc, p.productImageURL, p.productImage, c.categoryName
                FROM product p
                JOIN category c ON p.categoryId = c.categoryId
                WHERE p.productId = @productId
            `;

            let request = pool.request();
            request.input('productId', sql.Int, productId);
            let result = await request.query(productQuery);
            let product = result.recordset[0];

            if (result.recordset.length === 0) {
                res.write('<h2 class="text-red-500">Product not found!</h2>');
                res.end();
                return;
            }

            res.write(`<nav
                        class="t1000e translate-x-[45.83%] z-10 mt-6 fixed left-1/2 transform hover:-translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
                        <h1 id="navhint" class="t500e opacity-100 text-7xl">&larr;</h1>
                        <a class="opacity-100 p-3 hover:opacity-100 t200e text-6xl w-3/4" href="/">PC8th</a>

                        <!-- Navigation Links -->
                        <div class="flex justify-center w-full">
                            <!-- Product List -->
                            <a href="/listprod" class="relative group p-3">
                                <div class="opacity-50 group-hover:opacity-100 t200e">Product List</div>
                                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                                </div>
                            </a>

                            <!-- Order List -->
                            <a href="/listorder" class="relative group p-3">
                                <div class="opacity-50 group-hover:opacity-100 t200e">Order List</div>
                                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                                </div>
                            </a>

                            <!-- My Cart -->
                            <a href="/showcart" class="relative group p-3">
                                <div class="opacity-50 group-hover:opacity-100 t200e">My Cart</div>
                                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                                </div>
                            </a>
                        </div>

                        <!-- if login, show logout -->
                            <div class="text-center items-center">
                                <!-- If logged in, show user's name and logout button -->
                                ${req.session.authenticated ? `
                                    <p class="text-white px-3 w-full">Hey,
                                        <a href="/customer?userid={{userid}}" class="font-bold opacity-50 hover:opacity-100 t200e">
                                            <strong>${req.session.user}</strong>
                                        </a>
                                    </p>
                                    <a href="/logout" class="opacity-50 p-3 hover:opacity-100 t200e px-10">Logout</a>
                                ` : `
                                    <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
                                `}
                            </div>
                    </nav>`);

            res.write(`<div class="py-4"></div>`);


            // Display product details
            res.write(`
                <div class="w-1/2 mx-auto px-4 m-5  opacity-0 animate-fall-quick">
                    <div class="strong-slate rounded-xl p-10">
                        <h1 class="text-5xl font-light my-5">${product.productName}</h1>
            `);

            // TODO: If there is a productImageURL, display using IMG tag
            if (product.productImageURL) {
                res.write(`
                    <div class="my-10">
                        <img src="${product.productImageURL}" alt="${product.productName}" 
                        class="rounded-lg shadow-lg mx-auto w-80  h-80 object-cover">
                    </div>
                `);
            }

            // TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.
            if (product.productImage) {
                res.write(`
                    <div class="my-4">
                        <img src="/displayImage?id=${product.productId}" alt="${product.productName}" 
                        class="rounded-lg shadow-lg mx-auto" style="max-width: 300px;">
                    </div>
                `);
            }

            // TODO: Add links to Add to Cart and Continue Shopping
            addToCartURL = `/addcart?id=${product.productId}&name=${encodeURIComponent(product.productName)}&price=${encodeURIComponent(product.productPrice)}`;
            res.write(`
                <div class="text-left mb-10 w-full">
                    <p class="text-xl text-left"><span class="text-gray-400">Category:</span> ${product.categoryName}</p>
                    <p class="text-xl text-left"><span class="text-gray-400">Description:</span> ${product.productDesc}</p>
                    <p class="text-xl text-left "><span class="text-gray-400">Price:</span> 
                        <span class="text-green-400">
                            $${product.productPrice.toFixed(2)}
                        </span>
                    </p>
                </div>
                <div class="flex justify-center mt-5 items-center space-x-2">
                    <div class="">
                        <a href="javascript:void(0);" class="btn-red" onclick="window.history.back();">
                            &larr; Back
                        </a>
                    </div>
                    <div>
                        <a href="${addToCartURL}" class="btn ">
                            Add to Cart &rarr;
                       </a>
                    </div>
                </div>
            `);

            res.end()
        } catch (err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();

    res.write('</div>');

    res.write(`
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const navbar = document.querySelector('nav');
                const navhint = document.getElementById('navhint');

                // Reveal navhint on hover
                navbar.addEventListener('mouseenter', function () {
                    navhint.classList.remove('opacity-100');
                    navhint.classList.add('opacity-0');
                });

                navbar.addEventListener('mouseleave', function () {
                    navhint.classList.remove('opacity-0');
                    navhint.classList.add('opacity-100');
                });
            });
        </script>
        `);
    res.write('</body>');
});

module.exports = router;
