CREATE DATABASE shop;
USE shop;


DROP VIEW userInterest;
DROP TABLE review;
DROP TABLE shipment;
DROP TABLE productinventory;
DROP TABLE warehouse;
DROP TABLE orderproduct;
DROP TABLE incart;
DROP TABLE product;
DROP TABLE category;
DROP TABLE ordersummary;
DROP TABLE paymentmethod;
DROP TABLE customer;


CREATE TABLE customer (
    customerId          INT IDENTITY,
    firstName           VARCHAR(40),
    lastName            VARCHAR(40),
    email               VARCHAR(50),
    phonenum            VARCHAR(20),
    address             VARCHAR(50),
    city                VARCHAR(40),
    state               VARCHAR(20),
    postalCode          VARCHAR(20),
    country             VARCHAR(40),
    userid              VARCHAR(20),
    password            VARCHAR(30),
    PRIMARY KEY (customerId)
);

CREATE TABLE paymentmethod (
    paymentMethodId     INT IDENTITY,
    paymentType         VARCHAR(20),
    paymentNumber       VARCHAR(30),
    paymentExpiryDate   DATE,
    customerId          INT,
    PRIMARY KEY (paymentMethodId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE ordersummary (
    orderId             INT IDENTITY,
    orderDate           DATETIME,
    totalAmount         DECIMAL(10,2),
    shiptoAddress       VARCHAR(50),
    shiptoCity          VARCHAR(40),
    shiptoState         VARCHAR(20),
    shiptoPostalCode    VARCHAR(20),
    shiptoCountry       VARCHAR(40),
    customerId          INT,
    PRIMARY KEY (orderId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE category (
    categoryId          INT IDENTITY,
    categoryName        VARCHAR(50),    
    PRIMARY KEY (categoryId)
);

CREATE TABLE product (
    productId           INT IDENTITY,
    productName         VARCHAR(300),
    productPrice        DECIMAL(10,2),
    productImageURL     VARCHAR(1000),
    productImage        VARBINARY(MAX),
    productDesc         VARCHAR(1000),
    categoryId          INT,
    PRIMARY KEY (productId),
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

CREATE TABLE orderproduct (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE incart (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE warehouse (
    warehouseId         INT IDENTITY,
    warehouseName       VARCHAR(30),    
    PRIMARY KEY (warehouseId)
);

CREATE TABLE shipment (
    shipmentId          INT IDENTITY,
    shipmentDate        DATETIME,   
    shipmentDesc        VARCHAR(100),   
    warehouseId         INT, 
    PRIMARY KEY (shipmentId),
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE productinventory ( 
    productId           INT,
    warehouseId         INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (productId, warehouseId),   
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE review (
    reviewId            INT IDENTITY,
    reviewRating        INT,
    reviewDate          DATETIME,   
    customerId          INT,
    productId           INT,
    reviewComment       VARCHAR(1000),          
    PRIMARY KEY (reviewId),
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE VIEW userInterest AS
SELECT DISTINCT 
    c.customerId,
    c.firstName,
    c.lastName,
    cat.categoryName
FROM 
    customer c
JOIN 
    ordersummary os ON c.customerId = os.customerId
JOIN 
    orderproduct op ON os.orderId = op.orderId
JOIN 
    product p ON op.productId = p.productId
JOIN 
    category cat ON p.categoryId = cat.categoryId;





INSERT INTO category(categoryName) VALUES ('CPU');
INSERT INTO category(categoryName) VALUES ('MOBO');
INSERT INTO category(categoryName) VALUES ('RAM');
INSERT INTO category(categoryName) VALUES ('GPU');
INSERT INTO category(categoryName) VALUES ('PSU');
INSERT INTO category(categoryName) VALUES ('Cooling');
INSERT INTO category(categoryName) VALUES ('Storage');
INSERT INTO category(categoryName) VALUES ('Case');


-- Products
-- CPUs
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('Dr. Ramon Lawrence', 1, 'Comes with candy and an amazing 304 course.', 304.00, 'https://news.ok.ubc.ca/wp-content/uploads/2015/11/profile-main-ramon-lawrence-1000x600-1.jpg', NULL),
('Intel Core i9-13900K', 1, '12-core, 24-thread processor', 589.99, 'https://www.custompc.com/wp-content/sites/custompc/2023/02/intel-core-i9-13900K-review-01.jpg', NULL),
('AMD Ryzen 9 7950X', 1, '16-core, 32-thread processor', 799.99, 'https://www.club386.com/wp-content/uploads/2022/09/7950XtitleNTVzk6cR95BeD6.jpg', NULL),
('Intel Core i7-13700K', 1, '16-core, 24-thread processor', 409.99, 'https://cdn.mos.cms.futurecdn.net/vbWDMDAGjUAb9Vp53QN9x8.jpg', NULL),
('AMD Ryzen 7 7800X', 1, '8-core, 16-thread processor', 399.99, 'https://duet-cdn.vox-cdn.com/thumbor/0x0:2040x1351/2400x2400/filters:focal(1020x676:1021x677):format(webp)/cdn.vox-cdn.com/uploads/chorus_asset/file/24551815/236593_AMD_Ryzen_7_7800X3D_TWarren_0004.jpg', NULL),
('Intel Core i5-13600K', 1, '14-core, 20-thread processor', 319.99, 'https://assetsio.gnwcdn.com/Intel-Core-i5-13600K-review.JPG?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp', NULL);

-- Motherboards
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('ASUS ROG Strix Z690-E', 2, 'Intel Z690 chipset motherboard', 399.99, 'https://cdn.cs.1worldsync.com/73/58/73586901-83e7-4106-af45-f83279bbdcde.jpg', NULL),
('MSI MPG Z590 Gaming Edge WiFi', 2, 'Intel Z590 chipset motherboard with Wi-Fi', 229.99, 'https://m.media-amazon.com/images/I/91KDtfEYkGL.jpg', NULL),
('MSI MAG B550 TOMAHAWK WIFI', 2, 'AMD B550 chipset motherboard with Wi-Fi', 179.99, 'https://m.media-amazon.com/images/I/71KORocMK0L.jpg', NULL),
('Gigabyte AORUS Z490 Elite', 2, 'Intel Z490 chipset motherboard with advanced cooling', 219.99, 'https://m.media-amazon.com/images/I/914h+2JWBqL.jpg', NULL),
('ASUS TUF Gaming B550-PLUS', 2, 'AMD B550 chipset motherboard with PCIe 4.0 support', 159.99, 'https://m.media-amazon.com/images/I/817i3VVNZML._AC_UF894,1000_QL80_.jpg', NULL);

-- RAM
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('Corsair Vengeance LPX 32GB 2x16GB', 3, 'DDR4-3200 32GB RAM kit for high-performance gaming', 149.99, 'https://multimedia.bbycastatic.ca/multimedia/products/500x500/166/16606/16606806.jpeg', NULL),
('G.Skill Ripjaws V 16GB 2x8GB', 3, 'DDR4-3600 16GB RAM kit for high-speed performance', 79.99, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCAhzv_WQxby2v4phmlZ-UW-0hGWsIIG4A3w&s', NULL),
('HyperX Fury 16GB 2x8GB', 3, 'DDR4-3200 16GB RAM kit for general-purpose use', 64.99, 'https://m.media-amazon.com/images/I/71fLAyJ945L.jpg', NULL),
('Corsair Dominator Platinum RGB 32GB 2x16GB', 3, 'DDR4-3600 High-performance 32GB RAM kit with RGB lighting', 189.99, 'https://m.media-amazon.com/images/I/61fdyHiQeRL._AC_UF894,1000_QL80_.jpg', NULL),
('Crucial Ballistix 16GB 2x8GB', 3, 'DDR4-3200 16GB RAM kit for budget builds', 69.99, 'https://i.ebayimg.com/images/g/uGkAAOSwfS1lLr3x/s-l1200.jpg', NULL);

-- GPUs
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('NVIDIA GeForce RTX 4090', 4, '24GB GDDR6X VRAM, the flagship GPU from NVIDIA', 1599.99, 'https://m.media-amazon.com/images/I/51EL-FaK4XL.jpg', NULL),
('NVIDIA GeForce RTX 5090', 4, '32GB GDDR6X VRAM, the ultimate GPU for gaming and content creation', 1999.99, 'https://cdn.mos.cms.futurecdn.net/hAcZNwUpeQQAsWfS7LZ4DC.jpg', NULL),
('AMD Radeon RX 7900 XTX', 4, '24GB GDDR6, high-performance GPU from AMD', 999.99, 'https://m.media-amazon.com/images/I/81il2WdPPJL.jpg', NULL),
('ASUS TUF Gaming GeForce RTX 3070', 4, '8GB GDDR6 VRAM, NVIDIA Ampere architecture', 599.99, 'https://assets-prd.ignimgs.com/2020/11/16/face-1605565039263.JPG', NULL),
('NVIDIA GeForce RTX 3060 Ti', 4, '8GB GDDR6 VRAM, great for 1440p gaming', 399.99, 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/news/geforce-rtx-3060-ti-out-december-2/nvidia-geforce-rtx-3060-ti-announcement-article-ogimage.jpg', NULL);

-- Power Supplies
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('EVGA SuperNOVA 850 G5', 5, '850W power supply, 80+ Gold certified', 139.99, 'https://m.media-amazon.com/images/I/615ipi-tHtL.jpg', NULL),
('Corsair RM750x', 5, '750W power supply, fully modular, 80+ Gold certified', 109.99, 'https://m.media-amazon.com/images/I/71vXweqjv+L.jpg', NULL),
('Thermaltake Toughpower GF1 750W', 5, '750W power supply, 80+ Gold certified', 109.99, 'https://m.media-amazon.com/images/I/71DDgVE794L.jpg', NULL),
('Cooler Master MWE Gold 850W', 5, '850W power supply, fully modular, 80+ Gold certified', 129.99, 'https://m.media-amazon.com/images/I/81X1hRKY6ML.jpg', NULL),
('Seasonic Focus GX-750', 5, '750W power supply, 80+ Gold certified', 119.99, 'https://m.media-amazon.com/images/I/8140Rg-FPOL.jpg', NULL);

-- Cooling
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('Noctua NH-D15', 6, 'Dual tower CPU cooler with dual fan setup', 89.99, 'https://www.club386.com/wp-content/uploads/2024/07/noctua-nh-d15-g2-review.jpg', NULL),
('Corsair iCUE H150i Elite Capellix', 6, '360mm AIO liquid cooler with RGB fans', 179.99, 'https://m.media-amazon.com/images/I/71hsRGvyfWL.jpg', NULL),
('be quiet! Dark Rock Pro 4', 6, 'Premium air cooler with two silent fans', 89.99, 'https://ccimg.canadacomputers.com/Products/800x800/232/387/137820/63852.jpg', NULL),
('Corsair iCUE H100i RGB Pro XT', 6, '240mm AIO liquid cooler with RGB lighting', 129.99, 'https://cdn.mos.cms.futurecdn.net/mCTARFbfFE6DLvQ3werkg6.jpg', NULL),
('NZXT Kraken X63', 6, '280mm AIO liquid cooler with RGB lighting', 149.99, 'https://m.media-amazon.com/images/I/71Aza0hTg9L.jpg', NULL);


-- Storage
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('Samsung 970 EVO Plus 1TB', 7, 'M.2 NVMe SSD for fast storage', 109.99, 'https://images.samsung.com/is/image/samsung/ca-970-evoplus-nvme-m2-ssd-mz-v7s1t0b-am-frontblack-151859642?$1300_1038_PNG$', NULL),
('Western Digital Black SN850X 2TB', 7, 'M.2 NVMe Gen4 SSD for high-speed gaming', 249.99, 'https://m.media-amazon.com/images/I/61KeSQhDm4L._AC_SL1500_.jpg', NULL),
('Seagate Barracuda 4TB', 7, '3.5" HDD for mass storage', 89.99, 'https://m.media-amazon.com/images/I/818Zr2FoBWL.jpg', NULL),
('Crucial P2 500GB', 7, 'M.2 NVMe SSD for budget builds', 59.99, 'https://m.media-amazon.com/images/I/61fFeAca59L.jpg', NULL),
('Samsung 870 QVO 2TB', 7, '2.5" SATA SSD for general-purpose use', 199.99, 'https://i.ebayimg.com/images/g/dRAAAOSwrj9ggaO2/s-l1200.jpg', NULL);

-- Cases
INSERT INTO product (productName, categoryId, productDesc, productPrice, productImageURL, productImage) VALUES 
('NZXT H510', 8, 'Mid-tower ATX case with tempered glass panel', 79.99, 'https://m.media-amazon.com/images/I/51oclTFjIFL._AC_SL1000_.jpg', NULL),
('Fractal Design Meshify C', 8, 'Compact mid-tower ATX case with high airflow', 89.99, '/img/meshify.jpg', NULL),
('Corsair 4000D Airflow', 8, 'Mid-tower ATX case with high airflow design', 99.99, 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/base-4000d-airflow-config/Gallery/4000D_AF_BLACK_22.webp', NULL),
('Cooler Master MasterBox TD500 Mesh', 8, 'Mid-tower ATX case with mesh front panel', 99.99, 'https://m.media-amazon.com/images/I/81mlk4enj9L.jpg', NULL),
('Lian Li Lancool II Mesh', 8, 'Mid-tower ATX case with mesh front panel and RGB lighting', 119.99, 'https://m.media-amazon.com/images/I/61Xmwnvr6pL.jpg', NULL);

-- Warehouse
INSERT INTO warehouse (warehouseName) VALUES ('Main Warehouse');

-- Product Inventory
INSERT INTO productinventory (productId, warehouseId, quantity, price) VALUES 
(1, 1, 5, 18.00),
(2, 1, 10, 19.00),
(3, 1, 3, 10.00),
(4, 1, 2, 22.00),
(5, 1, 6, 21.00),
(6, 1, 3, 25.00),
(7, 1, 1, 30.00),
(8, 1, 0, 40.00),
(9, 1, 2, 97.00),
(10, 1, 3, 31.00);

-- Customers
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES 
('admin', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'admin'),
('Rin', 'Meng', 'rinmeng@gmail.com', '204-111-2222', '103 AnyWhere Street', 'Winnipeg', 'MB', 'R3X 45T', 'Canada', 'rin', 'rin'),
('Noah', 'Stewart', 'NoahStewart@hotmail.ca', '572-342-8911', '222 Bush Avenue', 'Boston', 'MA', '22222', 'United States', 'noah', 'noah'),
('Candace', 'Cole', 'candace.cole@example.com', '123-456-7890', '123 Maple Street', 'Toronto', 'ON', 'M5H 2N2', 'Canada', 'candacecole', 'candacecole'),
('Elizabeth', 'Elliott', 'engel@uiowa.edu', '555-666-7777', '555 Everwood Street', 'Iowa City', 'IA', '52241', 'United States', 'beth', 'test'),
('John', 'Doe', 'john.doe@example.com', '204-111-2222', '103 AnyWhere Street', 'Winnipeg', 'MB', 'R3X 45T', 'Canada', 'john', 'john');

-- Order 1 can be shipped as have enough inventory
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-15 10:25:55', 2389.96)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 1, 1, 589.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 2, 399.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 10, 1, 999.99);

DECLARE @orderId2 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-16 18:00:00', 1599.95)
SELECT @orderId2 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId2, 19, 5, 319.99);

-- Order 3 cannot be shipped as do not have enough inventory for item 7
DECLARE @orderId3 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (4, '2019-10-15 3:30:22', 459.98)
SELECT @orderId3 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId3, 6, 2, 229.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId3, 7, 3, 79.99);

DECLARE @orderId4 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-17 05:45:11', 2769.84)
SELECT @orderId4 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId4, 3, 4, 409.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId4, 8, 3, 79.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId4, 13, 3, 89.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId4, 28, 2, 129.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId4, 29, 4, 89.99);

DECLARE @orderId5 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (5, '2019-10-15 10:25:55', 3139.91)
SELECT @orderId5 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId5, 5, 4, 399.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId5, 19, 2, 319.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId5, 20, 3, 299.99);

-- Added to visualize chart.js more

DECLARE @orderId6 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-18 14:22:33', 1899.96)
SELECT @orderId6 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId6, 1, 2, 499.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId6, 10, 3, 299.99);

DECLARE @orderId7 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (4, '2019-10-19 18:15:00', 2599.94)
SELECT @orderId7 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId7, 2, 3, 599.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId7, 15, 4, 199.99);

DECLARE @orderId8 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (1, '2019-10-20 09:45:22', 2899.95)
SELECT @orderId8 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId8, 4, 3, 649.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId8, 16, 2, 249.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId8, 21, 1, 449.99);

DECLARE @orderId9 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (6, '2019-10-21 16:33:45', 3199.93)
SELECT @orderId9 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId9, 9, 2, 549.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId9, 17, 3, 399.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId9, 25, 4, 299.99);

DECLARE @orderId10 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-22 11:15:33', 7499.94)
SELECT @orderId10 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId10, 3, 10, 409.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId10, 5, 8, 399.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId10, 2, 4, 599.99);

DECLARE @orderId11 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-23 13:45:12', 9299.85)
SELECT @orderId11 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId11, 4, 8, 649.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId11, 1, 7, 499.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId11, 9, 5, 549.99);

DECLARE @orderId12 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (4, '2019-10-24 15:22:45', 8599.88)
SELECT @orderId12 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId12, 2, 8, 599.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId12, 6, 10, 229.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId12, 19, 6, 319.99);

DECLARE @orderId13 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (5, '2019-10-25 09:33:21', 6799.92)
SELECT @orderId13 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId13, 5, 12, 399.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId13, 20, 6, 299.99);

DECLARE @orderId14 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (1, '2019-10-26 14:55:18', 9999.80)
SELECT @orderId14 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId14, 4, 10, 649.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId14, 9, 8, 549.99);

DECLARE @orderId15 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-27 12:30:45', 4599.93)
SELECT @orderId15 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId15, 3, 5, 409.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId15, 12, 3, 289.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId15, 18, 4, 199.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId15, 22, 2, 159.99);


DECLARE @orderId16 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (4, '2019-10-28 10:15:22', 5899.92)
SELECT @orderId16 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId16, 1, 6, 499.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId16, 4, 4, 649.99);

DECLARE @orderId17 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-29 14:25:33', 6599.88)
SELECT @orderId17 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId17, 2, 7, 599.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId17, 5, 5, 399.99);

DECLARE @orderId18 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (5, '2019-10-30 16:40:15', 7899.95)
SELECT @orderId18 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId18, 3, 8, 409.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId18, 9, 7, 549.99);

DECLARE @orderId19 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (1, '2019-10-31 11:55:44', 8999.90)
SELECT @orderId19 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId19, 4, 9, 649.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId19, 1, 8, 499.99);

DECLARE @orderId20 int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-11-01 09:30:18', 9599.88)
SELECT @orderId20 = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId20, 2, 10, 599.99)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId20, 5, 9, 399.99);