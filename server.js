const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    // Your password
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
            console.log(answers);
            // switch (answer.action) {
            //     case "View all employees":
            //       employeeView();
            //       break;
        
            //     case "View all departments":
            //       departmentView();
            //       break;          
        });
}
