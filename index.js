const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { config } = require("./creds");

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});

const viewEmployees = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.id, role.salary, department.name AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewDepartment = () => {
  connection.query(
    "SELECT department.name AS department, role.id, employee.id, employee. first_name, employee.last_name FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) ORDER BY department.name;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
    }
  );
};

const addEmployee = () => {
  connection.query("SELECT * FROM employee_db.role;", (err, res) => {
    let roleArray = [];
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      let data = {
        name: res[i].name,
        value: res[i].id,
      };
      roleArray.push(data);
    }

    connection.query(
      "SELECT * FROM employee WHERE manager_id IS null",
      (err, res) => {
        let mngArray = [];
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          let data = {
            name: res[i].first_name,
            value: res[i].id,
          };
          mngArray.push(data);
        } // console.log(mngArray)
        mngArray.push({
          name: "none",
          value: null,
        });
        inquirer
          .prompt([
            {
              name: "firstName",
              type: "input",
              message: "What is their first name?",
            },
            {
              name: "lastName",
              type: "input",
              message: "What is their last name?",
            },
            {
              name: "role",
              type: "rawlist",
              message: "what is their role?",
              choices: roleArray,
            },
            {
              name: "manager",
              type: "rawlist",
              message: "Who is their manager?",
              choices: mngArray,
            },
          ])
          .then((answers) => {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.role,
                manager_id: answers.manager,
              },
              (err, res) => {
                if (err) throw err;
                console.log("Employee added!\n");
                start();
              }
            );
          });
      }
    );
  });
};

const updateEmployeeRole = () => {
  connection.query("SELECT * FROM employee_db.role;", (err, res) => {
    let roleArray = [];
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      let data = {
        name: res[i].name,
        value: res[i].id,
      };
      roleArray.push(data);
    }
    connection.query("SELECT * FROM employee_db.employee;", (err, res) => {
      let empArray = [];
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        let data = {
          name: res[i].first_name,
          value: res[i].id,
        };
        empArray.push(data);
      }
      inquirer.prompt([
        {
          name: "employee",
          message: "Which employee would you like to update?",
          type: "rawlist",
          choices: empArray
        },
        {
          name: "role",
          message: "What is their new role?",
          type: "rawlist",
          choices: roleArray
        }
      ]).then((answer) => {
        connection.query("UPDATE employee SET ? WHERE ?", [
          {
            role_id: answer.role,
          },
          {
            id: answer.employee,
          },
        ],
        (err, res) => {
          if (err) throw err;
          console.log("Employee updated!\n")
          start()
        }
        );
      });
    });
  });
};

const addRole = () =>{
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What is the name of this role?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is this role's salary?"
    },
    {
      name: "department_id",
      type: "input",
      message: "What is the role's department id?"
    }
  ]).then((answers) => {
    connection.query("INSERT INTO role SET ?",
    {
      name: answers.name,
      salary: answers.salary,
      department_id: answers.department_id
    },
    (err, res) =>{
      if(err) throw err;
      console.log("Role added!\n");
      start();
    }
    )
  })
};

const addDepartment = () => {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What is the name of this department?"
    }
  ]).then((answers) => {
    connection.query("INSERT INTO department SET ?",
      {
        name: answers.name
      },
      (err, res) => {
        if (err) throw err;
        console.log("Department added!");
        start();
      }
    )
  })
};

const start = () => {
  inquirer
    .prompt({
      name: "employeeToAdd",
      type: "rawlist",
      message: "What do you want to do?",
      choices: [
        "View all employees",
        "View employees by department",
        "View employee by manager",
        "Add employee",
        "Add deparnment",
        "Add role",
        "Update employee role",
      ],
    })
    .then((employeeToAdd) => {
      switch (employeeToAdd.employeeToAdd) {
        case "View all employees":
          viewEmployees();
          break;

        case "View employees by department":
          viewDepartment();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Add deparnment":
          addDepartment();
          break;

        case "Add role":
          addRole();
          break;

        case "Update employee role":
          updateEmployeeRole();
          break;    
      }
    });
};
// addEmployee();
// viewEmployees();
// start();
// viewDepartment();
// chooseManager();
// chooseRole();
