import { Router } from "express";
const router = Router();
import { createProduct, 
    updateProduct, 
    deleteProductById, 
    deleteAllProducts, 
    getAllProducts, 
    getProductById 
} from "../managers/productsManager.js";

import { productValidator } from "../middlewares/productValidator.js";

router.get('/', async(req, res) => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});

router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductById(Number(id));
        if(product){
            res.status(200).json({product })
        } else {
            res.status(400).send('No se pudo encontrar el producto')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.post('/', productValidator, async (req, res)=>{
    try {
        const product = req.body;
        const newProduct = await createProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put('/:id', async(req, res) => {
    try {
        const product = req.body;
        const { id } = req.params;
        const productFile = await getProductById(Number(id));
        if(productFile){
            await updateProduct(product, Number(id));
            res.send(`El producto se actualizo correctamente`);
        } else {
            res.status(404).send('No se pudo encontrar el producto')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

router.delete('/:id', async(req, res)=>{
    try {
        const { id } = req.params;
        const products = await getAllProducts();
        if(products.length > 0){
            await deleteProductById(Number(id));
            res.send(`El producto ${id} fue eliminado correctamente`);
        } else {
            res.send(`El producto ${id} no se encontro`);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

router.delete('/', async(req, res)=>{
    try {
        await deleteAllProducts();
        res.send('Se eliminaron todos los productos correctamente')
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

export default router;