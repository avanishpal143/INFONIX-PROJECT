import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description: string
  icon: string
  color: string
  isActive: boolean
  templateCount: number
  createdAt: Date
}

const CategorySchema = new Schema<ICategory>({
  name:          { type: String, required: true, trim: true, unique: true },
  slug:          { type: String, required: true, trim: true, unique: true, lowercase: true },
  description:   { type: String, default: '' },
  icon:          { type: String, default: '📁' },
  color:         { type: String, default: '#3B82F6' },
  isActive:      { type: Boolean, default: true },
  templateCount: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
