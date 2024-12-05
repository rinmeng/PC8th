const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");


// DO NOT TOUCH THIS WE ARE DONE WITH MAIN.
router.get("/", function (req, res, next) {
  // remove this line when done testing
  req.session.user = "admin";
  req.session.userid = "1";

  // TODO: Include files auth.jsp and jdbc.jsp

  res.setHeader("Content-Type", "text/html");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write(`<title>Admin Page</title>`);

  if (!(req.session.user === "admin")) {
    res.write(`
    <body class="text-white bg-slate-600 h-screen">
      <nav class="z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
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
      </nav>

      <div class="pb-52"></div>

        <div class="text-center mp5 opacity-0 animate-fade-in-instant">
          <!-- Header Section -->
          <div class="text-center space-y-4">
              <h1 class="text-7xl font-extralight text-white tracking-tight">Administration</h1>
              <h1 class="text-4xl font-extrabold text-red-400">
                You do not have permission to view this page.
              </h1>
              ${req.session.authenticated ? `
                <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
                <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
              `: `
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
              `}
          </div>
          <!-- Login Button -->
          <div class="flex justify-center">
              <form action="/login" method="get">
                  <button class="btn">
                      Login &rarr;
                  </button>
              </form>
          </div>
        </div>
    </body>`);
    return;
  }

  res.write(`<body class="text-white bg-slate-600 h-screen">`);
  res.write(`
      <! admin nav bar -->
      <nav class="t1000e translate-x-[-145.83%] hover:translate-x-[-50%] hover:z-20
      z-10 mt-6 fixed left-1/2 transform  w-11/12 mx-auto glass-slate rounded-full flex flex-row-reverse justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&rarr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/admin">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Admin</sub>
        </a>
        <!-- Navigation Links -->
        <div class="flex justify-center w-full text-md">
            <a href="/admin/orders" class="relative group p-3 px-5">
                <div class="opacity-50 group-hover:opacity-100 t200e">Sales</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- Order List -->
            <a href="/admin/customers" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Customers</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- My Cart -->
            <a href="/admin/ship" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Ship</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/addProduct" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Add Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/updateProducts" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Update Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>
        </div>
      </nav>
      <!-- Other nav bar -->
      <nav class="t1000e translate-x-[45.83%] z-10 mt-6 fixed left-1/2 transform hover:-translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&larr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Customer</sub>
        </a>

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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>
      `);
  // Admin is logged in
  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      salesQuery = `
              SELECT CAST(orderDate AS DATE) AS orderDate, SUM(totalAmount) AS total
              FROM ordersummary
              GROUP BY CAST(orderDate AS DATE)
              ORDER BY orderDate ASC
          `;

      let result = await pool.request().query(salesQuery);
      const salesData = result.recordset;
      console.log(salesData);
      res.write('<div class=" opacity-0 animate-fade-in-instant">');
      res.write(`<div class="pb-16"></div>
        <div class="space-y-10 pb-10">
          <div class="title text-center mb-14">
            <h1 class="text-white">Admin Dashboard</h1>
          </div>
          <div class="flex flex-col bg-slate-800 py-10 w-3/4 justify-center mx-auto rounded-xl">
            <div class="flex h-auto flex-col text-xl space-y-2 rounded-xl ">
              <h1 class="title text-center text-5xl py-4">Here's a quick view of your sales.</h1>
              <div class="flex justify-center m-10 bg-slate-700 w-auto h-auto p-5 rounded-xl">
                  <canvas id="salesChart" width="400" height="200"></canvas>
              </div>
            </div>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script>
              const salesData = ${JSON.stringify(salesData)};
              const labels = salesData.map(data => data.orderDate);
              const totals = salesData.map(data => data.total);
              const formattedLabels = salesData.map(function(data) {
                        var date = new Date(data.orderDate);
                        var day = date.getDate().toString().padStart(2, '0');
                        var month = (date.getMonth() + 1).toString().padStart(2, '0');
                        var year = date.getFullYear();
                        return day + '-' + month + '-' + year;
                    });
              document.addEventListener('DOMContentLoaded', function () {
                  const ctx = document.getElementById('salesChart').getContext('2d');
                  new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: formattedLabels,
                        datasets: [{
                            label: 'Total Sales',
                            data: totals,
                            borderColor: 'rgba(255,255,255,1)',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            borderWidth: 3,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date',
                                    color: 'rgba(150,150,255,1)',
                                    font : {
                                        size: 25
                                        }
                                },
                                grid: {
                                    color: 'rgba(255,255,255,0.2)',
                                },
                                ticks: {
                                    color: 'rgba(255,255,255,0.7)',
                                }
                                
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Cash Flow',
                                    color: 'rgba(0,200,50,1)',
                                    font : {
                                        size: 25
                                        }
                                },
                                grid: {
                                    color: 'rgba(255,255,255,0.2)',
                                },
                                ticks: {
                                    color: 'rgba(255,255,255,0.7)',
                                    callback: function(value, index, values) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: 'rgba(255,255,255,0.7)'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Sales Summary',
                                color: 'rgba(255,255,255,1)'
                            }
                        }
                    }
                });
              });
          </script>
        `);
      res.write(`</div>`);
      res.write(`</body>`);
      res.end();
    } catch (err) {
      console.log(err);
      res.end();
    }
  })();


});

