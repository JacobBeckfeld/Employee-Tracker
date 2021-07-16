const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');
const {config} = require("./creds");

const connection = mysql.createConnection(config);



connection.connect((err) =>{
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`)
})

const viewEmployees = () => {
    connection.query("SELECT employee.first_name, employee.last_name, role.id, role.salary, department.name AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",(err, res) => {
        if (err) throw err;
        console.table(res);
        start();
        })
};

// viewDepartment();

// viewByManager();

const addEmployee = () => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is their first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is their last name?"
        },
        {
            name: "role",
            type: "rawlist",
            message: "what is their role?",
            choices: connection.query("SELECT * FROM role", (err,res) => {
                let roleArray = [];
                if (err) throw err
                for (var i = 0; i < res,length; i++){
                    roleArray.push(res[i].id)
                }
                return roleArray;
            })
        }
    ])
};

// updateEmployeeRole();

// addRole();

// addDepartment();


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

start();