const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Wartet bis die Datenbank bereit ist, dann erstellt die Tabelle
const connectWithRetry = async () => {
  for (let i = 0; i < 10; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS artikel (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL
        )
      `);
      console.log('Datenbank verbunden und Tabelle bereit');
      return;
    } catch (err) {
      console.log(`Datenbank noch nicht bereit, versuche erneut... (${i + 1}/10)`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

connectWithRetry();

// GET - Alle Artikel abrufen
app.get('/artikel', async (req, res) => {
  const result = await pool.query('SELECT * FROM artikel');
  res.json(result.rows);
});

// POST - Neuen Artikel erstellen
app.post('/artikel', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    'INSERT INTO artikel (name) VALUES ($1) RETURNING *',
    [name]
  );
  res.json(result.rows[0]);
});

// PUT - Artikel aktualisieren
app.put('/artikel/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await pool.query(
    'UPDATE artikel SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  res.json(result.rows[0]);
});

// DELETE - Artikel löschen
app.delete('/artikel/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM artikel WHERE id = $1', [id]);
  res.json({ message: 'Artikel gelöscht' });
});

app.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});