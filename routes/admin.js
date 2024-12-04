const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");
// const { color } = require("chart.js/helpers");

router.get("/", function (req, res, next) {
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
            ${
              req.session.authenticated
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
            ${
              req.session.authenticated
                ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
                : `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
            }
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
    return;
  }

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
            ${
              req.session.authenticated
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
      <div class="pb-52"></div
      >
      <div class="grid grid-cols-2 gap-4">
  <div class="bg-red-500 justify-center text-center">
    <h1 class="text-white">Chart To be here</h1>
  </div> 
  <div>
    <div class="font-bold w-5/6 text-4xl text-center mb-2 p-2  bg-slate-800 rounded-t-lg">
      <h1>Admin Panel </h1>    
    </div>
    <div class="grid grid-cols-2 w-5/6 ">
    <div class="flex justify-start">
      <a class="bg-slate-300 m-2 w-5/6 text-slate-950 text-center transition-transform duration-300 ease-in-out p-2 text-lg rounded-lg hover:scale-105 hover:bg-slate-900 hover:text-slate-200" href="admin/orders">View Orders</a>
    </div>
    <div class="flex justify-end">
      <a class="bg-slate-300 m-2 w-5/6 text-slate-950 text-center transition-transform duration-300 ease-in-out p-2 text-lg rounded-lg hover:scale-105 hover:bg-slate-900 hover:text-slate-200" href="admin/customers">View Customers</a>
    </div>
    <div class="flex justify-start">
      <a class="bg-slate-300 m-2 w-5/6 text-slate-950 text-center transition-transform duration-300 ease-in-out p-2 text-lg rounded-lg hover:scale-105 hover:bg-slate-900 hover:text-slate-200" href="admin/orders" href="admin/addProduct">Add New Product</a>
    </div>
    <div class="flex justify-end">
      <a class="bg-slate-300 m-2 w-5/6 text-slate-950 text-center transition-transform duration-300 ease-in-out p-2 text-lg rounded-lg hover:scale-105 hover:bg-slate-900 hover:text-slate-200" href="admin/orders" href="admin/updateProduct">Update/Delete Product</a>
     </div> 
      <a class="bg-slate-950 my-3 col-span-2 w-full text-slate-200 text-center transition-transform duration-300 ease-in-out p-2 text-lg rounded-lg hover:scale-105 hover:bg-slate-200 hover:text-slate-950" href="admin/orders" href="admin/ship">Ship Orders</a>      
  </div>
</div>

      </body>
    `);

  res.end();
});

router.get("/orders", function (req, res, next) {
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
            ${
              req.session.authenticated
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
            ${
              req.session.authenticated
                ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
                : `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
            }
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

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      salesQuery = `
            SELECT orderDate, SUM(totalAmount) as totalAmount
            FROM ordersummary
            GROUP BY orderDate
            ORDER BY orderDate
        `;

      let result = await pool.request().query(salesQuery);
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
                ${
                  req.session.authenticated
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
          <!-- Header -->
          <div class="container mx-auto px-4 py-12  opacity-0 animate-fade-in-instant">
            <div class='pb-44'></div>
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
                $${result.recordset[i].totalAmount.toFixed(2)}
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

router.get("/customers", function (req, res, next) {
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
            ${
              req.session.authenticated
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
            ${
              req.session.authenticated
                ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
                : `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
            }
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

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      let query = `
        SELECT customerId, firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password
        FROM customer
      `;

      let result = await pool.request().query(query);

      console.log(result);

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
              ${
                req.session.authenticated
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
           <div class="w-full container mx-auto px-1 py-12  opacity-0 animate-fade-in-instant">
            <div class='pb-44'></div>
            <div class="text-center mb-12">
              <h1 class="title mb-4">Customers</h1>
              <p class="text-slate-300 text-xl">Each customers info</p>
            </div>
</div>

      `);
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

router.get("/addProduct", function (req, res, next) {
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
            ${
              req.session.authenticated
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
            ${
              req.session.authenticated
                ? `
              <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
                : `
            <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
            `
            }
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
    return;
  }

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
            ${
              req.session.authenticated
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
      <div class="grid-rows-2">
        <div class="bg-red-500 justify-center text-center ">
            <h1 class="text-white">Chart To be here</h1>
        </div> 
        <div>
        <h1>Other Admin Functions:</h1>
        <ul>
          <li><a href="admin/orders">View Orders</a></li>
          <li><a href="admin/customers">View All Customers</a></li>
          <li><a href="admin/addProduct">Add New Product</a></li>
          <li><a href="admin/updateProduct">Update/Delete Product</a></li>
          <li><a href="admin/ship">Ship Orders</a></li>
        </ul>

      </div>
      </body>
    `);

  res.end();
});

router.get("/ship", function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write('<body class="text-white bg-slate-600">');

  // Navigation
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
            ${
              req.session.authenticated
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
  `);

  res.write('<div class="opacity-0 animate-fade-in-instant">');
  res.write('<div class="pb-52"> </div>');

  // Authorization check for admin
  if (req.session.user !== "admin") {
    res.write(`
        <div class="text-center mp5 opacity-0 animate-fade-in-instant">
          <!-- Header Section -->
          <div class="text-center space-y-4">
              <h1 class="text-7xl font-extralight text-white tracking-tight">Administration</h1>
              <h1 class="text-4xl font-extrabold text-red-400">
                You do not have permission to view this page.
              </h1>
              ${
                req.session.authenticated
                  ? `
                <p class="text-lg text-slate-300">You are logged in as <strong>${req.session.user}</strong></p>
                <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
              `
                  : `
              <p class="text-lg text-slate-300">Please log in as an admin to view this page.</p>
              `
              }
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
        `);
    return; // End the response here
  } else {
    // Display "Process Order" form (only if user is admin)
    res.write(`
    <main class="container mx-auto p-8">
      <h1 class="title text-center my-5">Process Order</h1>
      <div class="flex justify-center items-center m-auto w-1/3 glass-slate rounded-xl ">
        <form action="/ship" method="get" 
        class="flex flex-col p-5 rounded-lg w-full my-0 space-y-4">
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
            <div class="text-center mt-8 text-red-400">
              <p>Invalid Order ID or no products found for the order ${req.query.orderId}.</p>
              <a href="/ship" class="text-blue-400 hover:underline">Try again</a>
            </div>
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
                  <div class="text-slate-300 px-6">${
                    row.totalAvailableQuantity
                  }</div>
                  <div class="text-slate-300 px-6">
                    <span class="font-mono ${
                      newInventory >= 0 ? "" : "opacity-50"
                    }">
                      ${newInventory >= 0 ? newInventory : "N/A"}
                    </span>
                  </div>
                  <div class="text-slate-300 px-6">
                    <span class="font-mono ${
                      status === "Unavailable"
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
            <p class="text-center mt-8 text-red-500 text-2xl">
              Shipment not fulfilled due to insufficient inventory.
            </p>
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
            <p class="text-center mt-8 text-green-500 text-2xl">
              Shipment fulfilled successfully.
            </p>
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
  }
});

module.exports = router;

