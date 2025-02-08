-- Connect to the database
\connect budget_calculator;


TRUNCATE TABLE budget_items RESTART IDENTITY CASCADE;

INSERT INTO budget_items (name, cost, freq, start_date) VALUES
  ('Spotify', 10.99, 'Monthly', '2024-01-01T12:00:00.000Z'),
  ('Rent', 1200.00, 'Monthly', '2024-01-05T12:00:00.000Z'),
  ('Car Payment', 350.00, 'BiWeekly', '2024-01-10T12:00:00.000Z'),
  ('Groceries', 200.00, 'BiWeekly', '2024-01-15T12:00:00.000Z'),
  ('Insurance', 1000.00, 'Yearly', '2024-01-20T12:00:00.000Z'),
  ('Gym', 500.00, 'Yearly', '2024-01-25T12:00:00.000Z');


TRUNCATE TABLE debt_items RESTART IDENTITY CASCADE;

INSERT INTO debt_items (name, amount) VALUES
  ('Credit Card', 4560.25),
  ('Student Loan', 15000.00),
  ('Car Loan', 12000.00);


TRUNCATE TABLE app_settings RESTART IDENTITY CASCADE;

INSERT INTO app_settings (monthly_income) VALUES (2500.00);