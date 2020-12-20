const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");
console.log(logo(config).render());
const chalk = require("chalk");
const log = console.log;

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "mike1234",
  database: "employee_tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  runApp();
});

const runApp = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View employees",
        "View all employees by department",
        "View all employees by manager",
         "Add employee",
         "Add Role",
         "Add Department",
        "remove employee",
        "update employee role",
         "update employee manager",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View employees":
          viewEmployees();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all employees by department":
          viewEmployeesByDepartment();
          break;
        case "View all employees by manager":
          viewEmployeesByManager();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepart();
          break;
        case "remove employee":
          removeEmployee();
          break;
        case "update employee role":
          updateEmployeeRole();
          break;
        case "update employee manager":
          updateEmployeeManager();
          break;
        case "Exit":
          connection.end();
      }
    });
};
// Done
const viewEmployees = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    runApp();
  });
};
//done
const viewEmployeesByDepartment = () => {
   const query =
     "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, department.id, department.department_name, role.id, role.title FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id;";
   connection.query(query, (err, res) => {
      if (err) throw err;

      console.table(res);
      runApp();
   });
};

//done
const viewEmployeesByManager = () => {
  const query = "SELECT employee.id, employee.first_name, employee.last_name,  department.id, department.department_name, role.id, role.title, employee.manager_id,CONCAT(manager.first_name, ' ', manager.last_name) AS 'manager_name' FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id ORDER BY manager.id ";
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    runApp();
  });
};

//done
const addDepart = () => {
  inquirer
    .prompt([
      {
        name: "departName",
        message: "What is the Department name you wish to add?",
        type: "input",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.departName,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Employee inserted!\n`);
          // Call updateProduct AFTER the INSERT completes
          runApp();
        }
      );
    });
};

//done
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        message: "What is the role title",
        type: "input",
      },
      {
        name: "salary",
        message: "What is the role salary?",
        type: "number",
      },
      {
        name: "depart",
        message: "What is the role department id",
        type: "number",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.depart,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Employee inserted!\n`);
          // Call updateProduct AFTER the INSERT completes
          runApp();
        }
      );
    });
};

// Done
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        message: "What is your first name?",
        type: "input",
      },
      {
        name: "lastName",
        message: "What is your last name?",
        type: "input",
      },
      {
        name: "roleId",
        message: "What is your role id?",
        type: "number",
      },
      {
        name: "managerId",
        message: "What is your manager id?",
        type: "number",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Employee inserted!\n`);
          // Call updateProduct AFTER the INSERT completes
          runApp();
        }
      );
    });
};

// Done
const removeEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) {
      console.log("Something went wrong");
    } else {
      console.table(res);
      const displayEmployees = res.map(
        (employ) => employ.id + " " + employ.first_name + " " + employ.last_name
      );

      inquirer
        .prompt([
          {
            type: "list",
            name: "choice",
            message: "Select an employee to to update their role id?",
            choices: displayEmployees,
          },
          //   {
          //     name: "id",
          //     message: "What is your role id?",
          //     type: "number",
          //   },
        ])
        .then((answer) => {
          let parts = answer.choice.split("");
          let choices = parts[0];
          console.log(choices);
          connection.query(
            `DELETE FROM employee WHERE id = ${choices}`,
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} Employee Deleted!\n`);
              runApp();
            }
          );
        });
    }
  });
};

// Done
const updateEmployeeRole = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) {
      console.log("Something went wrong");
    } else {
      console.table(res);
      const updateEmployee = res.map(
        (employ) => employ.id + " " + employ.first_name + " " + employ.last_name
      );
      inquirer
        .prompt([
          {
            type: "list",
            name: "choice",
            message: "Select an employee to to update their role id?",
            choices: updateEmployee,
          },
          {
            name: "roleId",
            message: "What would you like their role id to be?",
            type: "input",
          },
        ])
        .then((answer) => {
          let parts = answer.choice.split("");
          let chosenId = parts[0];
          console.log(chosenId);
          connection.query(
            `UPDATE employee SET role_id = ${answer.roleId} WHERE id = ${chosenId}`,
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} Employee inserted!\n`);
              runApp();
            }
          );
        });
    }
  });
};
//Done
const updateEmployeeManager = () => {
   connection.query("SELECT * FROM employee", (err, res) => {
     if (err) {
       console.log("Something went wrong");
     } else {
       console.table(res);
       const updateEmployee = res.map(
         (employ) =>
           employ.id + " " + employ.first_name + " " + employ.last_name
       );
       inquirer
         .prompt([
           {
             type: "list",
             name: "choice",
             message: "Select an employee to to update their Manager Id",
             choices: updateEmployee,
           },
           {
             name: "managerId",
             message: "What would you like their Manager id to be?",
             type: "input",
           },
         ])
         .then((answer) => {
           let parts = answer.choice.split("");
           let chosenId = parts[0];
           console.log(chosenId);
           connection.query(
             `UPDATE employee SET manager_id = ${answer.managerId} WHERE id = ${chosenId}`,
             (err, res) => {
               if (err) throw err;
               console.log(`${res.affectedRows} Employee Updated!\n`);
               runApp();
             }
           );
         });
     }
   });
};
