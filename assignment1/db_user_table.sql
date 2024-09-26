-- Create the database
CREATE DATABASE IF NOT EXISTS People;

-- Use the database
USE People;

-- Create the Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lastname VARCHAR(50),
    firstname VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100)
);

-- Insert 10 starter rows into the Users table
INSERT INTO Users (lastname, firstname, email, password) VALUES
('Smith', 'John', 'john.smith@example.com', 'password1'),
('Doe', 'Jane', 'jane.doe@example.com', 'password2'),
('Brown', 'Charlie', 'charlie.brown@example.com', 'password3'),
('Finch', 'Atticus', 'atticus.finch@example.com', 'password4'),
('Parker', 'Peter', 'peter.parker@example.com', 'password5'),
('Stark', 'Tony', 'tony.stark@example.com', 'password6'),
('Rogers', 'Steve', 'steve.rogers@example.com', 'password7'),
('Banner', 'Bruce', 'bruce.banner@example.com', 'password8'),
('Kent', 'Clark', 'clark.kent@example.com', 'password9'),
('Wayne', 'Bruce', 'bruce.wayne@example.com', 'password10');