// DO NOT TOUCH THIS WE ARE DONE WITH ORDERS.
router.get("/orders", function (req, res, next) {
  // remove this line when done testing
  req.session.user = "admin";
  req.session.userid = "1";

  res.setHeader("Content-Type", "text/html");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write(`<title>Admin Page</title>`);

  if (!(req.session.user === "admin")) {
    res.write(`<body class="text-white bg-slate-600 h-screen">`);
    res.write(`
      <nav class="z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>`);

    res.write(`
      <div class="pb-52"></div>
      <div class="text-center mp5 opacity-0 animate-fade-in-instant">
        <!-- Header Section -->
        <div class="text-center space-y-4">
            <h1 class="text-7xl font-extralight text-white tracking-tight">Administration</h1>
            <h1 class="text-4xl font-extrabold text-red-400">
              You do not have permission to view this page.
            </h1>
            ${req.session.authenticated ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `: `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `}
        </div>
        
        <!-- Login Button -->
        <div class="flex justify-center">
            <form action="/login" method="get">
                <button class="btn">
                    Login &rarr;
                </button>
            </form>
        </div>
      </div>
    </body>   
    `);

    res.end();
    return;
  }
  // Admin is logged in
  (async function () {
    try {
      let pool = await sql.connect(dbConfig);
      salesQuery = `
            SELECT CAST(orderDate AS DATE) AS orderDate, SUM(totalAmount) AS total
            FROM ordersummary
            GROUP BY CAST(orderDate AS DATE)
            ORDER BY total DESC
        `;
      let result = await pool.request().query(salesQuery);
      res.write('<body class="text-white bg-slate-600 h-screen">');
      res.write(`
      <! admin nav bar -->
      <nav class="t1000e translate-x-[-145.83%] hover:translate-x-[-50%] hover:z-20
      z-10 mt-6 fixed left-1/2 transform  w-11/12 mx-auto glass-slate rounded-full flex flex-row-reverse justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&rarr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/admin">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Admin</sub>
        </a>
        <!-- Navigation Links -->
        <div class="flex justify-center w-full text-md">
            <a href="/admin/orders" class="relative group p-3 px-5">
                <div class="opacity-100 group-hover:opacity-100 t200e">Sales</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-50 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- Order List -->
            <a href="/admin/customers" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Customers</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- My Cart -->
            <a href="/admin/ship" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Ship</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/addProduct" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Add Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/updateProducts" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Update Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>
        </div>
      </nav>
      <!-- Other nav bar -->
      <nav class="t1000e translate-x-[45.83%] z-10 mt-6 fixed left-1/2 transform hover:-translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&larr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Customer</sub>
        </a>

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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>
      `);
      res.write(`
          <!-- Header -->
          <div class="container mx-auto px-4 py-12  opacity-0 animate-fade-in-instant">
            <div class="text-center mb-12">
              <h1 class="title mb-4">Sales Reports</h1>
              <p class="text-slate-300 text-xl">Daily Revenue Overview</p>
            </div>

            <!-- Grid Container -->
            <div class="max-w-6xl mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <!-- Grid Header -->
              <div class="grid grid-cols-2 gap-4 bg-slate-900 p-6 border-b border-slate-700">
                <div class="text-lg font-semibold text-white px-6">
                Order Date (DD-MM-YYYY)
                </div>
                <div class="text-lg font-semibold text-white px-6">
                Total Amount
                </div>
              </div>

              <!-- Grid Body -->
              <div class="divide-y divide-slate-700">
      `);

      for (let i = 0; i < result.recordset.length; i++) {
        let orderDate = new Date(result.recordset[i].orderDate);
        let day = ("0" + orderDate.getDate()).slice(-2);
        let month = ("0" + (orderDate.getMonth() + 1)).slice(-2);
        let year = orderDate.getFullYear();
        let formattedDate = `${day}-${month}-${year}`;

        res.write(`
          <div class="grid grid-cols-2 gap-4 p-6 hover:bg-slate-700 transition-colors duration-200">
            <div class="text-slate-300 px-6">${formattedDate}</div>
            <div class="text-slate-300 px-6">
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                $${result.recordset[i].total.toFixed(2)}
              </span>
            </div>
          </div>
        `);
      }

      res.write(`
                </div>
              </div>

              <!-- Summary Card -->
              <div class="mt-8 text-center">
                <div class="inline-block bg-slate-800 rounded-lg p-6 shadow-lg">
                  <p class="text-slate-300 mb-2">Total Records</p>
                  <p class="text-3xl font-bold text-white">${result.recordset.length}</p>
                </div>
              </div>
            </div>
          </body>
      `);
      res.end();

      return;
    } catch (err) {
      console.dir(err);
      res.write(err + "");
      res.end();
    }
  })();
});

// DO NOT TOUCH THIS WE ARE DONE WITH CUSTOMERS.
router.get("/customers", function (req, res, next) {
  // remove this line when done testing
  req.session.user = "admin";
  req.session.userid = "1";

  res.setHeader("Content-Type", "text/html");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write(`<title>Admin Page</title>`);

  if (!(req.session.user === "admin")) {
    res.write(`
    <body class="text-white bg-slate-600 h-screen">
      <nav class="z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
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
            ${req.session.authenticated
        ? `
                <p class="text-white px-3 w-full">Hey,
                  <a href="/customer?userid={{userid}}" class="font-bold opacity-50 hover:opacity-100 t200e">
                      <strong>${req.session.user}</strong>
                  </a>
                </p>
                <a href="/logout" class="opacity-50 p-3 hover:opacity-100 t200e px-10">Logout</a>
            `
        : `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `
      }
        </div>
      </nav>

      <div class="pb-52"></div>

      <div class="text-center mp5 opacity-0 animate-fade-in-instant">
        <!-- Header Section -->
        <div class="text-center space-y-4">
            <h1 class="text-7xl font-extralight text-white tracking-tight">Administration</h1>
            <h1 class="text-4xl font-extrabold text-red-400">
              You do not have permission to view this page.
            </h1>
            ${req.session.authenticated ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `: `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `}
        </div>
        
        <!-- Login Button -->
        <div class="flex justify-center">
            <form action="/login" method="get">
                <button class="btn">
                    Login &rarr;
                </button>
            </form>
        </div>
      </div>
    </body>   
    `);
    res.end();
    return;
  }
  // Admin is logged in
  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      let query = `
        SELECT customerId, firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password
        FROM customer
      `;

      let result = await pool.request().query(query);

      console.log(result);
      res.write('<body class="text-white bg-slate-600 h-screen">');
      // Admin nav bar
      res.write(`
      <! admin nav bar -->
      <nav class="t1000e translate-x-[-145.83%] hover:translate-x-[-50%] hover:z-20
      z-10 mt-6 fixed left-1/2 transform  w-11/12 mx-auto glass-slate rounded-full flex flex-row-reverse justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&rarr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/admin">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Admin</sub>
        </a>
        <!-- Navigation Links -->
        <div class="flex justify-center w-full text-md">
            <a href="/admin/orders" class="relative group p-3 px-5">
                <div class="opacity-50 group-hover:opacity-100 t200e">Sales</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- Order List -->
            <a href="/admin/customers" class="relative group p-3">
                <div class="opacity-100 group-hover:opacity-100 t200e">Customers</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-50 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- My Cart -->
            <a href="/admin/ship" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Ship</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/addProduct" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Add Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/updateProducts" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Update Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>
        </div>
      </nav>
      <!-- Other nav bar -->
      <nav class="t1000e translate-x-[45.83%] z-10 mt-6 fixed left-1/2 transform hover:-translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&larr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Customer</sub>
        </a>

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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>
      `);
      res.write(`<div class="w-full container mx-auto px-1 py-12  opacity-0 animate-fade-in-instant">`);
      res.write(`
            <div class="text-center mb-12">
              <h1 class="title mb-4">Customers</h1>
              <p class="text-slate-300 text-xl">Each customers info</p>
            </div>`);
      for (let i = 0; i < result.recordset.length; i++) {
        let {
          customerId,
          firstName,
          lastName,
          email,
          phonenum,
          address,
          city,
          state,
          postalCode,
          country,
          userid,
          password,
        } = result.recordset[i];

        if (i % 2 === 0) {
          bgColor = "bg-slate-800";
        } else {
          bgColor = "bg-slate-900";
        }

        res.write(`
          <div class="grid grid-cols-3 gap-4 p-6 transition-colors duration-200 border-b border-slate-200">
            <div class="text-slate-300 ${bgColor} p-6 rounded-lg">Customer ID: ${customerId}</div>
            <div class="text-slate-300 px-6">
              First Name: 
              <span class="font-mono bg-slate-700 px-3 py-1 rounded">
                ${firstName}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              Last Name:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${lastName}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              Email:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${email}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              Phone Number:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${phonenum}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              Address:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${address}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              City:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${city}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              State:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${state}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              Postal Code:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${postalCode}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              Country:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${country}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              User ID:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${userid}
              </span>
            </div>
            <div class="text-slate-300 px-6">
              Password:
              <span class="font-mono bg-slate-900 px-3 py-1 rounded">
                ${password}
              </span>
            </div>
          </div>
          
        `);
      }

      res.write(` 
              <!-- Summary Card -->
              <div class="mt-8 text-center">
                <div class="inline-block bg-slate-800 rounded-lg p-6 shadow-lg">
                  <p class="text-slate-300 mb-2">Total Customer</p>
                  <p class="text-3xl font-bold text-white">${result.recordset.length}</p>
                </div>
              </div>
            </div>
            </div>
          </body>
      `);

      res.end();
    } catch (err) {
      console.dir(err);
      res.write(err + "");
      res.end();
    }
  })();
});

