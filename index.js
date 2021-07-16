const mysql = require("mysql2");
const inquirer = require("inquirer");

const {config} = require("./creds");

const connection = mysql.createConnection(config);