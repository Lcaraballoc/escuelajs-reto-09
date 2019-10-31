const express = require('express');
const path = require('path');
const ProductService = require('../services');
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/products', router);

  const productService = new ProductService();

  router.get('/api', (req, res) => {
    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get('/', async (req, res, next) => {
    const storeProducts = await productService.getProducts()
    res.status(200).json(storeProducts);
  });

  router.post('/', async function (req, res, next) {
    const { body: product } = req;
    try {
      const createProductId = await productService.createProduct({ product });
      res.status(201).json({
        data: createProductId,
        message: 'product created'
      });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/:productId", async function (req, res, next) {
    const { productId } = req.params;
    try {
      const products = await productService.getProduct({ productId })

      res.status(200).json({
        data: products,
        message: 'movie retreived'
      })

    } catch (err) {
      next(err);
    }
  });

  router.put("/:productId", async function (req, res, next) {
    const { productId } = req.params;
    const { body: product } = req;
    try {
      const updatedProductId = await productService.updateProduct({
        productId,
        product
      })

      res.status(200).json({
        data: updatedProductId,
        message: 'product updated'
      })

    } catch (err) {
      next(err);
    }
  });

  router.delete("/:productId", async function (req, res, next) {
    const { productId } = req.params;
    try {
      const deletedProductId = await productService.deleteProduct({ productId })

      res.status(200).json({
        data: deletedProductId,
        message: 'product deleted'
      })

    } catch (err) {
      next(err);
    }
  });

  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;