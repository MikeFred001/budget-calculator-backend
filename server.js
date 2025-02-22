require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["https://girl-math-monthly.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());



//--BUDGET ITEM ROUTES--------------------------------------------------------//

// Get all budget items
app.get("/api/budget-items", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM budget_items ORDER BY id`);

    const formattedData = result.rows.map(item => ({
      ...item,
      cost: parseFloat(item.cost)
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single budget item
app.get("/api/budget-items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.query(`
      SELECT *
      FROM budget_items
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Budget item not found" });
    }

    res.json({ ...result.rows[0], cost: parseFloat(result.rows[0].cost) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new budget item
app.post("/api/budget-items", async (req, res) => {
  try {
    const { name, cost, freq, startDate } = req.body;
    const result = await db.query(`
      INSERT INTO budget_items (name, cost, freq, start_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [name, cost, freq, startDate]
    );
    res.json({ ...result.rows[0], cost: parseFloat(result.rows[0].cost) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a budget item
app.delete("/api/budget-items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.query(`DELETE FROM budget_items WHERE id = $1`, [id]);

    res.json({ message: `ID: ${id} - Budget item deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//--DEBT ITEM ROUTES----------------------------------------------------------//

// Get all debt items
app.get("/api/debt-items", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM debt_items ORDER BY id`);

    const formattedData = result.rows.map(item => ({
      ...item,
      amount: parseFloat(item.amount)
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a debt item
app.post("/api/debt-items", async (req, res) => {
  try {
    const { name, amount } = req.body;
    const result = await db.query(`
      INSERT INTO debt_items (name, amount)
      VALUES ($1, $2)
      RETURNING *`,
      [name, amount]
    );
    res.json({ ...result.rows[0], amount: parseFloat(result.rows[0].amount) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a debt item
app.put("/api/debt-items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, amount } = req.body;
    const result = await db.query(`
      UPDATE debt_items
      SET name = $1, amount = $2
      WHERE id = $3
      RETURNING *`,
      [name, amount, id]
    );
    res.json({ ...result.rows[0], amount: parseFloat(result.rows[0].amount) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a debt item
app.delete("/api/debt-items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.query("DELETE FROM debt_items WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//--APP SETTING ROUTES--------------------------------------------------------//

// Get monthly income
app.get("/api/app-settings", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT monthly_income FROM app_settings
    `);

    if (!result.rows.length) {
      return res.status(404).json({ error: "App settings not found" });
    }

    res.json({ monthlyIncome: parseFloat(result.rows[0].monthly_income) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update monthly income
app.put("/api/app-settings", async (req, res) => {
  try {
    const { monthlyIncome } = req.body;
    const result = await db.query(`
      UPDATE app_settings
      SET monthly_income = $1
      WHERE id = 1
      RETURNING *`,
      [monthlyIncome]
    );
    res.json({ monthlyIncome: parseFloat(result.rows[0].monthly_income) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});