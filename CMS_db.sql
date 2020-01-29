DROP DATABASE IF EXISTS CMS_db;

CREATE DATABASE CMS_db;

USE CMS_db;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_ID INT NOT NULL,
  manager_ID INT
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_ID INT NOT NULL
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);
  
SELECT * FROM employee AS A 
INNER JOIN role AS B on A.role_id = B.id 
INNER JOIN department AS C on B.department_id = C.id;

SELECT first_name, last_name, title
FROM employee AS A
INNER JOIN role AS B on A.role_id = B.id
INNER JOIN department AS C on B.department_id = C.id
WHERE C.name = "Engineering";

SELECT b.first_name AS 'Employee First', b.last_name AS 'Employee Last', a.first_name AS 'Manager First', a.last_name AS 'Manager Last'
FROM employee AS a
INNER JOIN employee AS b
ON a.id = b.manager_ID
WHERE b.manager_ID IS NOT NULL;

DELETE FROM employee WHERE first_name = "Carl";

SELECT first_name FROM employee;

SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM role;
