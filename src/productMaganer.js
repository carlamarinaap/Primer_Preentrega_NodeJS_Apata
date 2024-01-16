/* --------------CAPA DE NEGOCIO---------------- */

const { error } = require('console');

const fs = require('fs').promises;
class ProductManager {
  constructor(ruta) {
    this.path = ruta,
    this.#id = 0
  }

  #id;

  getProducts = async () =>  {
    try {
      let colectionJSON = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(colectionJSON)
    } 
    catch (error) {
      await fs.writeFile(this.path, '[]');
      let colectionJSON = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(colectionJSON)
    }
  } 

  addProduct =  async (product) => {
    try {
      let {title, description, price, thumbnails, code, stock, category,id} = product
      if (!title || !description || !price || !code || !stock || !category) {
        console.log(`El producto debe tener todos los campos completos`);
      }
      let colectionJSON = await this.getProducts();
      let exists = colectionJSON.some((prod) => prod.code === code)
      if (exists) {
        console.log(`Ya existe un producto con el código ${code}`);
      } else {
        if(!id){
          while (colectionJSON.some((prod) => prod.id === this.#id)) {
            this.#id = this.#id + 1
          }
          product.id = this.#id;
        } else {
          if (colectionJSON.some((prod) => prod.id === id)) {
            console.log(`Ya existe un producto con el id ${product.id}`)
          } else {
            product.status = true
            if(!thumbnails || !Array.isArray(thumbnails)){
              product.thumbnails = []
            } 
            colectionJSON.push({...product})
            await fs.writeFile(this.path, JSON.stringify(colectionJSON))
            console.log(`Se agregó el producto "${product.title}" a la colección`);
          }
        }
      }
    }
    catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`)
    }
  }

  getProductById = async (productId) =>  {
    try {
      let colectionJSON = await this.getProducts();
      let exists = colectionJSON.find((prod) => prod.id === productId)
      if (exists) {
        return exists
      } else {
        return `Not found id: ${productId}`
      }
    }
    catch (error) {
      throw new Error(`Error al encontrar el producto: ${error.message}`)
    }
  }
  
  updateProduct = async (productId, updates) => {
    try {
      let colectionJSON = await this.getProducts();
      let exists = colectionJSON.find((prod) => prod.id === productId)
      if (exists) {
        let {title, description, price, thumbnails, code, stock, category,id,status} = updates
        if (!id ||!title || !description || !price || !thumbnails || !code || !stock || !category || !status) {
          console.log(`El producto debe tener todos los campos completos`);
        } else {
          await this.deleteProduct(productId)
          await this.addProduct(updates)
        }
      } else {
        return `Not found id: ${productId}`
      }
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`)
    }
  }

  deleteProduct = async (productId) => {
    try {
      let colectionJSON = await this.getProducts();
      if (colectionJSON.find((prod) => prod.id === productId)) {
        let newArray = colectionJSON.filter((prod) => prod.id !== productId)
        await fs.writeFile(this.path, JSON.stringify(newArray))
        console.log(`Se eliminó el producto con id: ${productId}:`);
        console.log(colectionJSON.find((prod) => prod.id === productId));
      } else {
        console.log(`No se encontró el producto con id: ${productId}`);
      }
    }
    catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`)
    }
  }
}
module.exports =  ProductManager;