require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3004;
const fs = require('fs')
const helmet = require('helmet');
const cors = require('cors');
const session=require('express-session')
const cookieParser=require('cookie-parser')
// const RateLimit = require("./app/utils/limiter");


//DB CONNECTION //
const DatabaseConnection = require("./app/config/dbcon");

//DATABASE CONNECTION//
DatabaseConnection();

//EJS //
const ejs = require("ejs");
app.set("view engine", "ejs");
app.set("views", "views");
app.use(cors())

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Define JSON//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(helmet());
app.use(cookieParser());
// app.use(RateLimit);


//Static files //

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/uploads", express.static("uploads"));

//session
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 
     }
  }))
  app.use(cookieParser())


//ADMIN ROUTE //
const adminRoute = require('./app/routes/adminRoute')
app.use("/api", adminRoute)



app.listen(port, () => {
  console.log("Server is running in this port", port);
});
