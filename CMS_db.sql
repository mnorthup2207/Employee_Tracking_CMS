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
  salary DECIMAL(6,2) NOT NULL,
  department_ID INT NOT NULL
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

SELECT first_name, last_name, title
FROM employee AS a
INNER JOIN role AS B on A.role_id = B.id
INNER JOIN department AS C on B.department_id = C.id
WHERE C.name = "Sales";

SELECT * FROM employee AS A 
INNER JOIN role AS B on A.role_id = B.id 
INNER JOIN department AS C on B.department_id = C.id;

SELECT * FROM items