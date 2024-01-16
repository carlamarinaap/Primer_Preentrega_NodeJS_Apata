/* --------CAPA DE INTERACCION---------- */

const express = require('express');
const app = express();
const ProductManager = require('./productMaganer');
const pm = new ProductManager('./productos.json');
const routerProducts = require('./routes/products.router')
const routerCarts = require('./routes/carts.router')


app.use(express.json()); // Esto devuelve un middleware
app.use(routerProducts);
app.use(routerCarts);

app.use(express.urlencoded({extended:true}))

/* --------Test de vida del servidor---------- */
app.get('/ping', (req,res) => res.status(200).send('Pong!'))
/* ------------------------------------------- */


// Raíz
app.get('/', (req,res) => {
 res.status(200).send('<h1>Primer Preentrega de Apata Carla</h1>')
});

// Puerto donde escucha
app.listen(8080, () => console.log('Servidor levantado en puerto 8080'));
