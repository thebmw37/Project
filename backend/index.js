// Responsible for creating a server
// Responsible for connecting my server to my postgres database


// Server stuff
const express = require('express');

const app = express();

// Database stuff
const Sequelize = require('sequelize');


// Creating the connection
const db = new Sequelize('login_db', 'postgres', '1234', {
  dialect: 'postgres',
  host: "localhost",
  port: 5432,
})

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


// Define what a user looks like in the user table (schema)

const User = db.define('user', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
});

// Sync up User table that we just created with the database
User.sync()
  .then(() => {
  });


// Allow all incoming requests (regardless of origin)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Accept all origins
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Be able to parse any incoming requests and successfully grab body information
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.json('All of my passwrods from a database');
});

app.get('/login', (request, response) => {
  response.sendFile(__dirname + "/pages/Login.html");
});

app.get('/new', (request, response) => {
  response.sendFile(__dirname + "/pages/New.html");
});

app.get('/home', (request, response) => {
  response.sendFile(__dirname + "/pages/home.html");
});

app.get('/encryption', (request, response) => {
  response.sendFile(__dirname + "/pages/Encryption.html");
});

app.post('/login', (request, response) => {
  console.log('What is my request body (the information my user is sending in: ', request.body);
  User.findOne({
    where: {
      username: request.body.username,
      password: request.body.password
    }
  })
    .then((user) => {
      if (!user) {
        response.json('Wrong username or password');
      } else {
        response.json(user);
      }
    });
});

app.post('/new', (request, response) => {
  console.log(request.body.username);
  User.create({
        username: request.body.username,
        password: request.body.password
      })
    .then((user) => {
      response.json(user);
    });
});

app.listen(3000, () => {
  console.log('Succesfully listening on port 3000');
});