// DO NOT TOUCH THIS WE ARE DONE WITH SHIP.
router.get("/ship", function (req, res, next) {
  // remove this line when done testing
  req.session.user = "admin";
  req.session.userid = "1";

  res.setHeader("Content-Type", "text/html");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write('<body class="text-white bg-slate-600">');
  // Authorization check for admin
  if (!(req.session.user === "admin")) {
    res.write(`<body class="text-white bg-slate-600 h-screen">`);
    res.write(`
      <nav class="z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>`);

    res.write(`
      <div class="pb-52"></div>
      <div class="text-center mp5 opacity-0 animate-fade-in-instant">
        <!-- Header Section -->
        <div class="text-center space-y-4">
            <h1 class="text-7xl font-extralight text-white tracking-tight">Administration</h1>
            <h1 class="text-4xl font-extrabold text-red-400">
              You do not have permission to view this page.
            </h1>
            ${req.session.authenticated ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `: `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `}
        </div>
        
        <!-- Login Button -->
        <div class="flex justify-center">
            <form action="/login" method="get">
                <button class="btn">
                    Login &rarr;
                </button>
            </form>
        </div>
      </div>
    </body>   
    `);

    res.end();
    return;
  }
  // Admin is logged in
  res.write(`
      <! admin nav bar -->
      <nav class="t1000e translate-x-[-145.83%] hover:translate-x-[-50%] hover:z-20
      z-10 mt-6 fixed left-1/2 transform  w-11/12 mx-auto glass-slate rounded-full flex flex-row-reverse justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&rarr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/admin">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Admin</sub>
        </a>
        <!-- Navigation Links -->
        <div class="flex justify-center w-full text-md">
            <a href="/admin/orders" class="relative group p-3 px-5">
                <div class="opacity-50 group-hover:opacity-100 t200e">Sales</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- Order List -->
            <a href="/admin/customers" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Customers</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- My Cart -->
            <a href="/admin/ship" class="relative group p-3">
                <div class="opacity-100 group-hover:opacity-100 t200e">Ship</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-50 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/addProduct" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Add Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/updateProducts" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Update Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>
        </div>
      </nav>
      <!-- Other nav bar -->
      <nav class="t1000e translate-x-[45.83%] z-10 mt-6 fixed left-1/2 transform hover:-translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&larr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Customer</sub>
        </a>

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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>
      `);
  res.write('<div class="opacity-0 animate-fade-in-instant">');
  res.write(`<div class="py-20"><h1 class="title text-center ">Process Order</h1></div>`);
  res.write(`
    <main class="pb-10">
      <div class="flex justify-center items-center m-auto w-1/3 glass-slate rounded-xl ">
        <form action="ship" method="get" 
        class="flex flex-col p-5 rounded-lg w-full my-0 space-y-4">
          <h1 class="text-4xl font-semibold text-center mb-2">Ship Order</h1>
            <input 
              type="text" 
              name="orderId" 
              placeholder="Order ID" 
              class="inner-forms text-center text-white"
              required
            />
          <button type="submit" class="btn-green">
            Ship Order &rarr;
          </button>
        </form>
      </div>
  `);

  // Transaction logic
  if (req.query.orderId) {
    (async function () {
      try {
        let pool = await sql.connect(dbConfig);

        let sqlQuery = `
          SELECT 
            p.productName, 
            op.productId, 
            op.quantity AS orderedQuantity, 
            SUM(pi.quantity) AS totalAvailableQuantity 
          FROM orderproduct op
          JOIN product p ON op.productId = p.productId
          JOIN productinventory pi ON p.productId = pi.productId
          WHERE op.orderId = @orderId
          AND pi.warehouseId = 1
          GROUP BY p.productName, op.productId, op.quantity;
        `;

        const result = await pool
          .request()
          .input("orderId", sql.Int, req.query.orderId)
          .query(sqlQuery);

        if (result.recordset.length === 0) {
          res.write(`
            <h1 class="w-1/2 mx-auto rounded-xl text-center mt-8 text-white bg-red-600 py-2 text-2xl">
             Invalid Order ID or no products found for the order ${req.query.orderId}.
            </h1>
          `);
          res.end();
          return;
        }

        let sufficientInventory = true;

        // Display order details with Grid Layout
        res.write(`
          <section class="mt-8">
            <h2 class="text-4xl font-semibold text-center mb-4">
              Order Details (Order ID: ${req.query.orderId})
            </h2>
            <!-- Grid Container -->
            <div class="max-w-6xl mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <!-- Grid Header -->
              <div class="grid grid-cols-6 gap-4 bg-slate-900 p-6 border-b border-slate-700">
                <div class="text-lg font-semibold text-white px-6">Product Name</div>
                <div class="text-lg font-semibold text-white px-6">Product ID</div>
                <div class="text-lg font-semibold text-white px-6">Ordered Quantity</div>
                <div class="text-lg font-semibold text-white px-6">Previous Inventory</div>
                <div class="text-lg font-semibold text-white px-6">New Inventory</div>
                <div class="text-lg font-semibold text-white px-6">Status</div>
              </div>

              <!-- Grid Body -->
              <div class="divide-y divide-slate-700">
        `);

        let newInventories = [];
        let productIds = [];
        for (let row of result.recordset) {
          const newInventory =
            row.totalAvailableQuantity - row.orderedQuantity;
          const status = newInventory < 0 ? "Unavailable" : "Available";
          if (newInventory < 0) sufficientInventory = false;

          newInventories.push(newInventory);
          productIds.push(row.productId);

          res.write(`
                <div class="grid grid-cols-6 gap-4 p-6 hover:bg-slate-700 transition-colors duration-200">
                  <div class="text-slate-300 px-6">${row.productName}</div>
                  <div class="text-slate-300 px-6">${row.productId}</div>
                  <div class="text-slate-300 px-6">${row.orderedQuantity}</div>
                  <div class="text-slate-300 px-6">${row.totalAvailableQuantity
            }</div>
                  <div class="text-slate-300 px-6">
                    <span class="font-mono ${newInventory >= 0 ? "" : "opacity-50"
            }">
                      ${newInventory >= 0 ? newInventory : "N/A"}
                    </span>
                  </div>
                  <div class="text-slate-300 px-6">
                    <span class="font-mono ${status === "Unavailable"
              ? "text-red-500"
              : "text-green-500"
            }">
                      ${status}
                    </span>
                  </div>
                </div>
            `);
        }

        res.write(`
              </div>
            </div>
          </section>
          `);

        // Shipment Status
        if (!sufficientInventory) {
          res.write(`
            <h1 class="w-1/2 mx-auto rounded-xl text-center mt-8 text-white bg-red-600 py-2 text-2xl">
              Shipment not fulfilled due to insufficient inventory.
            </h1>
          `);
        } else {
          await pool.request().input("orderId", sql.Int, req.query.orderId)
            .query(`
              INSERT INTO shipment (shipmentDate, shipmentDesc, warehouseId)
              VALUES (GETDATE(), 'Shipment for order @orderId', 1);
            `);

          const updateInventoryQuery = `
            UPDATE productinventory 
            SET quantity = @newInventory
            WHERE productId = @productId
            AND warehouseId = 1;
          `;

          for (let i = 0; i < newInventories.length; i++) {
            await pool
              .request()
              .input("newInventory", sql.Int, newInventories[i])
              .input("productId", sql.Int, productIds[i])
              .query(updateInventoryQuery);
          }

          res.write(`
            <h1 class="w-1/2 mx-auto rounded-xl text-center mt-8 text-white bg-green-600 py-2 text-2xl">
              Shipment fulfilled successfully.
            </h1>
          `);
        }

        res.write("</main></body>");
        res.end();
      } catch (err) {
        console.error(err);
        res.write(`<p>Error occurred: ${err.message}</p>`);
        res.end();
      }
    })();
  } else {
    res.write("</div>");
    res.write("</main></body>");
    res.end();
  }

});

// DO NOT TOUCH THIS WE ARE DONE WITH SHIPMENTS.
router.get("/addProduct", function (req, res) {
  // remove this line when done testing
  req.session.user = "admin";
  req.session.userid = "1";

  res.setHeader("Content-Type", "text/html");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write('<body class="text-white bg-slate-600">');

  if (!(req.session.user === "admin")) {
    res.write(`
    <body class="text-white bg-slate-600 h-screen">
      <nav class="z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
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
            ${req.session.authenticated
        ? `
                <p class="text-white px-3 w-full">Hey,
                  <a href="/customer?userid={{userid}}" class="font-bold opacity-50 hover:opacity-100 t200e">
                      <strong>${req.session.user}</strong>
                  </a>
                </p>
                <a href="/logout" class="opacity-50 p-3 hover:opacity-100 t200e px-10">Logout</a>
            `
        : `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `
      }
        </div>
      </nav>

      <div class="pb-52"></div>

      <div class="text-center mp5 opacity-0 animate-fade-in-instant">
        <!-- Header Section -->
        <div class="text-center space-y-4">
            <h1 class="text-7xl font-extralight text-white tracking-tight">Administration</h1>
            <h1 class="text-4xl font-extrabold text-red-400">
              You do not have permission to view this page.
            </h1>
            ${req.session.authenticated ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `: `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `}
        </div>
        
        <!-- Login Button -->
        <div class="flex justify-center">
            <form action="/login" method="get">
                <button class="btn">
                    Login &rarr;
                </button>
            </form>
        </div>
      </div>
    </body>   
    `);
    res.end();
    return;
  }

  res.write('<body class="text-white bg-slate-600 h-screen overflow-x-hidden">');
  // Admin nav bar
  res.write(`
      <! admin nav bar -->
      <nav class="t1000e translate-x-[-145.83%] hover:translate-x-[-50%] hover:z-20
      z-10 mt-6 fixed left-1/2 transform  w-11/12 mx-auto glass-slate rounded-full flex flex-row-reverse justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&rarr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/admin">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Admin</sub>
        </a>
        <!-- Navigation Links -->
        <div class="flex justify-center w-full text-md">
            <a href="/admin/orders" class="relative group p-3 px-5">
                <div class="opacity-50 group-hover:opacity-100 t200e">Sales</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- Order List -->
            <a href="/admin/customers" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Customers</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- My Cart -->
            <a href="/admin/ship" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Ship</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/addProduct" class="relative group p-3">
                <div class="opacity-100 group-hover:opacity-100 t200e">Add Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-50 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/updateProducts" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Update Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>
        </div>
      </nav>
      <!-- Other nav bar -->
      <nav class="t1000e translate-x-[45.83%] z-10 mt-6 fixed left-1/2 transform hover:-translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&larr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Customer</sub>
        </a>

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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>
      `);

  res.write(`<div class="w-full opacity-0 animate-fade-in-instant p-5">`);


  res.write(`<div><h1 class="title text-center py-10">Add Product</h1></div>`);
  // Form to add product
  res.write(`
        <div class="w-full h-auto flex items-center justify-center p-5">
          <div class="w-full max-w-4xl forms shadow-lg rounded-lg p-8 text-white">
          
            <form
              class="grid grid-cols-1 gap-6"
              id="productForm"
              method="POST"
              action="addProduct"
            >
              <!-- Product Name -->
              <div>
                <label for="productname" class="block text-sm font-medium ">Product Name:</label>
                <input
                  id="productname"
                  name="productname"
                  type="text"
                  placeholder="e.g Nvidia RTX 3060"
                  class="inner-forms"
                  required
                />
              </div>

              <!-- Product Price -->
              <div>
                <label for="productprice" class="block text-sm font-medium ">Product Price:</label>
                <input
                  id="productprice"
                  name="productprice"
                  type="number"
                  min="1"
                  step="any"
                  placeholder="e.g 299.99"
                  class="inner-forms"
                  required
                />
              </div>

              <!-- Product Description -->
              <div>
                <label for="productdescription" class="block text-sm font-medium ">Product Description:</label>
                <input
                  id="productdescription"
                  name="productdescription"
                  type="text"
                  placeholder="8GB VRAM, Black, etc."
                  class="inner-forms"
                  required
                />
              </div>

              <!-- Product Image -->
              <div>
                <label for="productimage" class="block text-sm font-medium ">Product Image URL:</label>
                <input
                  id="productimage"
                  name="productimage"
                  type="url"
                  placeholder="e.g https://example.com/image.jpg"
                  class="inner-forms"
                  required
                />
              </div>

              <!-- Product Category -->
              <div>
                <label for="productcategory" class="block text-sm font-medium ">Product Category:</label>
                <select
                  id="productcategory"
                  name="productcategory"
                  class="inner-forms"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="1">CPU</option>
                  <option value="2">Motherboard</option>
                  <option value="3">RAM</option>
                  <option value="4">GPU</option>
                  <option value="5">PSU</option>
                  <option value="6">Cooling</option>
                  <option value="7">Storage</option>
                  <option value="8">Case</option>
                </select>
              </div>`);

  res.write(`
              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  class="btn w-full">
                  Add Product &rarr;
                </button>
              </div>
              <h1 class="text-center text-green-400">
              ${req.session.addProductMessage ? req.session.addProductMessage : ""}
              </h1>
            </form>
          </div>
        </div>
        `);
  if (req.session.addProductMessage) {
    req.session.addProductMessage = "";
  }

  res.write(`</div>`);
  res.write(`</body>`);
  res.end();
});

