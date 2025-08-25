import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  name: string;
  caloriesPer100g: number;
  createdBy: mongoose.Types.ObjectId;
}

const FoodSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  caloriesPer100g: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IFood>('Food', FoodSchema);