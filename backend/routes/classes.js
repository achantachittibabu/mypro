const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Create a new class
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a class by ID
router.get('/:id', async (req, res) => {
  try {
    const foundClass = await Class.findById(req.params.id).populate('teacher').populate('students');
    if (!foundClass) return res.status(404).json({ error: 'Class not found' });
    res.json(foundClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a class
router.put('/:id', async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ error: 'Class not found' });
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a class
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
