const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const path = require('path')
const connection = require('./config/serverConfig');
var employeeName = [];

const startCSM = () => {
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "What would you like to perform?",
                choices: [
                    "View all employees",
                    "View All Employees by Department",
                    "View All Employees by Manager",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "Exit"
                ],
                name: "startAnswer"
            }
        ])
        .then(answers => {
            switch (answers.startAnswer) {
                case "View all employees":
                    employeeView();
                    break;
                case "View All Employees by Department":
                    departmentView();
                    break;
                case "View All Employees by Manager":
                    managerView();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Update Employee Manager":
                    startCSM();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}
const employeeNames = () => {
    connection.query(`SELECT concat(first_name, " ", last_name) AS "name" FROM employee`, function (err, res) {
        if (err) throw err;
        employeeName = [];
        for (const item of res) {
            employeeName.push(item.name);
        }
    });
}

const employeeView = () => {
    console.log("\n Showing All Employees...\n");
    connection.query("SELECT first_name AS 'First', last_name AS 'Last', title AS 'Title', name AS 'Department' FROM employee AS A INNER JOIN role AS B on A.role_id = B.id INNER JOIN department AS C on B.department_id = C.id ", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        startCSM();
        employeeNames();
    });
}
const departmentView = () => {
    inquirer
        .prompt(
            {
                type: "list",
                message: "Which department would you like to search employees by?",
                choices: [
                    'Sales',
                    'Engineering',
                    'Finance',
                    'Legal'
                ],
                name: "departmentSearch"
            }
        ).then(answer => {
            console.log("\n Gathering Department Info...\n");
            // const query = (`SELECT first_name, last_name, title FROM employee AS A INNER JOIN role AS B on A.role_id = B.id INNER JOIN department AS C on B.department_id = C.id WHERE C.name = ${answer.departmentSearch}`)
            connection.query(`SELECT first_name AS 'First', last_name AS 'Last', title 'Title' FROM employee AS A INNER JOIN role AS B on A.role_id = B.id INNER JOIN department AS C on B.department_id = C.id WHERE C.name = '${answer.departmentSearch}'`, (err, res) => {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                startCSM();
                employeeNames();
            });
        })
}

const managerView = () => {
    console.log("\n\n Gathering Manager Data...\n");
    connection.query(`SELECT b.first_name AS 'Employee First', b.last_name AS 'Employee Last', a.first_name AS 'Manager First', a.last_name AS 'Manager Last' FROM employee AS a
    INNER JOIN employee AS b ON a.id = b.manager_ID WHERE b.manager_ID IS NOT NULL`, (err, res) => {
        if (err) throw err;
        console.table(res)
        startCSM();
        employeeNames();
    })
}
const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter employee's FIRST Name",
                name: "first"
            },
            {
                type: "input",
                message: "Enter employee's LAST Name",
                name: "last"
            },
            {
                type: "rawlist",
                message: "Select employee's role",
                choices: ['Sales Lead',
                    'Salesperson',
                    'Lead Engineer',
                    'Software Engineer',
                    'Account Manager',
                    'Accountant',
                    'Legal Team Lead',
                    'Lawyer'],
                name: "employeeRole"
            }
        ]).then(answer => {
            employeeNames();
            const first = answer.first.trim();
            const last = answer.last.trim();
            let roleNum = 0;
            switch (answer.employeeRole) {
                case 'Sales Lead':
                    roleNum = 1;
                    break;
                case 'Salesperson':
                    roleNum = 2;
                    break;
                case 'Lead Engineer':
                    roleNum = 3;
                    break;
                case 'Software Engineer':
                    roleNum = 4;
                    break;
                case 'Account Manager':
                    roleNum = 5;
                    break;
                case 'Accountant':
                    roleNum = 6;
                    break;
                case 'Legal Team Lead':
                    roleNum = 7;
                    break;
                case 'Lawyer':
                    roleNum = 8;
                    break;
            }
            connection.query(`INSERT INTO employee(first_name, last_name, role_id) VALUES('${first}', '${last}', ${roleNum})`, (err, res) => {
                if (err) throw err;
                console.log(`\n Added ${first} ${last} with the role of ${answer.employeeRole} to the Employee database. \n`);
                startCSM();
                employeeNames();
            })
        })
}

const removeEmployee = () => {
    employeeNames();
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "Select employee you want to remove. CAUTION THIS WILL DELETE THE EMPLOYEE PERMANENTLY",
                choices: employeeName,
                name: "removeChoice"
            },
        ]).then(answer => {
            const removeEmployee1 = answer.removeChoice.split(" ")[0]
            const removeEmployee2 = answer.removeChoice.split(" ")[1]
            inquirer.prompt([
                {
                    type: "confirm",
                    message: `Are you sure you want to delete ${answer.removeChoice}`,
                    name: "result"
                }
            ]).then(answer => {
                if (answer.result) {
                    connection.query(`DELETE FROM employee WHERE first_name = "${removeEmployee1}" AND last_name = "${removeEmployee2}"`, (err, res) => {
                        if (err) throw err;
                        console.log(`\n Removed ${removeEmployee1} ${removeEmployee2} from Employee database \n`);
                        startCSM();
                        employeeNames();
                    })
                } else {
                    console.log(`\n ${removeEmployee1} ${removeEmployee2} was not removed \n`);
                    startCSM();
                    employeeNames();
                }
            })
        })
}
const updateRole = () => {
    inquirer.prompt([
        {
            type: "rawlist",
            message: "Select an Employee to update their role.",
            choices: employeeName,
            name: "employee"
        }
    ]).then(answer => {
        const selectedFirst = answer.employee.split(" ")[0];
        const selectedLast = answer.employee.split(" ")[1];
        inquirer.prompt([
            {
                type: "rawlist",
                message: `Select ${selectedFirst} ${selectedLast}'s new role`,
                choices: ['Sales Lead',
                    'Salesperson',
                    'Lead Engineer',
                    'Software Engineer',
                    'Account Manager',
                    'Accountant',
                    'Legal Team Lead',
                    'Lawyer'],
                name: "employeeNewRole"
            }
        ]).then(answer => {
            let roleNum = 0;
            switch (answer.employeeRole) {
                case 'Sales Lead':
                    roleNum = 1;
                    break;
                case 'Salesperson':
                    roleNum = 2;
                    break;
                case 'Lead Engineer':
                    roleNum = 3;
                    break;
                case 'Software Engineer':
                    roleNum = 4;
                    break;
                case 'Account Manager':
                    roleNum = 5;
                    break;
                case 'Accountant':
                    roleNum = 6;
                    break;
                case 'Legal Team Lead':
                    roleNum = 7;
                    break;
                case 'Lawyer':
                    roleNum = 8;
                    break;
            }
            // console.log(roleNum, selectedFirst, selectedLast);

            connection.query(`UPDATE employee SET role_id = ${roleNum} WHERE first_name = "${selectedFirst}" AND last_name = "${selectedLast}";`, (err, res) => {
                if (err) throw err;
                console.log(`\n Updated ${selectedFirst} ${selectedLast}'s NEW role to ${answer.employeeNewRole} \n`);
            })
            connection.query("SELECT first_name AS 'First', last_name AS 'Last', title AS 'Title', name AS 'Department' FROM employee AS A INNER JOIN role AS B on A.role_id = B.id INNER JOIN department AS C on B.department_id = C.id ", function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                startCSM();
                employeeNames();
            });
        })
    })
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    startCSM();
    employeeNames();
});