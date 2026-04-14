import mongoose, { Schema, Document } from 'mongoose'

export interface ITemplate extends Document {
  name: string
  category: string
  icon: string
  desc: string
  color: string
  accentColor: string
  tags: string[]
  popular: boolean
  isActive: boolean
  previewImage: string
  files: string[]
  usageCount: number
  templateType: 'general' | 'portfolio'
  createdAt: Date
  updatedAt: Date
}

const TemplateSchema = new Schema<ITemplate>({
  name:         { type: String, required: true, trim: true },
  category:     { type: String, required: true, trim: true },
  icon:         { type: String, default: '🌐' },
  desc:         { type: String, default: '' },
  color:        { type: String, default: 'linear-gradient(135deg,#3B82F6,#2563EB)' },
  accentColor:  { type: String, default: '#3B82F6' },
  tags:         { type: [String], default: [] },
  popular:      { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  previewImage: { type: String, default: '' },
  files:        { type: [String], default: [] },
  usageCount:   { type: Number, default: 0 },
  templateType: { type: String, enum: ['general', 'portfolio'], default: 'general' },
}, { timestamps: true })

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema)
