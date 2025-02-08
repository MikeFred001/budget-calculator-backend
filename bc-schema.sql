-- Connect to the postgres database (This is because you cannot drop a database while connected to it)
\connect postgres

-- Terminate all active connections to the budget_calculator database
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'budget_calculator';

-- Drop the budget_calculator database if it exists
DROP DATABASE IF EXISTS budget_calculator;

-- Create a new budget_calculator database
CREATE DATABASE budget_calculator;

-- Connect to the new budget_calculator database
\connect budget_calculator

CREATE TABLE app_settings (
  id SERIAL PRIMARY KEY,
  monthly_income NUMERIC(10,2) NOT NULL
);

CREATE TABLE budget_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cost NUMERIC(10, 2) NOT NULL,
  freq TEXT NOT NULL CHECK (freq IN ('BiWeekly', 'Monthly', 'Yearly')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE debt_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);