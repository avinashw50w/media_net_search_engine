# Search Engine

### Minimum requirements
- nodejs (10 or above)
- MySQL (5.6 or higher)

## Steps to run

- Install the latest version of node js from [here](https://nodejs.org/en/)
- create a DB in MySQL
```sh
CREATE DATABASE {database_name} DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
- go to the project root directory and change the DB credentials in the .env file
- import the sqldump.sql into your DB
- run the following commands from the project root directory
```sh
npm i
npm run dev
```
- open browser and hit localhost:3000
