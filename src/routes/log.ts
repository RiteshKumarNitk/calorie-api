import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware'; // Corrected import
import Log from '../models/Log'; // Assuming default export
import { Food } from '../models/Food';
import mongoose from 'mongoose';
 
const router = express.Router();

// POST /logs - Add food entry to today's log
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;
    const userId = (req as any).user.userId;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    const totalCalories = (food.caloriesPer100g / 100) * quantity; // Calculation corrected

    const newLogEntry = new Log({
      userId,
      foodId,
      quantity,
      totalCalories,
      date: new Date().setHours(0, 0, 0, 0), // Set date to the beginning of the day
    });

    await newLogEntry.save();

    res.status(201).json(newLogEntry);
  } catch (error) {
    next(error);
  }
});

// GET /logs/today - Get today's calorie log for the logged-in user
router.get('/today', authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set date to the beginning of the day

    const todayLogs = await Log.find({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Until the beginning of the next day
      },
    }).populate('foodId', 'name caloriesPer100g'); // Populate food details

    res.status(200).json(todayLogs);
  } catch (error) {
    next(error);
  }
});

// GET /logs/history - Get history of calorie logs
router.get('/history', authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const historyLogs = await Log.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'foods',
          localField: 'foodId',
          foreignField: '_id',
          as: 'food',
        },
      },
      {
        $unwind: '$food',
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
          },
          entries: {
            $push: {
              _id: '$_id',
              food: '$food.name',
              quantity: '$quantity',
              totalCalories: '$totalCalories',
            },
          },
          totalCaloriesForDay: { $sum: '$totalCalories' },
        },
      },
      {
        $sort: { '_id.date': -1 }, // Sort by date descending
      },
    ]);

    res.status(200).json(historyLogs);
  } catch (error) {
    next(error);
  }
});

export default router;