// DONT TOUCH THIS WE ARE DONE WITH ADDPRODUCTS
router.post("/addProduct", function (req, res) {
  // remove this line when done testing
  req.session.user = "admin";
  req.session.userid = "1";

  const body = req.body;

  const [productName, productPrice, productDescription, productImageURL, categoryId] = [
    body.productname.toString(),
    body.productprice.toString(),
    body.productdescription.toString(),
    body.productimage,
    body.productcategory,
  ];

  console.log("Product Image URL: ", productImageURL);

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      let query = `
        INSERT INTO product (productName, productPrice, productDesc, productImageURL, categoryId)
        VALUES (@productName, @productPrice, @productDescription, @productImageURL, @categoryId)
      `;

      await pool
        .request()
        .input("productName", sql.VarChar, productName)
        .input("productPrice", sql.Decimal, productPrice)
        .input("productDescription", sql.VarChar, productDescription)
        .input("productImageURL", sql.VarChar, productImageURL)
        .input("categoryId", sql.Int, categoryId)
        .query(query);
      req.session.addProductMessage = "Product added successfully";
      res.redirect("/admin/addProduct");
      res.end();
    } catch (err) {
      console.dir(err);
      req.session.addProductMessage = "Error adding product" + err;
      res.send(err + "");
    }
  })();
});

