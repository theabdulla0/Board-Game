const express = require("express");
const route = express.Router();
const { SignUp, Login } = require("../controllers/auth.controller");

route.post("/register", SignUp);
route.post("/login", Login);

module.exports = route;
