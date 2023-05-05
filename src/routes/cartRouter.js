import { Router } from "express";
const router = Router();
import {
  getAllCarts,
  getCartById,
  saveProductToCart,
  createCart,
} from "../managers/cartManager.js";

import { getProductById } from "../managers/productsManager.js";

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const cart = req.body;
    const newCart = await createCart(cart);
    res.json(newCart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post('/:idCart/product/:idProd', async (req, res) => {
  try {
      const {idCart, idProd} = req.params;
      await getCartById(idCart)
      await getProductById(idProd)
      await saveProductToCart(Number(idCart), Number(idProd))
      res.status(200).send(`Se agrego correctamente el producto: ${idProd} al carrito: ${idCart}.`)

  } catch (error) {
      res.status(400).json({ message: error.message })
  }
})

router.get("/", async (req, res) => {
  try {
    const carts = await getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
});

router.get("/:idCart", async (req, res) => {
  try {
    const { idCart } = req.params;
    const cart = await getCartById(Number(idCart));
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(400).send("cart not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;