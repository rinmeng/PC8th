const express = require('express');
const router = express.Router();
const sql = require('mssql');


router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'text/html');
  res.write("<title>PC8th Parts</title>");
  res.write('<link href="/style.css" rel="stylesheet">');
  res.write('<body class="text-white text-center bg-slate-600 ">');

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      const searchTerm = req.query.search || '';
      const sortBy = req.query.sortBy || 'default';

      // Mapping sort options to SQL ORDER BY clauses
      const sortOptions = {
        'categoryAsc': 'c.categoryName ASC, p.productName ASC',
        'categoryDesc': 'c.categoryName DESC, p.productName DESC',
        'productNameAsc': 'p.productName ASC',
        'productNameDesc': 'p.productName DESC',
        'priceAsc': 'p.productPrice ASC',
        'priceDesc': 'p.productPrice DESC',
        'default': 'c.categoryName, p.productName'
      };

      // Determine the current sort order for each column
      const getCurrentSort = (currentSort) => {
        const sortMap = {
          'default': {
            category: 'categoryAsc',
            productName: 'productNameAsc',
            price: 'priceAsc'
          },
          'categoryAsc': { category: 'categoryDesc', productName: 'productNameAsc', price: 'priceAsc' },
          'categoryDesc': { category: 'default', productName: 'productNameAsc', price: 'priceAsc' },
          'productNameAsc': { category: 'categoryAsc', productName: 'productNameDesc', price: 'priceAsc' },
          'productNameDesc': { category: 'categoryAsc', productName: 'default', price: 'priceAsc' },
          'priceAsc': { category: 'categoryAsc', productName: 'productNameAsc', price: 'priceDesc' },
          'priceDesc': { category: 'categoryAsc', productName: 'productNameAsc', price: 'default' }
        };
        return sortMap[currentSort] || sortMap['default'];
      };

      const currentSorts = getCurrentSort(sortBy);
      let request = pool.request();

      if (searchTerm) {
        // Handling valid categories (case-insensitive)
        if (["CPU", "MOBO", "RAM", "GPU", "PSU", "Cooling", "Storage", "Case"].map(c => c.toLowerCase()).includes(searchTerm.toLowerCase())) {
          sqlQuery = `
            SELECT p.productId, p.productName, p.productPrice, p.productDesc, c.categoryName 
            FROM product p 
            JOIN category c ON p.categoryId = c.categoryId
            WHERE LOWER(c.categoryName) = LOWER(@categoryTerm)
            ORDER BY ${sortOptions[sortBy] ? sortOptions[sortBy] : 'productName'}
        `;
          request.input('categoryTerm', sql.NVarChar, searchTerm);
        } else {
          // For other searches by product name (case-insensitive)
          sqlQuery = `
            SELECT p.productId, p.productName, p.productPrice, p.productDesc, c.categoryName 
            FROM product p 
            JOIN category c ON p.categoryId = c.categoryId
            WHERE p.productName LIKE @searchTerm
            ORDER BY ${sortOptions[sortBy] ? sortOptions[sortBy] : 'productName'}
        `;
          request.input('searchTerm', sql.NVarChar, `%${searchTerm}%`);
        }
      } else {
        // If no searchTerm, query all products
        sqlQuery = `
        SELECT p.productId, p.productName, p.productPrice, p.productDesc, c.categoryName 
        FROM product p 
        JOIN category c ON p.categoryId = c.categoryId
        ORDER BY ${sortOptions[sortBy] ? sortOptions[sortBy] : 'productName'}`;
      }

      let results = await request.query(sqlQuery);

      res.write(`<nav class="t1000e z-10 mt-6 fixed left-1/2 transform -translate-x-1/2 w-11/12 mx-auto glass-slate rounded-full flex justify-between items-center px-10 py-8 text-2xl">
                    <h1 id="navhint" class="t500e opacity-0 text-7xl">&larr;</h1>
                    <!-- Logo -->
                    <a class="opacity-100 p-3 hover:opacity-100 t200e text-6xl w-3/4" href="/">PC8th</a>

                    <!-- Navigation Links -->
                    <div class="flex justify-center w-full">
                        <!-- Product List -->
                        <a href="/listprod" class="relative group p-3">
                            <div class="opacity-100 group-hover:opacity-100 t200e">Product List</div>
                            <div class="a
                            bsolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-50 group-hover:scale-x-100 t200e">
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


      res.write("<div class='opacity-0 animate-fade-in-instant'>");

      res.write('<div class="pb-44"> </div>');
      res.write(`
        <form method="get" class="flex flex-row items-center justify-center mt-10 relative">
          <!-- Search Bar Container -->
          <div class="relative w-1/2">
            <div class="group p-4 absolute top-1 left-0 flex items-center ">
              <button class="w-6 h-0.5 " type="submit">
                  <img class="opacity-50 group-hover:opacity-100 t200e" src="/img/searchicon.png" alt="Search Icon">
                </button>
              </div>
            <input
              class="inner-forms bg-slate-700 w-full py-4 pl-12 pr-12"
              type="text"
              name="search"
              placeholder="Search for PC parts by name or category..."
              value="${searchTerm}"
            >
            <!-- Buttons inside the Search Bar -->
            <div class="group p-4 absolute inset-y-0 right-0 flex items-center">
              <a
                href="/listprod"
                class="opacity-50 p-5 group-hover:opacity-100 t200e"
              >
                <!-- Cross Using Spans -->
                <span class="absolute w-6 h-0.5 bg-white transform rotate-45"></span>
                <span class="absolute w-6 h-0.5 bg-white transform -rotate-45"></span>
              </a>
            </div>
          </div>
        </form>
      `);

      // Show search results count
      if (searchTerm) {
        res.write(`
          <div class="text-slate-300 mb-4">
            Found ${results.recordset.length} product${results.recordset.length !== 1 ? 's' : ''} 
            matching "${searchTerm}"
          </div>
        `);
      } else {
        res.write(`
          <div class="text-slate-300 mb-4">
            There are ${results.recordset.length} product${results.recordset.length !== 1 ? 's' : ''} 
            in the store.
          </div>
        `);
      }

      // Container for the grid
      res.write(`
        <div class="container mx-auto px-4 py-8">
          <div class="grid grid-cols-4 gap-4 mb-4 bg-slate-800 p-4 rounded-lg font-bold">
            <div class="flex items-center">
              <a class="flex justify-center items-center" href="/listprod?sortBy=${currentSorts.category}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}">
                Category 
                ${sortBy === 'categoryAsc' ? '&uarr;' : ''}
                ${sortBy === 'categoryDesc' ? '&darr;' : ''}
                ${!['categoryAsc', 'categoryDesc'].includes(sortBy) ? '&darr;&uarr;' : ''}
              </a>
            </div>
            <div class="flex items-center">
              <a href="/listprod?sortBy=${currentSorts.productName}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}">
                Product Name
                ${sortBy === 'productNameAsc' ? '&uarr;' : ''}
                ${sortBy === 'productNameDesc' ? '&darr;' : ''}
                ${!['productNameAsc', 'productNameDesc'].includes(sortBy) ? '&darr;&uarr;' : ''}
              </a>
            </div>
            <div class="flex items-center justify-center">
              <a href="/listprod?sortBy=${currentSorts.price}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}">
                Price
                ${sortBy === 'priceAsc' ? '&uarr;' : ''}
                ${sortBy === 'priceDesc' ? '&darr;' : ''}
                ${!['priceAsc', 'priceDesc'].includes(sortBy) ? '&darr;&uarr;' : ''}
              </a>
            </div>
            <div>Add to Cart</div>
          </div>
            
        <div class="space-y-2">
        `);

      // Group products by category for better organization
      let currentCategory = '';

      for (let product of results.recordset) {
        if (currentCategory !== product.categoryName) {
          currentCategory = product.categoryName;
          res.write(`
        <div class="text-left text-xl font-semibold mt-6 mb-2 text-slate-300">
          ${currentCategory}
        </div>
        `);
        }
        const addToCartUrl = `/addcart?id=${encodeURIComponent(product.productId)}&name=${encodeURIComponent(product.productName)}&price=${encodeURIComponent(product.productPrice)}`;

        res.write(`
        <div class="grid grid-cols-4 gap-4 items-center bg-slate-700 p-4 rounded-lg hover:bg-slate-800 t200e">
          <div class="text-left text-slate-300">${product.categoryName}</div>
          <div class="text-left">
            <div class="font-medium">
              <a class="text-blue-400 hover:underline flex" href="/product?id=${encodeURIComponent(product.productId)}">
                ${product.productName}
                <img class="w-3 h-3 ml-1" src="/img/newtab.png">
              </a>
            </div>
            <div class="text-sm text-slate-300">${product.productDesc.substring(0, 50)}${product.productDesc.length > 50 ? '...' : ''}</div>
          </div>
          <div class="text-green-400 font-medium">$${product.productPrice.toFixed(2)}</div>

          <div>
            <a href='${addToCartUrl}' class="btn">
              Add to Cart
            </a>
          </div>
        </div>
        `);
      }
      res.write(`
      </div>
        </div >
      `);

      res.write("</div>");
      res.write(`
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
              `);
      res.write("</body>");
      res.end();
    } catch (err) {
      console.dir(err);
      res.write(`
      <div class= "p-4 bg-red-500 text-white" >
        <h3>Error: ${JSON.stringify(err)}</h3>
        </div >
      `);
      res.end();
    }
  })();
});

module.exports = router;