DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  department_name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL, 
  role_id INT NULL,
  manager_id INT NULL DEFAULT false,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

-- Inserted a set of records into the table
INSERT INTO department (department_name)
VALUES ("Production"),("Research"),("Marketing"),("Purchasing"),("Human Resource"),("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales person", 100000.00, 1),("Intern", 40000.00, 2),("Manager", 150000.00, 3),
("Purchasing", 111000.00, 4),("HR", 115000.00, 5),("Accountant", 950000.00, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Bannoura", 1, null),("George", "Banks", 2, 1),("William", "Chairez", 3, 2),("Luke", "Dickens", 4, 2),("Anna", "Dunn", 5, 3),
("Makayla", "Forman", 1, null),("Scottie", "Giles", 1, 1),("Nolan", "Gonzalez", 1, null),("Molly", "Hallsey", 5, null);



