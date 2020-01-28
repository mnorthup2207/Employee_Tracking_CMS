const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

var employeeName = [];

const connection = mysql.createConnection({
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
    employeeNames();
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
                    managerView();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
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
const employeeNames = () => {
    connection.query(`SELECT concat(first_name, " ", last_name) AS "name" FROM employee`, function (err, res) {
        if (err) throw err;
        for (const item of res){
            employeeName.push(item.name);
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

const managerView = () => {
    console.log("Gathering Manager Data...\n");
    connection.query(`SELECT b.first_name AS 'Employee First', b.last_name AS 'Employee Last', a.first_name AS 'Manager First', a.last_name AS 'Manager Last' FROM employee AS a
    INNER JOIN employee AS b ON a.id = b.manager_ID WHERE b.manager_ID IS NOT NULL`, (err, res) => {
        if (err) throw err;
        console.table(res)
        startCSM();
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
            let roleNum = 0 ;
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
                if(err) throw err;
                console.log(`Added ${first} ${last} with a role of ${answer.employeeRole} to Employee database`);
                startCSM();
            })  
        })
}

const removeEmployee = () => {
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "Select employee you want to remove. CAUTION THIS WILL DELETE THE EMPLOYEE PERMANENTLY",
                choices: employeeName,
                name: "removeChoice"
            },
        ]).then(answer => {
            connection.query(`DELETE FROM employee WHERE first_name = "${answer.removeChoice.split(" ")[0]}"`, (err, res) => {
                if(err) throw err;
                console.log(`Removed ${answer.removeChoice.split(" ")[0]} ${answer.removeChoice.split(" ")[1]} from Employee database \n`);
                startCSM();
            })  
        })
    
}