/* Replace with your SQL commands */
SET TIMEZONE=0;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  tel_id INT,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE masters (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  users_id INT REFERENCES users (id) ON DELETE CASCADE,
  masters_id INT REFERENCES masters (id) ON DELETE CASCADE,
  email VARCHAR(255),
  date TIMESTAMPTZ,
  service VARCHAR(255)
);

INSERT INTO masters (first_name, last_name) 
VALUES
  ('Jorj', 'Kripovskiy'),
  ('Edward', 'Coacher'),
  ('Ivan', 'Ivanov');

CREATE VIEW todayAppointments AS
SELECT u.id as user_id, u.first_name, u.last_name, a.id as appointment_id, a.masters_id, a.email, a.date, a.service FROM users u, appointments a
WHERE u.id = a.users_id AND a.date > NOW()::DATE AND a.date < NOW()::DATE + INTERVAL '1 day';

CREATE FUNCTION analysis(service VARCHAR(255))
RETURNS TABLE (uniq_users BIGINT, service VARCHAR(255))
AS $$
  SELECT COUNT(DISTINCT u.id), a.service 
  FROM appointments a JOIN users u ON a.users_id = u.id 
  WHERE LOWER(a.service) = LOWER(service) AND a.date::TIMESTAMP < NOW() AND a.date::TIMESTAMP > NOW() - INTERVAL '1 month'
  GROUP BY a.service;
$$
LANGUAGE SQL
