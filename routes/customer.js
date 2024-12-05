const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    req.session.user = "rin";
    req.session.userid = "2";

    // Fetch customer data from the database
    (async function () {
        try {
            res.write('<title>PC8th Customer Information</title>');
            res.write('<link href="/style.css" rel="stylesheet">');
            res.write('<body class="text-white bg-slate-600">');

            res.write(`<nav class="z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
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

            let pool = await sql.connect(dbConfig);

            // Ensure that req.session.userid exists and is valid
            if (!req.session.userid) {
                res.write('<div class="p-4 bg-red-500 text-white"><h3>Error: User not logged in</h3></div>');
                res.end();
                return;
            }

            let result = await pool.request()
                .input('customerId', sql.Int, req.session.userid)
                .query("SELECT * FROM Customer WHERE customerId = @customerId");

            if (result.recordset.length === 0) {
                res.write('<div class="p-4 bg-red-500 text-white"><h3>Error: Customer not found</h3></div>');
                res.end();
                return;
            }

            let customer = result.recordset[0];

            res.write('<div class="opacity-0 animate-fade-in-instant">');
            res.write('<div class="pb-52"> </div>');
            res.write('<h1 class="text-7xl my-5 font-light text-center">Customer Information</h1>');
            res.write('<div class="container mx-auto px-4 max-w-4xl">');

            // Grid layout for customer information
            res.write('<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">');

            // Displaying customer details in grid format
            res.write(`
                <div class="card">
                    <span class="card-text-gray">Customer ID:</span> <span>${customer.customerId}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">First Name:</span> <span>${customer.firstName}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">Last Name:</span> <span>${customer.lastName}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">Phone:</span> <span>${customer.phonenum}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">Email:</span> <span>${customer.email}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">Address:</span> <span>${customer.address}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">City:</span> <span>${customer.city}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">State:</span> <span>${customer.state}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">Postal Code:</span> <span>${customer.postalCode}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">Country:</span> <span>${customer.country}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">User ID:</span> <span>${customer.userid}</span>
                </div>
                <div class="card">
                    <span class="card-text-gray">Password:</span> <span>${customer.password}</span>
                </div>

            `);

            res.write('</div>'); // End of grid
            res.write('</div>'); // End of container
            // After customer details query, add:
            let orderHistory = await pool.request()
                .input('customerId', sql.Int, req.session.userid)
                .query(`SELECT os.orderId, os.orderDate, os.totalAmount,
                            op.quantity, op.price,
                            p.productName, p.productDesc
                        FROM ordersummary os
                        JOIN orderproduct op ON os.orderId = op.orderId
                        JOIN product p ON op.productId = p.productId
                        WHERE os.customerId = @customerId
                        ORDER BY os.orderDate DESC
                    `);
            res.write(`<h2 class="text-4xl  my-6 font-light text-center">Order History</h2>`);
            // After customer info display, before res.end():
            res.write(`<div class="m-6 w-3/4 grid grid-cols-2 gap-4 mx-auto">
        ${orderHistory.recordset.length === 0 ?
                    '<p class="text-center text-slate-400">No order history found</p>' :
                    Object.values(orderHistory.recordset.reduce((acc, order) => {
                        if (!acc[order.orderId]) {
                            acc[order.orderId] = {
                                orderId: order.orderId,
                                orderDate: new Date(order.orderDate).toLocaleDateString(),
                                totalAmount: order.totalAmount,
                                items: []
                            };
                        }
                        acc[order.orderId].items.push({
                            productName: order.productName,
                            quantity: order.quantity,
                            price: order.price
                        });
                        return acc;
                    }, {})).map(order => `
                                    <div class="text-xl bg-slate-800 rounded-lg shadow-lg mb-6 p-6">
                                        <div class="flex justify-between items-center mb-4">
                                            <div class="text-slate-400">Order ID: <span class="text-white">#${order.orderId}</span></div>
                                            <div class="text-slate-400">Date: <span class="text-white">${order.orderDate}</span></div>
                                        </div>
                                        <div class="grid grid-cols-3 gap-4 text-sm mb-2 border-b border-slate-700">
                                            <div class="text-slate-400">Product</div>
                                            <div class="text-slate-400 text-center">Quantity</div>
                                            <div class="text-slate-400 text-right">Price</div>
                                        </div>
                                        ${order.items.map(item => `
                                            <div class="grid items-center grid-cols-3 gap-4 py-2 text-sm border-b border-slate-700">
                                                <div class="text-white text-left">${item.productName}</div>
                                                <div class="text-white text-center">${item.quantity}</div>
                                                <div class="text-green-400 text-right">$${item.price.toFixed(2)}</div>
                                            </div>
                                        `).join('')}
                                        <div class="mt-4 pt-4 ">
                                            <div class="text-right text-slate-400">Total: <span class="text-green-400 font-semibold">$${order.totalAmount.toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                `).join('')}
                        </div>
                    `);


            res.write('</body>');
            res.end();

        } catch (err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
