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

const viewDepartment = () => {
    connection.query("SELECT department.name AS department, role.id, employee.id, employee. first_name, employee.last_name FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) ORDER BY department.name;", (err, res) =>{
        if (err) throw err;
        console.table(res)
    })
};


const chooseRole = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        let roleArray = [];
        if (err) throw err
        for (var i = 0; i < res.length; i++){
            roleArray.push(res[i].id)
            // return roleArray;
            console.log(roleArray)
        }
    })
}

const chooseManager = () =>{
    connection.query("SELECT * FROM employee WHERE manager_id IS null", (err, res) =>{
        let mngArray = [];
        if (err) throw err
        for (var i = 0; i < res.length; i++){
            mngArray.push(res[i].id)
            // return mngArray;
            console.log(mngArray)
        }
    })
}
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
            choices: chooseRole()
        },
        {
            name: "manager",
            type: "rawlist",
            message: "Who is their manager?",
            choices: chooseManager()
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
// addEmployee();
// viewEmployees();
// start();
// viewDepartment()
// chooseManager()
chooseRole();