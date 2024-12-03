const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', async function (req, res, next) {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.write('<title>PC8th Order List</title>');
        res.write('<link href="/style.css" rel="stylesheet">');
        res.write('<body class="text-white bg-slate-600">');
        res.write(`<nav class="t1000e z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
                        <h1 id="navhint" class="t500e opacity-0 text-7xl">&larr;</h1>
                        <!-- Logo -->
                        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">PC8th</a>

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
                                <div class="opacity-100 group-hover:opacity-100 t200e">Order List</div>
                                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-50 group-hover:scale-x-100 t200e">
                                </div>
                            </a>

                            <!-- My Cart -->
                            <a href="/showcart" class="relative group p-3">
                                <div class="opacity-50 group-hover:opacity-100 t200e">My Cart</div>
                                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                                </div>
                            </a>
                        </div>

                        <!-- Login -->
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
        res.write('<div class=" opacity-0 animate-fade-in-instant">');
        res.write('<div class="pb-52"> </div>');

        let pool = await sql.connect(dbConfig);
        console.log('Connection successful! Executing query...');

        let sqlQuery = `
            SELECT o.orderId, o.orderDate, o.totalAmount, 
                   c.customerId, c.firstName, c.lastName
            FROM ordersummary o 
            JOIN customer c 
            ON o.customerId = c.customerId
            ORDER BY o.orderId ASC
        `;
        let results = await pool.request().query(sqlQuery);

        res.write('<div class="max-w-5xl mx-auto p-4">');

        if (results.recordset.length > 0) {
            for (const order of results.recordset) {
                let productsQuery = `
                    SELECT op.productId, op.quantity, op.price,
                           p.productName
                    FROM orderproduct op
                    JOIN product p ON op.productId = p.productId
                    WHERE op.orderId = ${order.orderId}
                `;
                let productResults = await pool.request().query(productsQuery);

                res.write(`
                    <div class="mb-8 bg-slate-800 p-6 rounded-lg shadow-md">
                        <div>
                            <h2 class="text-2xl font-semibold ">Order ID: ${order.orderId}</h2>
                            <p class="text-gray-400">Placed by: <span class="text-white">${order.firstName} ${order.lastName}</span> (ID: <span class='text-white'>${order.customerId}</span>)</p>
                            <p class="text-gray-400">Placed on: <span class="text-white">${moment(order.orderDate).format('YYYY-MM-DD')}</span></p>
                        </div>
                        <div class="mt-6 bg-gray-700 p-4 rounded-md">
                            <h3 class="text-xl font-medium text-blue-300 mb-4">Order Items</h3>
                            <div class="grid grid-cols-5 gap-4 text-gray-300 font-semibold border-b border-gray-600 pb-2">
                                <p>Product Name</p>
                                <p>Product ID</p>
                                <p>Quantity</p>
                                <p>Price</p>
                                <p>Subtotal</p>
                            </div>
                `);

                productResults.recordset.forEach(product => {
                    res.write(`
                        <div class="grid grid-cols-5 gap-4 text-gray-300 items-center mt-2 border-b border-gray-600 py-2">
                            <p>${product.productName}</p>
                            <p>${product.productId}</p>
                            <p>${product.quantity}</p>
                            <p>$${product.price.toFixed(2)}</p>
                            <p class="text-green-400">$${(product.quantity * product.price).toFixed(2)}</p>
                        </div>
                    `);
                });

                res.write(`
                            <div class="mt-4 text-right">
                                <p class="text-lg font-bold text-gray-300">Total Amount:</p>
                                <p class="text-2xl font-bold text-green-400">$${order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                `);
            }
        } else {
            res.write('<p class="text-center text-gray-400">No orders found.</p>');
        }


        res.write(`</div>
                </div>
                <script>
                    document.addEventListener('DOMContentLoaded', function () {
                    const navbar = document.querySelector('nav');
                    const navhint = document.getElementById('navhint');
                    let lastScrollTop = 0;
                    const scrollThreshold = 500;

                    window.addEventListener('scroll', function () {
                        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

                        if (currentScrollTop > scrollThreshold) {
                        // Scrolled past 500px
                        navbar.classList.add('translate-x-[45.83%]');
                        navbar.classList.add('hover:-translate-x-1/2');
                        navhint.classList.remove('opacity-0');
                        navhint.classList.add('opacity-100');
                        } else {
                        // Back to top or above threshold
                        navbar.classList.remove('translate-x-[45.83%]');
                        navbar.classList.remove('hover:-translate-x-1/2');
                        navhint.classList.remove('opacity-100');
                        navhint.classList.add('opacity-0');
                        }

                        lastScrollTop = currentScrollTop;
                    });

                    // Add hover effect to hide navhint
                    navbar.addEventListener('mouseenter', function () {
                        navhint.classList.remove('opacity-100');
                        navhint.classList.add('opacity-0');
                    });

                    navbar.addEventListener('mouseleave', function () {
                        if (window.pageYOffset > scrollThreshold) {
                        navhint.classList.remove('opacity-0');
                        navhint.classList.add('opacity-100');
                        }
                    });
                    });
                </script>
            </body>`);
        res.end();

    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).send('An error occurred while fetching orders');
    } finally {
        console.log('Closing database connection...');
        sql.close();
    }
});

module.exports = router;