/* Replace with your SQL commands */

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  tel_id INT,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  value VARCHAR(255)
);

CREATE TABLE masters (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users (id) ON DELETE CASCADE,
  chat_id INT,
  date INT,
  text VARCHAR(255)
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users (id) ON DELETE CASCADE,
  master_id INT REFERENCES masters (id) ON DELETE CASCADE,
  date DATE,
  time TIME
);

CREATE TABLE appointments_services (
  id SERIAL PRIMARY KEY,
  appointments_id INT REFERENCES appointments (id) ON DELETE CASCADE,
  services_id INT REFERENCES services (id) ON DELETE CASCADE
);

INSERT INTO masters (first_name, last_name) 
VALUES
  ('Jorj', 'Kripovskiy'),
  ('Edward', 'Coacher'),
  ('Ivan', 'Ivanov');

INSERT INTO services (value) 
VALUES
  ('haircut'),
  ('shaving'),
  ('both');
