const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session')
const bodyParser = require('body-parser');

let index = require('./routes/index');
let loadData = require('./routes/loaddata');
let listOrder = require('./routes/listorder');
let listProd = require('./routes/listprod');
let addCart = require('./routes/addcart');
let showCart = require('./routes/showcart');
let checkout = require('./routes/checkout');
let order = require('./routes/order');
let login = require('./routes/login');
let validateLogin = require('./routes/validateLogin');
let validateRegister = require('./routes/validateRegister');
let logout = require('./routes/logout');
let admin = require('./routes/admin');
let product = require('./routes/product');
let removecart = require('./routes/removecart');
let removeallcart = require('./routes/removeallcart');
let displayImage = require('./routes/displayImage');
let customer = require('./routes/customer');
let register = require('./routes/register');

const app = express();

/* 
Getting sqlserver initialized:
  docker-compose up -d
  docker exec -it cosc304-sqlserver bash
4.1 In root project folder (copy folder):
  docker cp ./ddl/SQLServer_shop.ddl cosc304-sqlserver:/
In bash: 

// Access server
  ./opt/mssql-tools18/bin/sqlcmd -U sa -P 304#sa#pw -C
  CREATE database shop;
  4.2 In root bash (push ddl to database):
  ./opt/mssql-tools18/bin/sqlcmd -U sa -P 304#sa#pw -C -e -i /SQLServer_shop.ddl


*/

// use public
app.use(express.static('public'));

// Enable parsing of requests for POST requests
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This DB Config is accessible globally
dbConfig = {
  user: 'sa', // Changed from userName
  password: '304#sa#pw',
  server: 'cosc304-sqlserver', // Note the hyphen, not underscore
  port: 1433, // Explicitly specify port
  database: 'shop',
  options: {
    encrypt: false, // Keep as is
    trustServerCertificate: true, // Add this to bypass SSL validation for local dev
    enableArithAbort: false // Keep your existing setting
  }
}

// Setting up the session.
// This uses MemoryStorage which is not
// recommended for production use.
app.use(session({
  secret: 'COSC 304 Rules!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  }
}))


// Setting up the rendering engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Setting up where static assets should
// be served from.
app.use(express.static('public'));

// Setting up Express.js routes.
// These present a "route" on the URL of the site.
// Eg: http://127.0.0.1/loaddata
app.use('/', index);
app.use('/loaddata', loadData);
app.use('/listorder', listOrder);
app.use('/listprod', listProd);
app.use('/addcart', addCart);
app.use('/showcart', showCart);
app.use('/checkout', checkout);
app.use('/order', order);
app.use('/login', login);
app.use('/validateLogin', validateLogin);
app.use('/validateRegister', validateRegister);
app.use('/logout', logout);
app.use('/admin', admin);
app.use('/product', product);
app.use('/displayImage', displayImage);
app.use('/customer', customer);
app.use('/removecart', removecart);
app.use('/removeallcart', removeallcart);
app.use('/register', register);

// Starting our Express app
app.listen(3000)