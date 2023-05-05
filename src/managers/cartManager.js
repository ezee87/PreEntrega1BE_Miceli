import fs from 'fs';
import { __dirname } from '../path.js';

const pathFile = __dirname + '/fs/carts.json';
const pathProductManager = __dirname + '/fs/products.json'

export const getMaxId = async () => {
  let maxId = 0;
  const carts = await getAllCarts();
  carts.map((cart) => {
    if (cart.id > maxId) maxId = cart.id;
  });
  return maxId;
};

export const getAllCarts = async() =>{
    try {
        if(fs.existsSync(pathFile)){
            const carts = await fs.promises.readFile(pathFile, 'utf-8');
            const cartsJSON = JSON.parse(carts);
            return cartsJSON; 
        } else {
            return []
        }
        
    } catch (error) {
        console.log(error);
    }
}

export const createCart = async(obj)=>{
    try {
        const cart = {
            id: await getMaxId() + 1,
            products: []
        };
        const cartsFile = await getAllCarts();
        cartsFile.push(cart);
        await fs.promises.writeFile(pathFile, JSON.stringify(cartsFile));
        return cart;
    } catch (error) {
        console.log(error);
    }
}

const getProducts = async() =>{
    const products = await fs.promises.readFile(pathProductManager, 'utf-8')
    const productsJSON = JSON.parse(products)
    return productsJSON
}

export const getCartById = async (id) => {
    try {
      const carts = await getAllCarts();
      const cart = carts.find((cart) => cart.id === parseInt(id));
      if (cart) {
        return cart;
      }
      return null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  export const saveProductToCart = async (idCart, idProd) => {
    try {
      const carts = await getAllCarts();
  
      let cart;
      try {
        cart = await getCartById(idCart);
        console.log('cart:', cart);
      } catch (error) {
        console.log(error);
        return;
      }
  
      if (!cart) {
        console.log(`El carrito ${idCart} no existe.`);
        return;
      }
  
      const productsFileExists = fs.existsSync(pathProductManager);
      if (!productsFileExists) {
        console.log('El archivo products.json no existe.');
        return;
      }
  
      const products = await getProducts();
      if (!products) {
        console.log('No se encontraron productos.');
        return;
      }
  
      const product = products.find(product => product.id === parseInt(idProd));
      if (!product) {
        console.log(`El producto ${idProd} no existe.`);
        return;
      }
  
      const existingProduct = cart.products.find(product => product.id === parseInt(idProd));
      
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ id: idProd, quantity: 1 });
      }
      
      const updatedCarts = carts.map(c => {
        if (c.id === idCart) {
          return cart;
        } else {
          return c;
        }
      });
      
      await fs.promises.writeFile(pathFile, JSON.stringify(updatedCarts));
      
      return cart;
      
    } catch (error) {
      console.log(error);
      throw error;
    }

  }
    