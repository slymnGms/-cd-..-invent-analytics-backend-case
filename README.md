# Invent Analytics Backend Challenge 
Simple Node js app for Invent Analytics Backend Challenge in Feb 2022

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Contact](#contact)
----------
## General info
The project simply use Express as API with CORS to observe books and user with loan/return process. It uses SQLite for db side. So don't worry for database connections and enjoy the app

App checks if datas exist or loaning availability by both book and user side. 

Endpoints can be tested via [Postman Document](Library_Case_API_Collection.postman_collection.json) sent by company

The architecture of project combined of 
* routes
* controllers
* models
* config

In Dockerfile,  `node:16` image selected 

----------	
## Technologies
Project is created with:
* Node version: 14.17.0
* Express version: 4.17.3
* Sequelize version: 6.17.0
* Sqlite3 version: 5.0.2

----------
## Setup
To run this project, install it locally using npm:

```
$ cd ../invent-analytics-backend-case
$ npm install
$ node server.js
```

Or build and run in Docker
```
$ docker build --pull --rm -f "Dockerfile" -t inventanalyticsbackendcase:latest "." 
$ docker run --rm -d  -p 3000:3000/tcp inventanalyticsbackendcase:latest
```
----------
## Contact
* Github : [slymnGms](https://github.com/slymnGms)
* LinkedIn: [Suleyman GUMUS](www.linkedin.com/in/sulaiman-gms)
* E-mail: [suleyman.gumus@outlook.com.tr](mailto:suleyman_gumus@outlook.com.tr)