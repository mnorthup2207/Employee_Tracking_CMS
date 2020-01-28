const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Future@2020*",
    database: "CMS_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    startCSM();
});

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
                    console.log("manager view");
                    // managerView();
                    break;
                case "Add Employee":
                    console.log("add employee");
                    // addEmployee();
                    break;
                case "Remove Employee":
                    console.log("remove employee");
                    // removeEmployee();
                    break;
                case "Update Employee Role":
                    console.log("upfdate role");
                    // updateRole();
                    break;
                case "Update Employee Manager":
                    console.log('update manager');
                    // updateManager();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

const employeeView = () => {
    console.log("Showing All Employees...\n");
    connection.query("SELECT first_name AS 'First', last_name AS 'Last', title AS 'Ttle', name AS 'Department' FROM employee AS A INNER JOIN role AS B on A.role_id = B.id INNER JOIN department AS C on B.department_id = C.id ", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        startCSM();
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
            console.log("Gathering Department Info...\n");
            // const query = (`SELECT first_name, last_name, title FROM employee AS A INNER JOIN role AS B on A.role_id = B.id INNER JOIN department AS C on B.department_id = C.id WHERE C.name = ${answer.departmentSearch}`)
            connection.query(`SELECT first_name AS 'First', last_name AS 'Last', title 'Title' FROM employee AS A INNER JOIN role AS B on A.role_id = B.id INNER JOIN department AS C on B.department_id = C.id WHERE C.name = '${answer.departmentSearch}'`, (err, res) => {
                    if (err) throw err;
                    // Log all results of the SELECT statement
                    console.table(res);
                    startCSM();
                });
        })

}