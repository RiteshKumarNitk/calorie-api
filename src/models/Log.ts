import mongoose, { Document, Schema } from 'mongoose';

export interface ILog extends Document {
  userId: string;
  foodId: string;
  quantity: number;
  totalCalories: number;
  date: Date;
}

const LogSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodId: {
    type: Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalCalories: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model<ILog>('Log', LogSchema);