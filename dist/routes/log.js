"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = require("../middleware/authMiddleware"); // Corrected import
var Log_1 = __importDefault(require("../models/Log")); // Assuming default export
var Food_1 = require("../models/Food");
var mongoose_1 = __importDefault(require("mongoose"));
var router = express_1.default.Router();
// POST /logs - Add food entry to today's log
router.post('/', authMiddleware_1.authMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, foodId, quantity, userId, food, totalCalories, newLogEntry, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, foodId = _a.foodId, quantity = _a.quantity;
                userId = req.user.userId;
                return [4 /*yield*/, Food_1.Food.findById(foodId)];
            case 1:
                food = _b.sent();
                if (!food) {
                    return [2 /*return*/, res.status(404).json({ message: 'Food not found' })];
                }
                totalCalories = (food.caloriesPer100g / 100) * quantity;
                newLogEntry = new Log_1.default({
                    userId: userId,
                    foodId: foodId,
                    quantity: quantity,
                    totalCalories: totalCalories,
                    date: new Date().setHours(0, 0, 0, 0), // Set date to the beginning of the day
                });
                return [4 /*yield*/, newLogEntry.save()];
            case 2:
                _b.sent();
                res.status(201).json(newLogEntry);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /logs/today - Get today's calorie log for the logged-in user
router.get('/today', authMiddleware_1.authMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, today, todayLogs, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.userId;
                today = new Date();
                today.setHours(0, 0, 0, 0); // Set date to the beginning of the day
                return [4 /*yield*/, Log_1.default.find({
                        userId: userId,
                        date: {
                            $gte: today,
                            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Until the beginning of the next day
                        },
                    }).populate('foodId', 'name caloriesPer100g')];
            case 1:
                todayLogs = _a.sent();
                res.status(200).json(todayLogs);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /logs/history - Get history of calorie logs
router.get('/history', authMiddleware_1.authMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, historyLogs, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.userId;
                return [4 /*yield*/, Log_1.default.aggregate([
                        {
                            $match: { userId: new mongoose_1.default.Types.ObjectId(userId) },
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
                    ])];
            case 1:
                historyLogs = _a.sent();
                res.status(200).json(historyLogs);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=log.js.map