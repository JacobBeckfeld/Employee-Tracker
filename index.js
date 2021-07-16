const mysql = require("mysql2");
const inquirer = require("inquirer");

const {config} = require("./creds");
const Choices = require("inquirer/lib/objects/choices");

const connection = mysql.createConnection(config);




viewEmployees();

viewDepartment();

viewByManager();

addEmployee();

removeEmployee();


updateRole();



updateManager();


const start = () => {
    inquirer.prompt({
        name: "employeeToAdd",
        type: "rawlist",
        message: "What do you want to do?",
        choices: ["View all employees", "View employees by department", "View employee by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager" ]
        
    }).then((employeeToAdd) =>{
        switch(employeeToAdd){
            case "View all employees":
                viewEmployees();
                break
            
            case "View employees by department":
                viewDepartment();
                break;
            
            case "View employee by manager":
                viewByManager();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "Remove employee":
                removeEmployee();
                break;

            case "Update employee role":
                updateRole();
                break;

            case "Update employee manager":
                updateManager();
                break;
        }
    })
}

connection.connect((err) =>{
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`)
})

start();