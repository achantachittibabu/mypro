const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const logger = require('../utils/logger');

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let filters = { isActive: true };

    if (category) {
      filters.category = category;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filters).limit(100);

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, image } = req.body;

    if (!name || !price) {
      logger.warn('Product creation validation failed', { name, price });
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      sku,
      image
    });

    await product.save();
    logger.info('Product record saved successfully', { productid: product._id, name: product.name });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    logger.error('Product record was not inserted into database', { error: error.message });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, image, isActive, rating } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn('Product not found for update', { productId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (sku) product.sku = sku;
    if (image) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;
    if (rating !== undefined) product.rating = rating;

    await product.save();
    logger.info('Product record updated successfully', { productid: req.params.id });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    logger.error('Error updating product', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add review to product
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, comment, rating } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn('Product not found for review', { productId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = {
      userId,
      comment,
      rating: Math.min(Math.max(rating, 0), 5)
    };

    product.reviews.push(review);
    await product.save();
    logger.info('Product review saved successfully', { productid: req.params.id, userid: userId });

    res.json({
      success: true,
      message: 'Review added successfully',
      data: product
    });
  } catch (error) {
    logger.error('Error adding product review', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
