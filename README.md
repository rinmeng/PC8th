# How to view the website

Here's what you have to do (Mac Intel and Mac M chips) running node.js as primary, and mssql as their database:

- Clone repo, and run `docker-compose up -d`

- Now you can visit the website by typing `127.0.0.1/loaddata` to load the data into the database, then back to the root page to view the website

- Please note that we have modified the docker-compose.yml file to automatically make the database, so that you don't have the "sa" login error

- You can login as a customer with the following credentials:
  - Username: `rin`
  - Password: `rin`

- You can login as an admin with the following credentials:
  - Username: `admin`
  - Password: `admin`

The Project Document can be found [here](./304%20Project%20Documentation.pdf) where you can see all the amazing features we have implemented in this project
