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

export const getCartById =async(id)=>{
    try {
        const carts = await getAllCarts();
        const cart = carts.find((cart) => cart.id === id);
        if(cart) {
            return cart
        }
        return false;
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

export const saveProductToCart = async (idCart, idProd) =>{
    try {
        const carts = await getAllCarts()
            const cart = carts.find(carts => carts.id == idCart)
        if (cart) {
            const products = await getProducts()
            if (products) {
                const prodExistant = products.find(product => product.id == idProd)
                if (prodExistant) {
                    const restCarts = carts.filter(cart => cart.id != idCart)
                    if (cart.products.length) {
                        const newProduct = {
                            id: cart.id,
                            products: [{
                                id: cart.products[0].id,
                                quantity: cart.products[0].quantity + 1
                            }]
                        }
                        restCarts.push(newProduct)
                        await fs.promises.writeFile(pathFile, JSON.stringify(restCarts))
                        return newProduct
                    } else {
                        cart.products.push({ id: prodExistant.id, quantity: 1 })
                        restCarts.push(cart)
                        await fs.promises.writeFile(pathFile, JSON.stringify(restCarts))
                        return cart
                    }

                } else {
                    return console.log('El producto no se pudo encontrar')
                }
            } else {
                return console.log('No hay productos')
            }
        } else {
            return console.log(`El carrito buscado no existe.`)
        }
    } catch (error) {
        return console.log(error)
    }
}
