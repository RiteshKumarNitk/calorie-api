import express from 'express';
import { Food } from '../models/Food';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// GET /foods - Search and list foods
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let foods;

    if (search) {
      foods = await Food.find({ name: new RegExp(search as string, 'i') });
    } else {
      foods = await Food.find();
    }

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// POST /foods - Add new food (protected)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { name, caloriesPer100g } = req.body;

    // Check if food already exists
    const existingFood = await Food.findOne({ name: new RegExp(name, 'i') });
    if (existingFood) {
      return res.status(400).json({ message: 'Food with this name already exists.' });
    }

    const newFood = new Food({
      name,
      caloriesPer100g,
      createdBy: req.user._id, // Assuming user ID is attached to req.user
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;