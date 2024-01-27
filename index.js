const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(express.json());

const dbPromise = open({
    filename: 'data.db',
    driver: sqlite3.Database
});

// Inicializa la base de datos
async function initializeDB() {
    const db = await dbPromise;
    await db.exec('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT)');
}

initializeDB();

// CRUD Operations

// Create
app.post('/items', async (req, res) => {
    const db = await dbPromise;
    const { name } = req.body;
    const result = await db.run('INSERT INTO items (name) VALUES (?)', [name]);
    res.json({ id: result.lastID });
});

// Read (All Items)
app.get('/items', async (req, res) => {
    const db = await dbPromise;
    const items = await db.all('SELECT * FROM items');
    res.json(items);
});

// Read (Single Item)
app.get('/items/:id', async (req, res) => {
    const db = await dbPromise;
    const item = await db.get('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json(item);
});

// Update
app.put('/items/:id', async (req, res) => {
    const db = await dbPromise;
    const { name } = req.body;
    await db.run('UPDATE items SET name = ? WHERE id = ?', [name, req.params.id]);
    res.json({ success: true });
});

// Delete
app.delete('/items/:id', async (req, res) => {
    const db = await dbPromise;
    await db.run('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});