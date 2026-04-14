import mongoose, { Schema, Document } from 'mongoose'

export interface IPortfolio extends Document {
    title: string
    description: string
    category: string
    image: string
    url: string
    tags: string[]
    featured: boolean
    isActive: boolean
    order: number
    createdAt: Date
    updatedAt: Date
}

const PortfolioSchema = new Schema<IPortfolio>({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    url: { type: String, default: '' },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema)