// TODO: We need to display the product once user clicks on the find product button
// to confirm that it is what we awant to update.
// after clicking it, it wont even display the form for you to update at all.
// try and fix it if you can. i think it has something to do with async function
router.get("/updateProducts", function (req, res) {
  req.session.user = "admin";
  req.session.userid = "1";
  res.setHeader("Content-Type", "text/html");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write('<body class="text-white bg-slate-600">');
  // Auth check
  if (!(req.session.user === "admin")) {
    res.write(`
    <body class="text-white bg-slate-600 h-screen">
      <nav class="z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
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
            ` }
        </div>
      </nav>

      <div class="pb-52"></div>

      <div class="text-center mp5 opacity-0 animate-fade-in-instant">
        <!-- Header Section -->
        <div class="text-center space-y-4">
            <h1 class="text-7xl font-extralight text-white tracking-tight">Administration</h1>
            <h1 class="text-4xl font-extrabold text-red-400">
              You do not have permission to view this page.
            </h1>
            ${req.session.authenticated ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `: `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `}
        </div>
        
        <!-- Login Button -->
        <div class="flex justify-center">
            <form action="/login" method="get">
                <button class="btn">
                    Login &rarr;
                </button>
            </form>
        </div>
      </div>
    </body>   
    `);
    res.end();
    return;
  }
  res.write('<body class="text-white bg-slate-600 h-screen overflow-x-hidden">');
  // Admin nav bar
  res.write(`
      <! admin nav bar -->
      <nav class="t1000e translate-x-[-145.83%] hover:translate-x-[-50%] hover:z-20
      z-10 mt-6 fixed left-1/2 transform  w-11/12 mx-auto glass-slate rounded-full flex flex-row-reverse justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&rarr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/admin">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Admin</sub>
        </a>
        <!-- Navigation Links -->
        <div class="flex justify-center w-full text-md">
            <a href="/admin/orders" class="relative group p-3 px-5">
                <div class="opacity-50 group-hover:opacity-100 t200e">Sales</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- Order List -->
            <a href="/admin/customers" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Customers</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <!-- My Cart -->
            <a href="/admin/ship" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Ship</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/addProduct" class="relative group p-3">
                <div class="opacity-100 group-hover:opacity-100 t200e">Add Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-50 group-hover:scale-x-100 t200e">
                </div>
            </a>

            <a href="/admin/updateProducts" class="relative group p-3">
                <div class="opacity-50 group-hover:opacity-100 t200e">Update Products</div>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e">
                </div>
            </a>
        </div>
      </nav>
      <!-- Other nav bar -->
      <nav class="t1000e translate-x-[45.83%] z-10 mt-6 fixed left-1/2 transform hover:-translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
       <!-- Logo -->
       <h1 id="navhint" class="t500e opacity-100 text-7xl">&larr;</h1>
        <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">
          PC8th<sub class="text-lg text-gray-300 p-0 m-0">Customer</sub>
        </a>

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
            `: `
                <a class="opacity-50 p-3 hover:opacity-100 t200e px-10" href="/login">Login</a>
            `}
        </div>
      </nav>
      `);
  // Update Product Page
  res.write(`
    <div class="w-full opacity-0 animate-fade-in-instant p-5">
      <h1 class="title text-center py-10">Update Product</h1>
      
      <!-- Product ID Search Form -->
      <div class="w-full h-auto flex items-center justify-center p-5">
        <div class="w-full max-w-4xl forms shadow-lg rounded-lg p-8 text-white">
          <form class="grid grid-cols-1 gap-6" method="GET" action="updateProducts">
            <div>
              <label for="productId" class="block text-sm font-medium">Enter Product ID:</label>
              <input
                id="productId"
                name="productId"
                type="number"
                placeholder="e.g. 1"
                class="inner-forms"
                required
              />
            </div>
            <button type="submit" class="btn w-full">
              Find Product &rarr;
            </button>
          </form>
        </div>
      </div>`);

  // TO FIX: This is where the product details should be displayed
  if (req.query.productId) {
    const productId = req.query.productId;
    (async function () {
      try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
          .input("productId", sql.Int, productId)
          .query(`
            SELECT * FROM product WHERE productId = @productId
          `);

        let product = result.recordset[0];

        // This is the forms to update the product
        res.write(`
            <div class="w-full h-auto flex items-center justify-center p-5">
              <div class="w-full max-w-4xl forms shadow-lg rounded-lg p-8 text-white">
                <form class="grid grid-cols-1 gap-6" method="POST" action="updateProduct">
                  <input type="hidden" name="productId" value="${req.query.productId}" />
                  
                  <div>
                    <label for="productname" class="block text-sm font-medium">Product Name:</label>
                    <input
                      id="productname"
                      name="productname" 
                      type="text"
                      class="inner-forms"
                      required
                    />
                  </div>

                  <div>
                    <label for="productprice" class="block text-sm font-medium">Product Price:</label>
                    <input
                      id="productprice"
                      name="productprice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      class="inner-forms"
                      required
                    />
                  </div>

                  <div>
                    <label for="productdescription" class="block text-sm font-medium">Product Description:</label>
                    <input
                      id="productdescription"
                      name="productdescription"
                      type="text"
                      class="inner-forms"
                      required
                    />
                  </div>

                  <div>
                    <label for="productimage" class="block text-sm font-medium">Product Image URL:</label>
                    <input
                      id="productimage"
                      name="productimage"
                      type="url"
                      class="inner-forms"
                      required
                    />
                  </div>

                  <div>
                    <label for="productcategory" class="block text-sm font-medium">Product Category:</label>
                    <select id="productcategory" name="productcategory" class="inner-forms" required>
                      <option value="1">CPU</option>
                      <option value="2">Motherboard</option>
                      <option value="3">RAM</option>
                      <option value="4">GPU</option>
                      <option value="5">PSU</option>
                      <option value="6">Cooling</option>
                      <option value="7">Storage</option>
                      <option value="8">Case</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <button type="submit" class="btn">
                      Update Product &rarr;
                    </button>
                    <button type="submit" formaction="deleteProduct" class="btn bg-red-500 hover:bg-red-600">
                      Delete Product &times;
                    </button>
                  </div>

                  <h1 class="text-center text-green-400">
                    ${req.session.updateProductMessage || ""}
                  </h1>
                </form>
              </div>
            </div>
          </div>
        </body> `);
      } catch (err) {
        console.error(err);
        res.write(`<p>Error occurred: ${err.message}</p>`);
        res.end();
      }
    });
  }
  res.end();
});

// Add POST to update product
router.post("/updateProduct", function (req, res) {
  const { productId, productname, productprice, productdescription, productimage, productcategory } = req.body;

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);
      await pool.request()
        .input('productId', sql.Int, productId)
        .input('productName', sql.VarChar, productname)
        .input('productPrice', sql.Decimal, productprice)
        .input('productDesc', sql.VarChar, productdescription)
        .input('productImageURL', sql.VarChar, productimage)
        .input('categoryId', sql.Int, productcategory)
        .query(`
          UPDATE product 
          SET productName = @productName, productPrice = @productPrice,
    productDesc = @productDesc, productImageURL = @productImageURL,
    categoryId = @categoryId
          WHERE productId = @productId
    `);

      req.session.updateProductMessage = "Product updated successfully";
      res.redirect('/admin/updateProducts');
    } catch (err) {
      console.dir(err);
      req.session.updateProductMessage = "Error updating product: " + err;
      res.redirect('/admin/updateProducts');
    }
  })();
});

// Add POST to delete product
router.post("/deleteProduct", function (req, res) {
  const { productId } = req.body;

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);
      await pool.request()
        .input('productId', sql.Int, productId)
        .query('DELETE FROM product WHERE productId=@productId');

      req.session.updateProductMessage = "Product deleted successfully";
      res.redirect('/admin/updateProducts');
    } catch (err) {
      console.dir(err);
      req.session.updateProductMessage = "Error deleting product: " + err;
      res.redirect('/admin/updateProducts');
    }
  })();
});

module.exports = router;