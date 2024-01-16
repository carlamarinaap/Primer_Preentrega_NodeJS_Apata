const express = require('express');
const router = express.Router();
const ProductManager = require('../productMaganer');
const pm = new ProductManager('./productos.json');

router.get('/api/products', async (req,res ) => {
  try {
    const {limit} = req.query;
    const products = await pm.getProducts();
    
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).send(limitedProducts);
    } else {
      res.status(200).send(products);
    }
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }

})

router.get('/api/products/:pid', async (req,res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await pm.getProductById(productId);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
})

router.post('/api/products', (req,res) => {
  try{
    pm.addProduct(req.body)
    res.status(200).send('')
  } catch (error) {
    res.status(500).send('Error al agregar el producto');
  }

})

router.put('/api/products/:pid', (req,res) => {
  try {
    const productId = parseInt(req.params.pid);
    pm.updateProduct(productId, req.body)
    res.status(200).send('')
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
})

router.delete('/api/products/:pid', (req,res ) => {
  try{
    const productId = parseInt(req.params.pid);
    pm.deleteProduct(productId)
    res.status(200).send('Producto eliminado')
  } catch (error){
    res.status(500).send('Error al eliminar el producto');
  }
})

module.exports = router;