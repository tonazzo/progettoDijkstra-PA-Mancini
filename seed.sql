DROP DATABASE IF EXISTS dbpa;

CREATE DATABASE dbpa;
\c dbpa

DROP TABLE IF EXISTS users;

CREATE TABLE users(
    email VARCHAR(100),
    role VARCHAR(100),
    token NUMERIC,
    PRIMARY KEY(email)
);

CREATE TABLE models(
    id serial,
    user_email VARCHAR(100),
    description VARCHAR(10000),
    cost NUMERIC,
    PRIMARY KEY(id) 
);

CREATE TABLE revisions(
    model_id NUMERIC,
    start VARCHAR(100),
    goal VARCHAR(100),
    description VARCHAR(1000),
    cost NUMERIC,
    path VARCHAR(10000),
    cancelled VARCHAR(100),
    date NUMERIC,
    token_cost NUMERIC,
    PRIMARY KEY(model_id, start, goal, description)
);

INSERT INTO users (email, role, token) VALUES 
  ('tony@dj.it', 'admin', 1000),
  ('giovy@dj.it', 'user', 100),
  ('rich@dj.it', 'user', 500),
  ('poor@dj.it', 'user', 0);
  

