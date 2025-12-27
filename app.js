const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Usamos el puerto 3001

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de la Base de Datos
// NOTA: Usamos 'localhost' porque esta app corre en el VPS, fuera de Docker
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la BD
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL Base de Datos');
});

// Ruta Principal: Dashboard
app.get('/', (req, res) => {
    const query = 'SELECT * FROM reservations ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.send('Error al obtener datos');
        } else {
            // Renderizamos la vista 'index' y le pasamos los datos
            res.render('index', { reservations: results });
        }
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor Dashboard corriendo en http://localhost:${port}`);
});
